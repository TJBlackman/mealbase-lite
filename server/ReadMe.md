# MealBase Lite | Server

#### .env files

These might have to be included when launching the project. Idk yet...

#### Server Architecture

Controller > Service > DAL

#### Auth

- Login to get JWT cookie
- JWT cookie used for all other auth accounts
- JWT cookie refreshed on all routes
- req.user is ALWAYS false, unless updated by /src/middleware/jwt-middleware.ts

#### Permissions and Roles

- Admin: Can basically do anything.
- Support: A support staffer, reset passwords. Soft Delete Accounts, search by email, etc.
- OrgMember: OrgMembers can have admin or member roles within the org.
- PremiumUser: No ads, but no extra permissions.
- User: Regular authenticated user account.
- Anonymous, non-signed-in user.

#### Misc

- Date should be recorded in UTC time string.
- Store user info in JWT in http only cookie
