# Right Now Server & API

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

## API Docs

GET /api/v1/users

| Name      | Values      | Default   | Description                                                      |
| --------- | ----------- | --------- | ---------------------------------------------------------------- |
| email     | string      |           | Get user by specific email                                       |
| \_id      | number      |           | Get user by specific id                                          |
| role      | user, admin |           | Get users by their roles                                         |
| search    | string      |           | Performs a partial match against email address only              |
| sortBy    | string      | createdAt | Sort users by field. Options: email\|createdAt\|updatedAt\|roles |
| sortOrder | +- 1        | +1        | Sort ascending or descending                                     |
| skip      | number      | 0         | Skip this many records                                           |
| limit     | number      | 20        | Return this many records. Max 100                                |
