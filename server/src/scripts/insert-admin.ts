import UserModel from '../models/user.model';
import { createHash } from '../utils/hash-password';
import { Roles } from '../types/type-definitions'

// if an admin does not exist
// add one to the db with credentials from .env file

export default async () => {
  try {
    const admin = await UserModel.findOne({ email: process.env.ROOT_ADMIN });
    if (!admin) {
      const hashedPW = await createHash(process.env.ROOT_ADMIN_PW);
      const user = new UserModel({
        createdAt: new Date().toUTCString(),
        updatedAt: new Date().toUTCString(),
        email: process.env.ROOT_ADMIN,
        password: hashedPW,
        roles: [Roles.Admin]
      });
      await user.save();
    }
  }
  catch (err) {
    console.log('CATASTRAPHIC ERROR: ')
    console.log(err.message)
  }
}