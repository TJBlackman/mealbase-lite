import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import UserModel from '../models/user.model';
import { compareHash } from '../utils/hash-password';
import { sendResponse } from '../utils/normalize-response';

// email & password checking middleware
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      session: false,
    },
    async (email, password, done) => {
      try {
        const existingUser: any = await UserModel.findOne(
          { email, deleted: false },
          '',
          { lean: true }
        );
        if (!existingUser) {
          return done(null, false);
        }
        const correctPassword = await compareHash(
          password,
          existingUser.password
        );
        if (!correctPassword) {
          return done(null, false);
        }
        return done(null, existingUser);
      } catch (err) {
        done(err);
      }
    }
  )
);

export const usePassportLocalStrategy = (req: any, res: any, next: any) => {
  passport.authenticate('local', { session: false }, (
    err,
    user,
    info
  ) => {
    if (err) {
      return sendResponse({
        res,
        req,
        success: false,
        message: err,
      });
    }
    if (!user) {
      return sendResponse({
        res,
        req,
        success: false,
        message: '401 Unauthorized',
      });
    }
    req.user = user;
    next();
  })(req, res, next);
};

// // facebook auth
// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: process.env.FACEBOOK_APP_ID,
//       clientSecret: process.env.FACEBOOK_APP_SECRET,
//       callbackURL: 'http://localhost:3000/api/v1/auth/facebook/callback'
//     },
//     function(accessToken: any, refreshToken: any, profile: any, cb: any) {
//       console.log(accessToken, refreshToken, profile);
//       return cb(null, false);
//     }
//   )
// );

// export const usePassportFaceBookStrategy = (req: any, res: any, next: any) => {
//   passport.authenticate('facebook', { session: false }, function (err, user, info) {
//     if (err) {
//       return sendResponse({
//         res,
//         req,
//         success: false,
//         message: err
//       });
//     }
//     if (!user) {
//       return sendResponse({
//         res,
//         req,
//         success: false,
//         message: '401 Unauthorized'
//       });
//     }
//     req.user = user;
//     next();
//   })(req, res, next);
// };

export default passport;
