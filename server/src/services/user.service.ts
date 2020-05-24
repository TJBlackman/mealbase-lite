import { createHash, compareHash } from '../utils/hash-password';
import { validateNewUser, userHasRole } from '../utils/validators';
import { queryUsers, saveNewUser, updateExistingUser } from '../DAL/user.dal'

import { GetUsersQuery, ExistingUserData, NewUserData, JWTUser, Roles } from '../types/type-definitions';

export const queryAllUsers = async (queryString: GetUsersQuery, user: JWTUser) => {
  if (userHasRole(Roles.Admin, user)) {
    const result = await queryUsers(queryString);
    console.log(JSON.stringify(queryString));
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
  throw Error('You do not have the required permissions.')
};

export const registerNewUser = async (data: NewUserData) => {
  const { error } = validateNewUser(data);
  if (error) {
    throw Error(error);
  }
  const existingUser = await queryUsers({ email: data.email });
  if (existingUser.length > 0) {
    throw Error('Email address may already be registered.');
  }
  const hashedPw = await createHash(data.password);
  const user = await saveNewUser({
    email: data.email,
    password: hashedPw
  });
  delete user.password;
  delete user.deleted;
  delete user.__v;
  return user;
};

export const editExistingUser = async (data: ExistingUserData, user: JWTUser) => {
  if (data.newPassword) {
    // overwrite password with hash
    console.log('hashing a new password...')
    data.password = await createHash(data.newPassword);
  }
  if (data.email) {
    const existingUser = await queryUsers({ email: data.email });
    if (existingUser.length > 0) {
      throw Error('Email address may already be registered.');
    }
  }
  if (userHasRole(Roles.Admin, user)) {
    const updatedUser = await updateExistingUser(data);
    return updatedUser;
  }
  delete data.roles; // revoke access to editing roles
  if (userHasRole(Roles.Support, user)) {
    const updatedUser = await updateExistingUser(data);
    return updatedUser;
  }
  if (userHasRole(Roles.User, user)) {
    if (data._id !== user._id) {
      throw Error('Users may only edit their own accounts.');
    }
    if (data.newPassword || data.email) {
      const _user = await queryUsers({ _id: user._id });
      const passwordIsCorrect = compareHash(data.newPassword, _user[0].password);
      if (!passwordIsCorrect) {
        throw Error('Password is incorrect.');
      }
    }
    const updatedUser = await updateExistingUser(data);
    delete updatedUser.password;
    delete updatedUser.__v;
    delete updatedUser.deleted;
    return updatedUser;
  }
};

export const markUserDeleted = async (data: ExistingUserData, user: JWTUser) => {
  if (userHasRole([Roles.Admin, Roles.Support], user)) {
    await updateExistingUser({
      _id: data._id,
      deleted: true
    });
    return true;
  }
  if (userHasRole(Roles.User, user)) {
    // can only delete own account
    await updateExistingUser({
      _id: user._id,
      deleted: true
    });
    return;
  }
  throw Error('Permissions are required.')
}