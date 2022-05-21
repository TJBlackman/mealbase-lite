import { UserModel } from "@src/db/users";
import { PasswordResetModel } from "@src/db/password-resets";
import { RefreshTokenModel } from "@src/db/refresh-tokens";
import { NextApiHandler } from "next";
import { createJwt, verifyJwt } from "@src/utils/jwt-helpers";
import cookie from "cookie";
import { getFutureDate } from "@src/utils/get-expires-date";
import { mongoDbConnection } from "@src/db/connection";
import { resetPasswordConfirmSchema } from "@src/validation/schemas/users";
import { createHash } from "@src/utils/hash-helpers";

const handler: NextApiHandler = async (req, res) => {
  try {
    // validate method type
    if (req.method !== "POST") {
      return res.status(404).send("Not Found");
    }

    // validate request body
    const validationResult = resetPasswordConfirmSchema.validate(req.body);
    if (validationResult.error) {
      return res.status(400).send(validationResult.error.message);
    }

    // validate jwt
    const jwt = await verifyJwt<{ _id: string }>(req.body.jwt);

    // db connection
    await mongoDbConnection();

    // get reset pw record from db
    const record = await PasswordResetModel.findById(jwt._id);
    if (!record) {
      return res.status(404).send("Record not found.");
    }

    // get user that is saved in PW reset record
    const user = await UserModel.findById(record.user);
    if (!user) {
      return res.status(404).send("User not found.");
    }

    // hash new password
    const hash = await createHash(req.body.password);

    // update and save user record.
    user.password = hash;
    await user.save();

    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    let msg = "An unknown error occurred.";
    if (err instanceof Error) {
      msg = err.message;
    }
    res.status(500).send(msg);
  }
};

export default handler;
