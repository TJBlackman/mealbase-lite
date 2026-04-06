# Mealbase Development Plan - Critique and Resolutions

## Technical Issues

### Next.js version doesn't exist

Next.js 16 isn't released. Current stable is 15.

**Resolution**: Change to Next.js 15 (App Router).

---

### SharedAssets type safety

`assetId` is `v.string()` instead of typed IDs, losing compile-time safety.

**Resolution**: Use a discriminated union:

```ts
sharedAssets: defineTable({
  ownerId: v.id("users"),
  sharedWithId: v.id("users"),
  asset: v.union(
    v.object({ type: v.literal("recipe"), id: v.id("recipes") }),
    v.object({ type: v.literal("mealPlan"), id: v.id("mealPlans") }),
    v.object({ type: v.literal("shoppingList"), id: v.id("shoppingLists") }),
    v.object({
      type: v.literal("recipeCustomization"),
      id: v.id("recipeCustomizations"),
    })
  ),
  createdAt: v.number(),
  deletedAt: v.optional(v.number()),
});
```

---

### Convex search on arrays

`searchIndex` on `aliases` array field won't work as expected.

**Resolution**: Add a `searchableAliases` string field that concatenates aliases:

```ts
ingredients: defineTable({
  canonicalName: v.string(),
  aliases: v.array(v.string()),
  searchableAliases: v.string(), // "garlic clove|garlic|clove of garlic"
  defaultUnit: v.optional(v.string()),
  // ...
}).searchIndex("search_aliases", { searchField: "searchableAliases" });
```

Populate via mutation: `aliases.join("|")`.

---

### Ingredient aggregation ignores unit conversion

`2 cups` + `8 tbsp` won't merge.

**Resolution**: Add a unit conversion system:

```ts
// src/lib/units.ts
const VOLUME_TO_ML: Record<string, number> = {
  ml: 1,
  tsp: 4.929,
  tbsp: 14.787,
  cup: 236.588,
  // ...
};

function convertToBaseUnit(
  quantity: number,
  unit: string
): { quantity: number; baseUnit: string } | null {
  if (unit in VOLUME_TO_ML) {
    return { quantity: quantity * VOLUME_TO_ML[unit], baseUnit: "ml" };
  }
  // Handle weight, count, etc.
  return null;
}

function formatFromBaseUnit(
  quantity: number,
  baseUnit: string
): { quantity: number; unit: string } {
  // Convert back to most readable unit (e.g., 473ml -> 2 cups)
}
```

Aggregate in base units, then convert back to readable units for display.

---

### Preparation field in aggregation key

"1 cup diced onion" and "1 cup sliced onion" stay separate.

**Resolution**: Intentional behavior - document it explicitly. Add a note in the spec:

> Items with different preparation methods remain separate in shopping lists since they may require different quantities or handling.

---

## Data Model Concerns

### RecipeVersions storage explosion

Every edit creates a full copy. No cleanup strategy.

**Resolution**: Add a retention policy and cleanup job:

```ts
// Retention: keep last 10 versions, or all versions from last 90 days, whichever is more
// Run daily via Convex cron
export const cleanupOldVersions = internalMutation(async ({ db }) => {
  const cutoff = Date.now() - 90 * 24 * 60 * 60 * 1000;
  // For each recipe, keep versions where:
  // - version is in top 10, OR
  // - createdAt > cutoff
});
```

---

### Friendship queries are awkward

Finding all friends requires two index queries plus deduplication.

**Resolution**: Create two rows per accepted friendship:

```ts
// When friendship is accepted, create a symmetric pair in a separate table
friends: defineTable({
  userId: v.id("users"),
  friendId: v.id("users"),
  friendshipId: v.id("friendships"), // reference to original request
  createdAt: v.number(),
  deletedAt: v.optional(v.number()),
})
  .index("by_user", ["userId"])
  .index("by_pair", ["userId", "friendId"]);
```

Query all friends with single index lookup on `by_user`.

---

### offlineRecipes table redundancy

Server doesn't need to know what's cached locally.

**Resolution**: Remove `offlineRecipes` table. Store offline preferences in IndexedDB only:

```ts
// src/lib/offline-db.ts
interface OfflineDB {
  recipes: Map<string, RecipeVersion>;
  offlineRecipeIds: Set<string>; // user's selections, local only
  mealPlan: MealPlan | null;
  shoppingList: ShoppingList | null;
  lastSynced: number;
}
```

Sync the recipe data when toggled, but don't persist the toggle server-side.

---

### No cascade handling for deleted recipes

