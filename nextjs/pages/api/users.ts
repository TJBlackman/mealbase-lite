import { RefreshTokenModel } from "./../../db/refresh-tokens";
import type { NextApiHandler } from "next";
import { UserModel } from "@src/db/users";
import { newUserPayload } from "@src/validation/users";
import { createHash } from "@src/utils/hash-helpers";
import { createJwt } from "@src/utils/jwt-helpers";
import { Roles } from "@src/types/index.d";
import cookie from "cookie";
import { getFutureDate } from "@src/utils/get-expires-date";
import dbConnection from "@src/db/connection";

const handler: NextApiHandler = async (req, res) => {
  try {
    switch (req.method) {
      case "GET": {
      }
      case "POST": {
        // validate incoming request body
        const result = await newUserPayload.validate(req.body);
        if (result.error) {
          return res.status(400).send(result.error.message);
        }

        // connect to db
        await dbConnection();

        // check for existing users
        const existingUser = await UserModel.findOne({ email: req.body.email });
        if (existingUser) {
          res.status(409).send("Email address is already in use.");
        }

        // hash incoming password
        const hash = await createHash(req.body.password);

        // create new user
        const newUser = new UserModel({
          email: req.body.email,
          password: hash,
          roles: [Roles.User],
          updatedAt: new Date(),
          createdAt: new Date(),
        });
        await newUser.save();

        // create refreshToken db record
        const refreshToken = new RefreshTokenModel({
          userId: newUser._id,
        });
        await refreshToken.save();

        // create refreshToken JWT
        const refreshTokenJwt = await createJwt({
          id: refreshToken._id,
        });

        // set refresh token cookie
        res.setHeader(
          "Set-Cookie",
          cookie.serialize(
            process.env.REFRESH_TOKEN_COOKIE_NAME!,
            refreshTokenJwt,
            {
              expires: getFutureDate(
                process.env.REFRESH_TOKEN_COOKIE_EXPIRE_DAYS!
              ),
              httpOnly: true,
              secure: true,
            }
          )
        );

        // create access token JWT
        const accessTokenJwt = await createJwt({
          _id: newUser._id,
          email: newUser.email,
          roles: newUser.roles,
        });

        // set access token cookie
        res.setHeader(
          "Set-Cookie",
          cookie.serialize(
            process.env.ACCESS_TOKEN_COOKIE_NAME!,
            accessTokenJwt,
            {
              httpOnly: true,
              secure: true,
            }
          )
        );

        // send response
        res.status(200).json({
          _id: newUser._id,
          email: newUser.email,
        });
      }
      case "PUT": {
      }
      case "DELETE": {
      }
      default: {
        res
          .status(400)
          .send(
            `Unknown request method. Expected GET, PUT, POST, DELETE but instead received ${req.method}`
          );
      }
    }
  } catch (err) {
    let msg = `An unknown error occurred.`;
    if (err instanceof Error) {
      msg = err.message;
    }
    res.status(500).send(msg);
  }
};

export default handler;
