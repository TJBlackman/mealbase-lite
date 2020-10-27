# MealBase UI | Client

This project is the website front-end for [MealBase.app](https://www.mealbase.app).

### Development

1. Clone this repository
2. Run `npm i` from this project's directory
   - Your machine must have [NodeJS](https://nodejs.org/en/download/) installed.
3. run `npm run dev`

### Production

1. Run `npm run build`
   - A build directory will include all the static files for production. Simply copy them to your production server public folder.
   - `scp -r build <USER>@<IP_ADDRESS>:<PATH_TO>/public`

&nbsp;
&nbsp;
&nbsp;

---

&nbsp;
&nbsp;
&nbsp;

# MealBase Lite | Server

#### Start Up

To start this project, complete the following steps:

1. Run `npm i` to install project dependancies.
   - You must have Node installed on your computer
2. Ensure an instance of MongoDB is running locally.
3. In `/server/configs/` create a new file: `.local.env`.
   - Copy the values from `example.env`, and edit if you want.
   - To receive emails, you need to include a valid [Send Grid API Key](https://sendgrid.com/docs/ui/account-and-settings/api-keys/).
   - Recpatcha is not needed except in production. Add real Google Recaptcha Keys in .env files in both `/client/configs/` and `/server/configs` directories.
4. Ensure the Chrome path is correct in the server .env file.
   - Check .env file, and uncomment for the system you are using.
5. Run `npm run local`

#### .env files

See the `example.env` file for configuration options.

#### Server Architecture

Controller > Service > DAL

#### Auth

- Login to get JWT cookie
- JWT cookie used for all other auth accounts
- JWT cookie refreshed on all routes
- req.user is ALWAYS false, unless updated by /src/middleware/jwt-middleware.ts

#### Permissions and Roles

- Admin: Can basically do anything.
- Support: A support staffer, reset passwords. Soft Delete Accounts, search users by email, etc.
- PremiumUser: No ads, some extra permissions.
- User: Regular authenticated user account.
- Anonymous: non-signed-in user.

#### Misc

- Date should be recorded in UTC time.
- Store user info in JWT in httpOnly cookie