Meal plans, shopping lists, customizations, shared assets all reference recipes with no cleanup.

**Resolution**: Define explicit cascade behavior:

```ts
// When recipe is soft-deleted:
// 1. Meal plans: Keep reference, UI shows "Recipe no longer available" with cached title from pinned version
// 2. Shopping lists: No change (snapshot data, doesn't need live recipe)
// 3. Customizations: Soft-delete cascade
// 4. Shared assets: Soft-delete cascade

export const deleteRecipe = mutation(async ({ db }, { recipeId }) => {
  await db.patch(recipeId, { deletedAt: Date.now() });

  // Cascade to customizations
  const customizations = await db
    .query("recipeCustomizations")
    .withIndex("by_recipe", (q) => q.eq("recipeId", recipeId))
    .collect();
  for (const c of customizations) {
    await db.patch(c._id, { deletedAt: Date.now() });
  }

  // Cascade to shared assets
  const shares = await db
    .query("sharedAssets")
    .withIndex("by_asset", (q) =>
      q.eq("asset.type", "recipe").eq("asset.id", recipeId)
    )
    .collect();
  for (const s of shares) {
    await db.patch(s._id, { deletedAt: Date.now() });
  }
});
```

---

## Business Logic Gaps

### Premium expiration handling

No logic for what happens when premium expires.

**Resolution**: Add grace period and enforcement:

```ts
// Add to user schema
tierGracePeriodEndsAt: v.optional(v.number()), // 7 days after tierExpiresAt
  // Permission check
  function isPremium(user: User): boolean {
    if (user.tier === "free") return false;
    if (!user.tierExpiresAt) return true; // lifetime

    const now = Date.now();
    if (now < user.tierExpiresAt) return true;
    if (user.tierGracePeriodEndsAt && now < user.tierGracePeriodEndsAt)
      return true;

    return false;
  };

// Enforcement:
// - Private recipes beyond limit: remain but cannot create new ones
// - Customizations: read-only, cannot create/edit/share
// - Notes beyond limit: remain but cannot create new ones
```

---

### Declined friendship re-requests

Can a user send another request after being declined?

**Resolution**: Add cooldown period:

```ts
export const sendFriendRequest = mutation(
  async ({ db, auth }, { addresseeId }) => {
    const existing = await db
      .query("friendships")
      .withIndex("by_pair", (q) =>
        q.eq("requesterId", userId).eq("addresseeId", addresseeId)
      )
      .first();

    if (existing) {
      if (existing.status === "declined") {
        const cooldown = 30 * 24 * 60 * 60 * 1000; // 30 days
        if (Date.now() - existing.updatedAt < cooldown) {
          throw new Error("Cannot send request to this user yet");
        }
        // Update existing record instead of creating new
        await db.patch(existing._id, {
          status: "pending",
          updatedAt: Date.now(),
        });
        return;
      }
      throw new Error("Request already exists");
    }
    // Create new...
  }
);
```

---

### Shared shopping list check state

Unclear if shared users see same check states and can both toggle.

**Resolution**: Define as shared state with last-write-wins:

```ts
// In shopping list items, add:
checkedAt: v.optional(v.number()),
checkedBy: v.optional(v.id("users")),

// UI shows who checked each item and when
// Both owner and shared users can toggle
// Last write wins (acceptable for low-conflict scenario)
```

---

### Recipe deletion cascade to meal plans

Quick links to deleted recipes would 404.

**Resolution**: Store minimal recipe metadata in the meal plan entry:

```ts
mealPlans: defineTable({
  // ...
  recipes: v.array(
    v.object({
      recipeId: v.id("recipes"),
      recipeVersion: v.number(),
      scale: v.number(),
      // Cached metadata for display even if recipe deleted
      cachedTitle: v.string(),
      cachedImageUrl: v.optional(v.string()),
    })
  ),
  // ...
});
```

UI shows cached data with "Recipe no longer available" indicator when recipe is deleted.

---

### Tag spam

No ownership or moderation for tags.

**Resolution**: Add tag governance:

```ts
tags: defineTable({
  displayValue: v.string(),
  normalizedValue: v.string(),
  createdBy: v.id("users"),
  usageCount: v.number(), // increment/decrement on recipe save
  isApproved: v.boolean(), // staff can approve, auto-approve if usageCount > 5
  createdAt: v.number(),
  deletedAt: v.optional(v.number()),
})
  .index("by_normalized", ["normalizedValue"])
  .index("by_approved", ["isApproved"])
  .index("by_usage", ["usageCount"]);

// Only show approved tags in autocomplete for non-creators
// Staff can merge/delete tags in admin panel
```

