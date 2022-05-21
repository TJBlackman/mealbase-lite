import cookie from "cookie";
import { UserModel } from "@src/db/users";
import { Roles, UserJwt } from "@src/types/index.d";
import type { NextApiHandler } from "next";
import { createJwt, verifyJwt } from "@src/utils/jwt-helpers";
import { createHash, compareHash } from "@src/utils/hash-helpers";
import { mongoDbConnection } from "@src/db/connection";
import {
  registerUserSchema,
  PasswordSchema,
  EmailSchema,
} from "@src/validation/schemas/users";
import { RefreshTokenModel } from "@src/db/refresh-tokens";
import { getFutureDate } from "@src/utils/get-expires-date";

const handler: NextApiHandler = async (req, res) => {
  try {
    // must be a put request
    if (req.method !== "PUT") {
      return res.status(404).send("Not Found");
    }

    // validate logged in user
    const accessToken = req.cookies[process.env.ACCESS_TOKEN_COOKIE_NAME!];
    if (!accessToken) {
      return res.status(401).send("Unauthorized.");
    }
    const userJwt = await verifyJwt<UserJwt>(accessToken).catch((err) => {
      console.log("Unable to verify Access Token JWT.");
      console.log(err);
    });
    if (!userJwt) {
      return res.status(401).send("Unauthorized.");
    }

    // validate password fields, if it exists
    if (req.body.password) {
      const e1 = PasswordSchema.validate(req.body.password);
      if (e1.error) {
        return res.status(400).send(`Password error: ${e1.error.message}`);
      }
      const e2 = PasswordSchema.validate(req.body.newPw);
      if (e2.error) {
        return res.status(400).send(`New Password error: ${e2.error.message}`);
      }
    }

    // validate email, if it exists
    if (req.body.email) {
      const e1 = EmailSchema.validate(req.body.email);
      if (e1.error) {
        return res.status(400).send(e1.error.message);
      }
    }

    // connect to db
    await mongoDbConnection();

    // get user record from db
    const userDocument = await UserModel.findById(userJwt._id);
    if (!userDocument) {
      return res.status(404).send("User account not found.");
    }

    // handle password, if it exists
    if (req.body.password) {
      const isCorrectPw = await compareHash(
        req.body.password,
        userDocument.password
      );
      if (!isCorrectPw) {
        return res.status(401).send("Incorrect password.");
      }
      const newPwHash = await createHash(req.body.newPw);
      userDocument.password = newPwHash;
    }

    // handle email, if it exists
    if (req.body.email) {
      userDocument.email = req.body.email;
    }

    // save db record
    await userDocument.save();

    res.json({ email: userDocument.email });
  } catch (err) {
    let msg = `An unknown error occurred.`;
    if (err instanceof Error) {
      msg = err.message;
    }
    res.status(500).send(msg);
  }
};

export default handler;
