# Mealbase Development Plan

## Overview

Mealbase is a recipe management application with meal planning and shopping list generation. Users can create, share, and discover recipes, organize them into meal plans, and generate aggregated shopping lists.

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Convex (real-time backend)
- **Auth**: Clerk
- **UI**: Tailwind CSS 4, Radix UI primitives, Lucide icons
- **Language**: TypeScript
- **Offline**: Service Worker + IndexedDB (via Workbox)
- **Theming**: CSS Variables + next-themes
- **Payments**: Stripe

---

## User System

### Tiers

| Tier             | Description                          |
| ---------------- | ------------------------------------ |
| `free`           | Default tier, limited features       |
| `premium`        | Paid tier, full features             |
| `premium_gifted` | Gifted premium, identical to premium |

### Roles (Hierarchical)

| Role          | Level | Description                            |
| ------------- | ----- | -------------------------------------- |
| `user`        | 0     | Standard user                          |
| `staff`       | 1     | Can moderate content, view admin stats |
| `admin`       | 2     | Can manage users, issue strikes        |
| `super_admin` | 3     | Can disable accounts, promote to admin |

### Tier Limits

| Feature             | Free | Premium/Premium Gifted |
| ------------------- | ---- | ---------------------- |
| Private recipes     | 10   | Unlimited              |
| Recipe notes        | 25   | Unlimited              |
| Custom recipe edits | No   | Yes                    |
| Share custom edits  | No   | Yes                    |

### Premium Expiration Handling

```ts
// Add to user schema
tierGracePeriodEndsAt: v.optional(v.number()), // 7 days after tierExpiresAt
  function isPremium(user: User): boolean {
    if (user.tier === "free") return false;
    if (!user.tierExpiresAt) return true; // lifetime
    const now = Date.now();
    if (now < user.tierExpiresAt) return true;
    if (user.tierGracePeriodEndsAt && now < user.tierGracePeriodEndsAt)
      return true;
    return false;
  };
```

**Enforcement on expiration:**

- Private recipes beyond limit: remain but cannot create new
- Customizations: read-only, cannot create/edit/share
- Notes beyond limit: remain but cannot create new

---

## Data Models

### Users

```ts
users: defineTable({
  clerkId: v.string(),
  email: v.string(),
  name: v.optional(v.string()),
  imageUrl: v.optional(v.string()),
  tier: v.union(
    v.literal("free"),
    v.literal("premium"),
    v.literal("premium_gifted")
  ),
  tierExpiresAt: v.optional(v.number()),
  tierGracePeriodEndsAt: v.optional(v.number()),
  role: v.union(
    v.literal("user"),
    v.literal("staff"),
    v.literal("admin"),
    v.literal("super_admin")
  ),
  isDisabled: v.boolean(),
  disabledAt: v.optional(v.number()),
  disabledReason: v.optional(v.string()),
  disabledBy: v.optional(v.id("users")),
  // Stripe fields
  stripeCustomerId: v.optional(v.string()),
  stripeSubscriptionId: v.optional(v.string()),
  stripeSubscriptionStatus: v.optional(v.string()),
  createdAt: v.number(),
  updatedAt: v.number(),
  deletedAt: v.optional(v.number()),
})
  .index("by_clerk_id", ["clerkId"])
  .index("by_email", ["email"])
  .index("by_role", ["role"])
  .index("by_deleted", ["deletedAt"]);
```

### User Strikes

```ts
userStrikes: defineTable({
  userId: v.id("users"),
  issuedBy: v.id("users"),
  description: v.string(),
  createdAt: v.number(),
  deletedAt: v.optional(v.number()),
}).index("by_user_created", ["userId", "createdAt"]);
```

### Subscription History

```ts
subscriptionHistory: defineTable({
  userId: v.id("users"),
  stripeSubscriptionId: v.string(),
  status: v.string(),
  currentPeriodStart: v.number(),
  currentPeriodEnd: v.number(),
  createdAt: v.number(),
}).index("by_user", ["userId"]);
```

### User Notification Preferences

```ts
userNotificationPreferences: defineTable({
  userId: v.id("users"),
  emailFriendRequests: v.boolean(),
  emailSharedAssets: v.boolean(),
  emailStrikes: v.boolean(),
}).index("by_user", ["userId"]);
```

### Friendships

```ts
friendships: defineTable({
  requesterId: v.id("users"),
  addresseeId: v.id("users"),
  status: v.union(
    v.literal("pending"),
    v.literal("accepted"),
    v.literal("declined")
  ),
  createdAt: v.number(),
  updatedAt: v.number(),
  deletedAt: v.optional(v.number()),
})
  .index("by_requester_status", ["requesterId", "status"])
  .index("by_addressee_status", ["addresseeId", "status"])
  .index("by_pair", ["requesterId", "addresseeId"]);
```

