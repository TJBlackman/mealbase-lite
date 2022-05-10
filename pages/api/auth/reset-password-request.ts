import { UserModel } from '@src/db/users';
import { PasswordResetModel } from '@src/db/password-resets';
import { RefreshTokenModel } from '@src/db/refresh-tokens';
import { NextApiHandler } from 'next';
import { createJwt, verifyJwt } from '@src/utils/jwt-helpers';
import cookie from 'cookie';
import { getFutureDate } from '@src/utils/get-expires-date';
import { mongoDbConnection } from '@src/db/connection';
import { EmailSchema } from '@src/validation/users';

const handler: NextApiHandler = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      return res.status(404).send('Not Found');
    }

    // validate req.body.email
    const validationResult = EmailSchema.validate(req.body.email);
    if (validationResult.error) {
      return res.status(400).send(validationResult.error.message);
    }

    const user = await UserModel.findOne({ email: req.body.email });
    if (user) {
      const pwReset = new PasswordResetModel({
        user: user._id,
      });
      await pwReset.save();

      const resetJWT = await createJwt({
        type: 'reset-pw-token',
        payload: pwReset._id.toString(),
      });

      // email user a link with their reset pw jwt
      res.json({ jwt: resetJWT });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    let msg = 'An unknown error occurred.';
    if (err instanceof Error) {
      msg = err.message;
    }
    res.status(500).send(msg);
  }
};

export default handler;