---

## Missing Features/Considerations

### Pagination

No strategy for lists.

**Resolution**: Use cursor-based pagination with Convex:

```ts
// Query
export const listRecipes = query(async ({ db }, { cursor, limit = 20 }) => {
  let query = db.query("recipes").withIndex("by_created").order("desc");

  if (cursor) {
    query = query.filter((q) => q.lt(q.field("_creationTime"), cursor));
  }

  const items = await query.take(limit + 1);
  const hasMore = items.length > limit;
  const results = hasMore ? items.slice(0, -1) : items;
  const nextCursor = hasMore ? results[results.length - 1]._creationTime : null;

  return { items: results, nextCursor };
});
```

---

### Data export

No GDPR-compliant export.

**Resolution**: Add to Phase 10, user settings page:

```ts
// Convex action that generates JSON export
export const exportUserData = action(async ({ runQuery }, { userId }) => {
  const user = await runQuery(api.users.get, { userId });
  const recipes = await runQuery(api.recipes.listByAuthor, {
    authorId: userId,
  });
  const mealPlans = await runQuery(api.mealPlans.listByUser, { userId });
  const notes = await runQuery(api.recipeNotes.listByUser, { userId });
  // ...

  return {
    exportedAt: Date.now(),
    user,
    recipes,
    mealPlans,
    notes,
    // ...
  };
});
```

---

### Unit conversion

Shopping list needs unit conversion to be useful.

**Resolution**: Already covered above. Add unit conversion module to Phase 6.

---

### Broken link handling

`source.url` can go stale.

**Resolution**: Add optional validation, non-blocking:

```ts
// Schema addition
source: v.object({
  type: v.union(v.literal("original"), v.literal("external")),
  author: v.optional(v.string()),
  url: v.optional(v.string()),
  urlLastChecked: v.optional(v.number()),
  urlStatus: v.optional(
    v.union(v.literal("ok"), v.literal("broken"), v.literal("unknown"))
  ),
  book: v.optional(v.string()),
});

// Cron job checks URLs weekly, marks broken ones
// UI shows warning icon for broken URLs
```

---

### Image optimization

No resizing, compression, or CDN strategy.

**Resolution**: Use Convex file storage with client-side compression:

```ts
// Client: compress before upload
import imageCompression from "browser-image-compression";

async function uploadImage(file: File) {
  const compressed = await imageCompression(file, {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
  });

  const uploadUrl = await generateUploadUrl();
  await fetch(uploadUrl, { method: "POST", body: compressed });
}

// Convex serves via CDN automatically
// Store multiple sizes if needed (thumbnail, full)
```

---

### Email notifications

No mention of notifying users.

**Resolution**: Add notification preferences and email sending:

```ts
// Schema
userNotificationPreferences: defineTable({
  userId: v.id("users"),
  emailFriendRequests: v.boolean(),
  emailSharedAssets: v.boolean(),
  emailStrikes: v.boolean(),
});

// Use Convex actions with Resend/SendGrid
export const sendFriendRequestEmail = action(
  async ({ runQuery }, { addresseeId, requesterId }) => {
    const prefs = await runQuery(api.notifications.getPrefs, {
      userId: addresseeId,
    });
    if (!prefs.emailFriendRequests) return;

    // Send email via Resend
  }
);
```

Add to Phase 7.

---

### Rate limiting specifics

Mentioned but not defined.

**Resolution**: Implement in Phase 1 using Convex rate limiting pattern:

```ts
// Schema
rateLimits: defineTable({
  userId: v.id("users"),
  action: v.string(), // "friend_request", "recipe_create", etc.
  windowStart: v.number(),
  count: v.number(),
}).index("by_user_action", ["userId", "action"]);

// Helper
async function checkRateLimit(db, userId, action, limit, windowMs) {
  const windowStart = Date.now() - windowMs;
  const record = await db
    .query("rateLimits")
    .withIndex("by_user_action", (q) =>
      q.eq("userId", userId).eq("action", action)
    )
    .first();

  if (!record || record.windowStart < windowStart) {
    // Reset window
    await db.patch(record._id, { windowStart: Date.now(), count: 1 });
    return true;
  }

  if (record.count >= limit) {
    throw new Error("Rate limit exceeded");
  }

  await db.patch(record._id, { count: record.count + 1 });
  return true;
}

// Limits: 10 friend requests/hour, 50 recipes/day, etc.
```

---

### Audit logging schema

Admin actions should be logged.

**Resolution**: Add to Phase 8:

