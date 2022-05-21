import cookie from "cookie";
import { UserModel } from "@src/db/users";
import { Roles } from "@src/types/index.d";
import type { NextApiHandler } from "next";
import { createJwt } from "@src/utils/jwt-helpers";
import { createHash } from "@src/utils/hash-helpers";
import { mongoDbConnection } from "@src/db/connection";
import { registerUserSchema } from "@src/validation/schemas/users";
import { RefreshTokenModel } from "@src/db/refresh-tokens";
import { getFutureDate } from "@src/utils/get-expires-date";

const handler: NextApiHandler = async (req, res) => {
  try {
    if (req.method !== "POST") {
      return res.status(404).send("Not Found");
    }

    // validate incoming request body
    const result = await registerUserSchema.validate(req.body);
    if (result.error) {
      return res.status(400).send(result.error.message);
    }

    // connect to db
    await mongoDbConnection();

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
      type: "refresh-token",
      payload: {
        _id: refreshToken._id.toString(),
      },
    });

    // create access token JWT
    const accessTokenJwt = await createJwt({
      type: "access-token",
      payload: {
        _id: newUser._id,
        email: newUser.email,
        roles: newUser.roles,
      },
    });

    // set access token and refresh token as httpOnly cookies
    res.setHeader("Set-Cookie", [
      cookie.serialize(process.env.ACCESS_TOKEN_COOKIE_NAME!, accessTokenJwt, {
        httpOnly: true,
        secure: true,
        path: "/",
      }),
      cookie.serialize(
        process.env.REFRESH_TOKEN_COOKIE_NAME!,
        refreshTokenJwt,
        {
          expires: getFutureDate(process.env.REFRESH_TOKEN_COOKIE_EXPIRE_DAYS!),
          httpOnly: true,
          secure: true,
          path: "/",
        }
      ),
    ]);

    // send response
    return res.status(200).json({
      _id: newUser._id,
      email: newUser.email,
      roles: newUser.roles,
    });
  } catch (err) {
    let msg = `An unknown error occurred.`;
    if (err instanceof Error) {
      msg = err.message;
    }
    res.status(500).send(msg);
  }
};

export default handler;
