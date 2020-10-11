import { createHash, compareHash } from '../utils/hash-password';
import { validateNewUser, userHasRole } from '../utils/validators';
import {
  queryUsers,
  saveNewUser,
  updateExistingUser,
  getSensitiveUserDataById,
} from '../DAL/user.dal';
import { createRPR, queryRPR, editRPR } from "../DAL/password-reset.dal";
import {
  GetUsersQuery,
  ExistingUserData,
  NewUserData,
  JWTUser,
  Roles,
} from '../types/type-definitions';
import { sendResetPasswordEmail } from "./email.service";
import { createJWT, verifyJWT } from "../utils/jwt-helpers";

export const queryAllUsers = async (
  queryString: GetUsersQuery,
  user: JWTUser
) => {
  if (userHasRole(Roles.Admin, user)) {
    const result = await queryUsers(queryString);
    return result;
  }
  if (userHasRole(Roles.Support, user)) {
    const result = await queryUsers(queryString);
    return result;
  }
  if (userHasRole(Roles.User, user)) {
    // user can only get it's own data
    const result = await queryUsers({ _id: user._id });
    return result;
  }
  throw Error('Unauthorized. Please login.');
};

export const registerNewUser = async (data: NewUserData) => {
  const { error } = validateNewUser(data);
  if (error) {
    throw Error(error);
  }
  const existingUser = await queryUsers({ email: data.email, deleted: false });
  if (existingUser.length > 0) {
    throw Error('Email address may already be registered.');
  }
  const hashedPw = await createHash(data.password);
  const user = await saveNewUser({
    email: data.email,
    password: hashedPw,
  });
  delete user.password;
  delete user.deleted;
  delete user.__v;
  return user;
};

export const editExistingUser = async (
  data: ExistingUserData,
  user: JWTUser
) => {
  if (data.email) {
    const existingUser = await queryUsers({ email: data.email });
    if (existingUser.length > 0) {
      throw Error('Email address may already be registered.');
    }
  }
  if (userHasRole(Roles.Admin, user)) {
    if (data.password) {
      data.password = await createHash(data.password);
    }
    const updatedUser = await updateExistingUser(data);
    return updatedUser;
  }
  delete data.roles; // revoke access to editing roles
  if (userHasRole(Roles.Support, user)) {
    if (data.password) {
      data.password = await createHash(data.password);
    }
    const updatedUser = await updateExistingUser(data);
    return updatedUser;
  }
  if (userHasRole(Roles.User, user)) {
    if (data._id !== user._id) {
      throw Error('Users may only edit their own accounts.');
    }
    const _user = await getSensitiveUserDataById(user._id);
    const dataToUpdate: ExistingUserData = {
      _id: user._id,
    };
    // update user email
    if (data.email) {
      if (!data.password) {
        throw Error('Password is required to change email address.');
      }
      const pwIsCorrect = await compareHash(data.password, _user.password);
      if (!pwIsCorrect) {
        throw Error('Password is incorrect.');
      }
      dataToUpdate.email = data.email;
    }
    // update password
    if (data.newPassword) {
      if (!data.password) {
        throw Error('Password is required to change password.');
      }
      const passwordIsCorrect = await compareHash(
        data.password,
        _user.password
      );
      if (!passwordIsCorrect) {
        throw Error('Password is incorrect.');
      }
      const pw = await createHash(data.newPassword);
      dataToUpdate.password = pw;
    }
    const updatedUser = await updateExistingUser(dataToUpdate);
    delete updatedUser.password;
    delete updatedUser.__v;
    delete updatedUser.deleted;
    return updatedUser;
  }
};

export const markUserDeleted = async (
  data: ExistingUserData,
  user: JWTUser
) => {
  if (userHasRole([Roles.Admin, Roles.Support], user)) {
    await updateExistingUser({
      _id: data._id,
      deleted: true,
    });
    return true;
  }
  if (userHasRole(Roles.User, user)) {
    // can only delete own account
    await updateExistingUser({
      _id: user._id,
      deleted: true,
    });
    return;
  }
  throw Error('Permissions are required.');
};

export const requestResetPassword = async (data: { email: string }) => {
  const user = await queryUsers({ email: data.email });
  if (user.length < 1) {
    throw Error('User does not exist.');
  };
  const resetRecord = await createRPR({ userId: user[0]._id });
  const resetJwt = await createJWT({ _id: resetRecord._id }, { expiresIn: process.env.PASSWORD_RESET_TIMEOUT });
  const y = await sendResetPasswordEmail({
    email: data.email,
    jwt: resetJwt
  });
  return true;
}

export const confirmResetPassword = async (data: { jwt: string; newPassword: string; }) => {
  const jwt = await verifyJWT<{ _id: string }>(data.jwt).catch(err => {
    throw Error('Password link is no longer valid. Please request a new link.');
  });
  const rpr = await queryRPR({ _id: jwt._id });
  if (rpr.length < 0) {
    throw Error('Reset Password Record does not exist.');
  };
  if (rpr[0].valid === false) {
    throw Error('Password link is invalid. Please request a new link.');
  };
  const hashedPw = await createHash(data.newPassword);
  await updateExistingUser({
    _id: rpr[0].userId,
    password: hashedPw
  });
  await editRPR({
    _id: rpr[0]._id,
    valid: false
  });
  return true;
};