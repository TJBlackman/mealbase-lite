import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import bodyParser from 'body-parser';
import passport from './middleware/passport';
import cookieParser from 'cookie-parser';
import AssignRequestUser from './middleware/assign-request-user';
import allowLoggedInUsersOnly from './middleware/auth-users-only';
import checkAdminExistence from './scripts/insert-admin'
import UserController from './controllers/user.controller';
import AuthController from './controllers/auth.controller';
import RecipeController from './controllers/recipe.controller';
import CookbookController from './controllers/cookbook.controller';
import MealPlanController from './controllers/mealplan.controller'

// initialize express server
const server = express();

// mongoose
mongoose.connect(process.env.DB_CONNECTION_STR, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});
mongoose.connection.on('error', (err) => {
  console.log(err);
});
mongoose.connection.once('open', () => {
  console.log(`Connected to DB: ${process.env.DB_NAME}`);
});

// middleware
server.use(express.static('public'))
server.use(bodyParser.json());
server.use(cookieParser());
server.use(passport.initialize());
server.use('/', AssignRequestUser);

// routes
server.use('/api/v1/auth', AuthController);
server.use('/api/v1/users', UserController);
server.use('/api/v1/recipes', RecipeController);
server.use('/api/v1/cookbooks', allowLoggedInUsersOnly, CookbookController);
server.use('/api/v1/mealplans', allowLoggedInUsersOnly, MealPlanController);

// catch all, send index.html
server.use('/', (req, res) => {
  const filePath = path.join(__dirname, '../public/index.html');
  res.sendFile(filePath);
});

// boot up scripts and checks
checkAdminExistence();

// tell server to listen on a port
server.listen(process.env.PORT, () => {
  console.log(`Server Port: ${process.env.PORT}\nEnvironment: ${process.env.NODE_ENV}`);
});