### Friends (Symmetric Lookup Table)

Created when friendship is accepted for O(1) friend lookups:

```ts
friends: defineTable({
  userId: v.id("users"),
  friendId: v.id("users"),
  friendshipId: v.id("friendships"),
  createdAt: v.number(),
  deletedAt: v.optional(v.number()),
})
  .index("by_user", ["userId"])
  .index("by_pair", ["userId", "friendId"]);
```

### Shared Assets (Type-Safe)

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
})
  .index("by_owner", ["ownerId"])
  .index("by_shared_with", ["sharedWithId"]);
```

### Ingredients Dictionary

```ts
ingredients: defineTable({
  canonicalName: v.string(),
  aliases: v.array(v.string()),
  searchableAliases: v.string(), // "garlic clove|garlic|clove of garlic"
  defaultUnit: v.optional(v.string()),
  createdAt: v.number(),
  updatedAt: v.number(),
  deletedAt: v.optional(v.number()),
})
  .index("by_canonical_name", ["canonicalName"])
  .searchIndex("search_aliases", { searchField: "searchableAliases" });
```

### Tags (With Governance)

```ts
tags: defineTable({
  displayValue: v.string(),
  normalizedValue: v.string(),
  createdBy: v.id("users"),
  usageCount: v.number(),
  isApproved: v.boolean(), // auto-approve if usageCount > 5
  createdAt: v.number(),
  deletedAt: v.optional(v.number()),
})
  .index("by_normalized", ["normalizedValue"])
  .index("by_approved", ["isApproved"]);
```

### Recipes

```ts
recipes: defineTable({
  authorId: v.id("users"),
  title: v.string(),
  description: v.optional(v.string()),
  ingredients: v.array(
    v.object({
      ingredientId: v.optional(v.id("ingredients")),
      name: v.string(),
      quantity: v.number(),
      unit: v.string(),
      preparation: v.optional(v.string()),
    })
  ),
  instructions: v.array(v.string()),
  servings: v.number(),
  prepTimeMinutes: v.optional(v.number()),
  cookTimeMinutes: v.optional(v.number()),
  tags: v.array(v.id("tags")),
  images: v.array(v.string()),
  visibility: v.union(v.literal("public"), v.literal("private")),
  source: v.object({
    type: v.union(v.literal("original"), v.literal("external")),
    author: v.optional(v.string()),
    url: v.optional(v.string()),
    urlLastChecked: v.optional(v.number()),
    urlStatus: v.optional(
      v.union(v.literal("ok"), v.literal("broken"), v.literal("unknown"))
    ),
    book: v.optional(v.string()),
  }),
  version: v.number(),
  isHidden: v.boolean(),
  hiddenAt: v.optional(v.number()),
  hiddenBy: v.optional(v.id("users")),
  hiddenReason: v.optional(v.string()),
  createdAt: v.number(),
  updatedAt: v.number(),
  deletedAt: v.optional(v.number()),
})
  .index("by_author", ["authorId"])
  .index("by_visibility", ["visibility"])
  .index("by_created", ["createdAt"])
  .index("by_hidden", ["isHidden"])
  .index("by_deleted", ["deletedAt"])
  .searchIndex("search_title", {
    searchField: "title",
    filterFields: ["visibility", "authorId"],
  });
```

### Recipe Versions

```ts
recipeVersions: defineTable({
  recipeId: v.id("recipes"),
  version: v.number(),
  title: v.string(),
  description: v.optional(v.string()),
  ingredients: v.array(
    v.object({
      ingredientId: v.optional(v.id("ingredients")),
      name: v.string(),
      quantity: v.number(),
      unit: v.string(),
      preparation: v.optional(v.string()),
    })
  ),
  instructions: v.array(v.string()),
  servings: v.number(),
  prepTimeMinutes: v.optional(v.number()),
  cookTimeMinutes: v.optional(v.number()),
  tags: v.array(v.id("tags")),
  images: v.array(v.string()),
  source: v.object({
    type: v.union(v.literal("original"), v.literal("external")),
    author: v.optional(v.string()),
    url: v.optional(v.string()),
    book: v.optional(v.string()),
  }),
  createdBy: v.id("users"),
  createdAt: v.number(),
})
  .index("by_recipe", ["recipeId"])
  .index("by_recipe_version", ["recipeId", "version"]);
