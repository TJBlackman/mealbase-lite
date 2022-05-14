import { UserModel } from "@src/db/users";
import { PasswordResetModel } from "@src/db/password-resets";
import { NextApiHandler } from "next";
import { createJwt } from "@src/utils/jwt-helpers";
import { mongoDbConnection } from "@src/db/connection";
import { EmailSchema } from "@src/validation/users";

const handler: NextApiHandler = async (req, res) => {
  try {
    if (req.method !== "POST") {
      return res.status(404).send("Not Found");
    }

    // validate req.body.email
    const validationResult = EmailSchema.validate(req.body.email);
    if (validationResult.error) {
      return res.status(400).send(validationResult.error.message);
    }

    // db connection
    await mongoDbConnection();

    // validate account exists - don't tell client if it does/doesn't exist
    const user = await UserModel.findOne({ email: req.body.email });
    if (user) {
      const pwReset = new PasswordResetModel({
        user: user._id,
      });
      await pwReset.save();

      const resetJWT = await createJwt({
        type: "reset-pw-token",
        payload: { _id: pwReset._id.toString() },
      });

      // TODO: email user a link with their reset pw jwt

      // for now, redirect them
      // return res.redirect(307, `/reset-password/confirm/${resetJWT}`);
      return res.status(200).json({ success: true });
    }

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