```ts
auditLogs: defineTable({
  actorId: v.id("users"),
  action: v.string(), // "user.disable", "recipe.hide", "strike.issue", etc.
  targetType: v.string(),
  targetId: v.string(),
  metadata: v.optional(v.any()), // action-specific details
  createdAt: v.number(),
})
  .index("by_actor", ["actorId"])
  .index("by_target", ["targetType", "targetId"])
  .index("by_created", ["createdAt"]);
```

---

### Search debouncing

Recipe search needs client-side debouncing.

**Resolution**: Document in Phase 4 requirements:

```tsx
// src/hooks/use-debounced-value.ts
function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

// Usage in search
const [query, setQuery] = useState("");
const debouncedQuery = useDebouncedValue(query, 300);
const results = useQuery(api.recipes.search, { query: debouncedQuery });
```

---

## Phase Sequencing Issues

### Offline in Phase 9

Adding offline support late requires retrofitting.

**Resolution**: Split offline work:

- **Phase 1**: Add `useOnlineStatus` hook, offline detection UI, data access abstraction layer
- **Phase 2**: Design queries/mutations with offline-first patterns (optimistic updates)
- **Phase 9**: Service worker, IndexedDB sync, queued actions

---

### Stripe in Phase 10

Payment integration has schema implications.

**Resolution**: Define subscription schema in Phase 1, implement Stripe in Phase 10:

```ts
// Add to users table now
stripeCustomerId: v.optional(v.string()),
stripeSubscriptionId: v.optional(v.string()),
stripeSubscriptionStatus: v.optional(v.string()),

// New table
subscriptionHistory: defineTable({
  userId: v.id("users"),
  stripeSubscriptionId: v.string(),
  status: v.string(),
  currentPeriodStart: v.number(),
  currentPeriodEnd: v.number(),
  createdAt: v.number(),
}).index("by_user", ["userId"]);
```

---

## Route Ambiguity

### Duplicate routes for recipes

`/recipes/[id]` vs `/app/recipes/[id]` creates confusion.

**Resolution**: Single route with conditional UI:

```
/recipes/[id]  -> Read-only public view (all users, including anonymous)
/app/recipes/[id] -> Full-featured view (authenticated only)
```

Or consolidate:

```
/recipes/[id]  -> Universal route
  - Anonymous: read-only public recipes
  - Authenticated: full features (edit, share, customize buttons shown based on permissions)
```

Recommend the consolidated approach. Remove `/app/recipes/[id]` and enhance `/recipes/[id]` with auth-conditional UI.

---

## Minor Nitpicks

### Redundant index on userStrikes

`by_user_created` vs `by_user`.

**Resolution**: Document intent or remove redundancy:

```ts
// Keep only by_user_created, it satisfies both use cases:
// - Filter by userId (prefix match)
// - Filter by userId + sort by createdAt
.index("by_user_created", ["userId", "createdAt"]);
// Remove by_user
```

---

### Recipe moderation normalization

`isHidden` + `hiddenAt` + `hiddenBy` + `hiddenReason` could be separate table.

**Resolution**: Keep inline for simplicity unless you need moderation history:

```ts
// If you want history, normalize:
recipeModerationActions: defineTable({
  recipeId: v.id("recipes"),
  action: v.union(v.literal("hide"), v.literal("unhide")),
  reason: v.optional(v.string()),
  performedBy: v.id("users"),
  createdAt: v.number(),
}).index("by_recipe", ["recipeId"]);

// Recipe only keeps current state
isHidden: v.boolean();
```

For MVP, keep it inline. Add history table post-launch if needed.

---

### No garbage collection for soft deletes

Soft-deleted records accumulate forever.

**Resolution**: Add retention policy and cleanup cron:

```ts
// Convex cron job, runs weekly
export const cleanupSoftDeleted = internalMutation(async ({ db }) => {
  const cutoff = Date.now() - 90 * 24 * 60 * 60 * 1000; // 90 days

  // Hard delete records soft-deleted more than 90 days ago
  const tables = [
    "recipes",
    "mealPlans",
    "shoppingLists",
    "friendships" /* etc */,
  ];

  for (const table of tables) {
    const old = await db
      .query(table)
      .withIndex("by_deleted")
      .filter((q) =>
        q.and(
          q.neq(q.field("deletedAt"), undefined),
          q.lt(q.field("deletedAt"), cutoff)
        )
      )
      .take(100);

    for (const record of old) {
      await db.delete(record._id);
    }
  }
});
```

Document the 90-day retention in user-facing terms of service.