```

**Version Retention Policy:** Keep last 10 versions OR all versions from last 90 days (whichever is more). Daily cron cleanup.

### Recipe Customizations (Premium Only)

```ts
recipeCustomizations: defineTable({
  userId: v.id("users"),
  recipeId: v.id("recipes"),
  baseVersion: v.number(),
  ingredients: v.array(
    v.object({
      ingredientId: v.optional(v.id("ingredients")),
      name: v.string(),
      quantity: v.number(),
      unit: v.string(),
      preparation: v.optional(v.string()),
    })
  ),
  instructions: v.array(v.string()),
  createdAt: v.number(),
  updatedAt: v.number(),
  deletedAt: v.optional(v.number()),
})
  .index("by_user", ["userId"])
  .index("by_recipe", ["recipeId"])
  .index("by_user_recipe", ["userId", "recipeId"]);
```

### Recipe Notes

```ts
recipeNotes: defineTable({
  userId: v.id("users"),
  recipeId: v.id("recipes"),
  content: v.string(),
  createdAt: v.number(),
  updatedAt: v.number(),
  deletedAt: v.optional(v.number()),
}).index("by_user_recipe", ["userId", "recipeId"]);
```

### Recipe Likes

```ts
recipeLikes: defineTable({
  userId: v.id("users"),
  recipeId: v.id("recipes"),
  createdAt: v.number(),
  deletedAt: v.optional(v.number()),
}).index("by_user_recipe", ["userId", "recipeId"]);
```

### Meal Plans

```ts
mealPlans: defineTable({
  userId: v.id("users"),
  name: v.string(),
  recipes: v.array(
    v.object({
      recipeId: v.id("recipes"),
      recipeVersion: v.number(),
      scale: v.number(),
      cachedTitle: v.string(),
      cachedImageUrl: v.optional(v.string()),
    })
  ),
  createdAt: v.number(),
  updatedAt: v.number(),
  deletedAt: v.optional(v.number()),
})
  .index("by_user", ["userId"])
  .index("by_user_updated", ["userId", "updatedAt"])
  .index("by_deleted", ["deletedAt"]);
```

### Shopping Lists

```ts
shoppingLists: defineTable({
  userId: v.id("users"),
  name: v.string(),
  mealPlanId: v.optional(v.id("mealPlans")),
  items: v.array(
    v.object({
      id: v.string(),
      ingredientId: v.optional(v.id("ingredients")),
      name: v.string(),
      quantity: v.number(),
      unit: v.string(),
      preparation: v.optional(v.string()),
      sourceRecipeIds: v.array(v.id("recipes")),
      isManual: v.boolean(),
      checked: v.boolean(),
      checkedAt: v.optional(v.number()),
      checkedBy: v.optional(v.id("users")),
    })
  ),
  createdAt: v.number(),
  updatedAt: v.number(),
  deletedAt: v.optional(v.number()),
})
  .index("by_user", ["userId"])
  .index("by_user_updated", ["userId", "updatedAt"])
  .index("by_deleted", ["deletedAt"]);
```

### Rate Limits

```ts
rateLimits: defineTable({
  userId: v.id("users"),
  action: v.string(), // "friend_request", "recipe_create", etc.
  windowStart: v.number(),
  count: v.number(),
}).index("by_user_action", ["userId", "action"]);
```

**Limits:** 10 friend requests/hour, 50 recipes/day, etc.

### Audit Logs

```ts
auditLogs: defineTable({
  actorId: v.id("users"),
  action: v.string(), // "user.disable", "recipe.hide", "strike.issue"
  targetType: v.string(),
  targetId: v.string(),
  metadata: v.optional(v.any()),
  createdAt: v.number(),
})
  .index("by_actor", ["actorId"])
  .index("by_target", ["targetType", "targetId"])
  .index("by_created", ["createdAt"]);
```

---

## Unit Conversion System

```ts
// src/lib/units.ts
const VOLUME_TO_ML: Record<string, number> = {
  ml: 1,
  tsp: 4.929,
  tbsp: 14.787,
  cup: 236.588,
  l: 1000,
};

const WEIGHT_TO_G: Record<string, number> = {
  g: 1,
  oz: 28.35,
  lb: 453.592,
  kg: 1000,
};

function convertToBaseUnit(
  quantity: number,
  unit: string
): { quantity: number; baseUnit: string } | null {
  if (unit in VOLUME_TO_ML)
    return { quantity: quantity * VOLUME_TO_ML[unit], baseUnit: "ml" };
  if (unit in WEIGHT_TO_G)
    return { quantity: quantity * WEIGHT_TO_G[unit], baseUnit: "g" };
  return null;
}

