import { UserModel } from '@src/db/users';
import { RefreshTokenModel } from '@src/db/refresh-tokens';
import { NextApiHandler } from 'next';
import { createJwt, verifyJwt } from '@src/utils/jwt-helpers2';
import cookie from 'cookie';
import { getFutureDate } from '@src/utils/get-expires-date';
import { mongoDbConnection } from '@src/db/connection';

const handler: NextApiHandler = async (req, res) => {
  try {
    // check for refresh token JWT in httpOnly cookie
    const refreshTokenJwt = req.cookies[process.env.REFRESH_TOKEN_COOKIE_NAME!];
    if (!refreshTokenJwt) {
      return res.status(401).send('Invalid or missing token.');
    }

    // decode refresh token JWT
    const refreshTokenId = await verifyJwt<{ _id: string }>(refreshTokenJwt);
    await mongoDbConnection();

    // get refresh token record from db
    const oldRefreshToken = await RefreshTokenModel.findByIdAndDelete(
      refreshTokenId._id
    );
    if (!oldRefreshToken) {
      return res.status(401).send('Unauthorized.');
    }

    // get user from db
    const user = await UserModel.findById(oldRefreshToken.userId);
    if (!user) {
      return res.status(404).send('User not found.');
    }
    // update user last activity
    user.lastActiveDate = new Date();
    await user.save();

    // create new refresh token record
    const refreshToken = new RefreshTokenModel({
      userId: user._id,
    });
    await refreshToken.save();

    // create refreshToken JWT
    const newRefreshTokenJwt = await createJwt({
      type: 'refresh-token',
      payload: {
        _id: refreshToken._id.toString(),
      },
    });

    // create access token JWT
    const accessTokenJwt = await createJwt({
      type: 'access-token',
      payload: {
        _id: user._id,
        email: user.email,
        roles: user.roles,
      },
    });

    // set access token and refresh token as httpOnly cookies
    res.setHeader('Set-Cookie', [
      cookie.serialize(process.env.ACCESS_TOKEN_COOKIE_NAME!, accessTokenJwt, {
        httpOnly: true,
        secure: true,
        path: '/',
      }),
      cookie.serialize(
        process.env.REFRESH_TOKEN_COOKIE_NAME!,
        newRefreshTokenJwt,
        {
          expires: getFutureDate(process.env.REFRESH_TOKEN_COOKIE_EXPIRE_DAYS!),
          httpOnly: true,
          secure: true,
          path: '/',
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
    console.log(err);
    let msg = 'An unknown error occurred.';
    if (err instanceof Error) {
      msg = err.message;
    }
    res.status(500).send(msg);
  }
};

export default handler;
