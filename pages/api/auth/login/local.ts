import { localLoginSchema } from "@src/validation/schemas/users";
import type { NextApiHandler } from "next";
import { UserModel } from "@src/db/users";
import { mongoDbConnection } from "@src/db/connection";
import { compareHash } from "@src/utils/hash-helpers";
import { RefreshTokenModel } from "@src/db/refresh-tokens";
import { createJwt } from "@src/utils/jwt-helpers";
import cookie from "cookie";
import { getFutureDate } from "@src/utils/get-expires-date";

const handler: NextApiHandler = async (req, res) => {
  try {
    // GET, PUT, DELETE are 404 not found
    if (req.method !== "POST") {
      return res.status(404).send("Not Found.");
    }

    // validate incoming payload
    const validationResult = localLoginSchema.validate(req.body);
    if (validationResult.error) {
      res.status(400).send(validationResult.error.message);
    }

    // connect to db
    await mongoDbConnection();

    // check if user account exists
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send("Email or password is incorrect.");
    }

    // verify password is correct
    const isCorrectPw = await compareHash(req.body.password, user.password);
    if (!isCorrectPw) {
      return res.status(401).send("Email or password is incorrect.");
    }

    // create refreshToken db record
    const refreshToken = new RefreshTokenModel({
      userId: user._id,
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
        _id: user._id,
        email: user.email,
        roles: user.roles,
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
      _id: user._id,
      email: user.email,
      roles: user.roles,
    });
  } catch (err) {
    let msg = "An unknown error occurred.";
    if (err instanceof Error) {
      msg = err.message;
    }
    res.status(500).send(msg);
  }
};

export default handler;