function formatFromBaseUnit(
  quantity: number,
  baseUnit: string
): { quantity: number; unit: string } {
  // Convert back to most readable unit (e.g., 473ml -> 2 cups)
}
```

> **Note:** Items with different preparation methods (e.g., "diced onion" vs "sliced onion") remain separate since they may require different quantities or handling.

---

## Cascade Handling for Deleted Recipes

```ts
export const deleteRecipe = mutation(async ({ db }, { recipeId }) => {
  await db.patch(recipeId, { deletedAt: Date.now() });

  // Cascade to customizations
  const customizations = await db
    .query("recipeCustomizations")
    .withIndex("by_recipe", (q) => q.eq("recipeId", recipeId))
    .collect();
  for (const c of customizations)
    await db.patch(c._id, { deletedAt: Date.now() });

  // Cascade to shared assets (handled via asset discriminated union query)
  // Meal plans: Keep reference, UI shows "Recipe no longer available" with cached title
  // Shopping lists: No change (snapshot data)
});
```

---

## Pagination (Cursor-Based)

```ts
export const listRecipes = query(async ({ db }, { cursor, limit = 20 }) => {
  let query = db.query("recipes").withIndex("by_created").order("desc");
  if (cursor)
    query = query.filter((q) => q.lt(q.field("_creationTime"), cursor));

  const items = await query.take(limit + 1);
  const hasMore = items.length > limit;
  const results = hasMore ? items.slice(0, -1) : items;
  const nextCursor = hasMore ? results[results.length - 1]._creationTime : null;

  return { items: results, nextCursor };
});
```

---

## Soft Delete Garbage Collection

Weekly cron job hard-deletes records soft-deleted more than 90 days ago. Document in terms of service.

---

## Route Structure

### Public Routes

```
/                     # Landing page
/recipes              # Public recipe browsing
/recipes/[id]         # Recipe view (auth-conditional UI)
/sign-in              # Clerk sign-in
/sign-up              # Clerk sign-up
```

### Protected Routes (/app)

```
/app                          # Dashboard
/app/recipes                  # User's recipes
/app/recipes/new              # Create recipe
/app/recipes/[id]/edit        # Edit recipe
/app/recipes/[id]/history     # Version history
/app/recipes/[id]/customize   # Customization (premium)
/app/meal-plans               # Meal plan list
/app/meal-plans/new           # Create meal plan
/app/meal-plans/[id]          # Meal plan detail
/app/meal-plans/[id]/edit     # Edit meal plan
/app/shopping-lists           # Shopping list history
/app/shopping-lists/[id]      # Shopping list detail
/app/friends                  # Friends and requests
/app/shared                   # Assets shared with me
/app/profile                  # Profile, liked recipes
/app/settings                 # Settings, theme, data export
```

### Admin Routes (/app/admin)

```
/app/admin                    # Dashboard
/app/admin/users              # User management
/app/admin/users/[id]         # User detail
/app/admin/recipes            # Recipe management
/app/admin/ingredients        # Ingredient dictionary
```

**Note:** `/recipes/[id]` is the universal recipe route. Anonymous users see read-only public recipes. Authenticated users see full features (edit, share, customize buttons based on permissions).

---

## Offline Support

### Strategy

Store offline preferences in IndexedDB only (no server-side `offlineRecipes` table).

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

### Auto-Cached

- App shell, static assets
- Most recent meal plan + its recipes (pinned versions)
- Shopping list from most recent meal plan

### User-Selected

- Recipes marked "Save for Offline" (stored locally)

### Offline UI

- Offline indicator in header
- Disable network-required actions
- Queue shopping list checks for sync
- Show "last synced" timestamp

---

## Image Optimization

Client-side compression before upload:

```ts
import imageCompression from "browser-image-compression";

async function uploadImage(file: File) {
  const compressed = await imageCompression(file, {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
  });
  const uploadUrl = await generateUploadUrl();
  await fetch(uploadUrl, { method: "POST", body: compressed });
}
```

---

## Search Debouncing

```ts
function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

// Usage
const debouncedQuery = useDebouncedValue(query, 300);
const results = useQuery(api.recipes.search, { query: debouncedQuery });
```

---

## Friendship Re-Request Cooldown

```ts
export const sendFriendRequest = mutation(
  async ({ db, auth }, { addresseeId }) => {
    const existing = await db
      .query("friendships")
      .withIndex("by_pair", (q) =>
        q.eq("requesterId", userId).eq("addresseeId", addresseeId)
      )
      .first();

    if (existing?.status === "declined") {
      const cooldown = 30 * 24 * 60 * 60 * 1000; // 30 days
      if (Date.now() - existing.updatedAt < cooldown) {
        throw new Error("Cannot send request to this user yet");
      }
      await db.patch(existing._id, {
        status: "pending",
        updatedAt: Date.now(),
      });
      return;
    }
    // Create new...
  }
);
```

---

## Data Export (GDPR)

Available in settings page:

```ts
export const exportUserData = action(async ({ runQuery }, { userId }) => {
  const user = await runQuery(api.users.get, { userId });
  const recipes = await runQuery(api.recipes.listByAuthor, {
    authorId: userId,
  });
  const mealPlans = await runQuery(api.mealPlans.listByUser, { userId });
  const notes = await runQuery(api.recipeNotes.listByUser, { userId });
  return { exportedAt: Date.now(), user, recipes, mealPlans, notes };
});
```

---

## Implementation Phases

### Phase 1: Foundation

1. Project setup (Next.js 15, Convex, Clerk, Tailwind)
2. Theming system (CSS variables, next-themes)
3. Clerk integration with Convex webhook
4. User schema with tier, role, Stripe fields
5. Permission helpers module
6. Middleware for route protection
7. Base layout, navigation
8. Rate limiting infrastructure
9. `useOnlineStatus` hook, offline detection UI, data access abstraction

**Deliverable**: Authenticated app shell with theming, permissions, offline-first patterns

### Phase 2: Recipes Core

1. Tags CRUD (with governance)
2. Ingredient dictionary with `searchableAliases`
3. Recipe schema + mutations
4. Recipe versioning with retention policy
5. Private recipe limit enforcement
6. Recipe create/edit form
7. Recipe detail/list pages
8. Optimistic updates pattern

**Deliverable**: Recipe CRUD with versioning and tier limits

### Phase 3: Recipe Enhancements

1. Recipe notes (25 limit for free)
2. Recipe customizations (premium)
3. Version history page
4. Like functionality
5. Save for offline toggle

**Deliverable**: Full recipe features including premium customizations

### Phase 4: Recipe Discovery

1. Fuzzy search with debouncing
2. Tag/cook time/author/source filtering
3. Cursor-based pagination
4. Liked/shared filters

**Deliverable**: Full recipe browsing experience

### Phase 5: Meal Plans

1. Meal plan schema with cached metadata
2. Create/edit with version pinning
3. Update to latest version feature
4. Cascade behavior documentation

**Deliverable**: Complete meal planning with version pinning

### Phase 6: Shopping Lists

1. Shopping list schema with check state tracking
2. Generate from meal plan with unit conversion
3. Aggregation logic (same unit = sum, different = separate)
4. Check/uncheck items (shared state, last-write-wins)
5. Manual items, edit/delete

**Deliverable**: Complete shopping list with unit conversion

### Phase 7: Friendships & Sharing

1. Friendship schema + symmetric friends table
2. Friend request flow with cooldown
3. SharedAssets with type-safe discriminated union
4. Share UI, "Shared with me" views
5. Retract sharing, access control
6. Email notifications (Resend/SendGrid)

**Deliverable**: Complete social/sharing feature

### Phase 8: Admin Panel

1. Admin layout with role protection
2. Dashboard with stats
3. User management (strikes, tier/role changes)
4. Recipe management (hide, restore, delete)
5. Ingredient dictionary management
6. Audit logging

**Deliverable**: Complete admin panel with audit trail

### Phase 9: Offline Support

1. Service worker setup (Workbox)
2. IndexedDB schema (local-only offline preferences)
3. Offline sync for meal plan + recipes
4. Queued actions with sync on reconnect

**Deliverable**: Offline-capable PWA

### Phase 10: Premium & Polish

1. Stripe integration (premium upgrade flow)
2. Premium expiration + grace period handling
3. Image optimization (client-side compression)
4. Broken URL checking (weekly cron)
5. Data export feature
6. Loading/error/empty states
7. Mobile responsiveness
8. Soft delete garbage collection cron

**Deliverable**: Production-ready application

---

## Access Control Summary

| Resource             | Owner | Friend (Shared) | Friend (Not Shared) | Non-Friend | Staff+ |
| -------------------- | ----- | --------------- | ------------------- | ---------- | ------ |
| Public Recipe        | Full  | Read            | Read                | Read       | Full   |
| Private Recipe       | Full  | Read            | None                | None       | Full   |
| Hidden Recipe        | None  | None            | None                | None       | Full   |
| Recipe Customization | Full  | Read (Premium)  | None                | None       | Read   |
| Recipe Notes         | Full  | None            | None                | None       | None   |
| Meal Plan            | Full  | Read            | None                | None       | Read   |
| Shopping List        | Full  | Read + Check    | None                | None       | Read   |
