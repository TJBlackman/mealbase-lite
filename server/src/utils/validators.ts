import {
  ValidationResult,
  NewUserData,
  ExistingUserData,
  JWTUser
} from '../types/type-definitions';
import regexpatterns from './regex-patterns';

// validate incoming data when registering new user
export const validateNewUser = (data: NewUserData) => {
  const result: ValidationResult = { error: undefined };
  try {
    const { email, password } = data;
    if (!email) {
      result.error = 'Email address is required.';
      return result;
    }
    if (email.length > 100) {
      result.error = 'Email address cannot be over 100 characters in length.';
      return result;
    }
    if (!regexpatterns.email.test(email)) {
      result.error =
        'Email address does not appear to be valid. If you believe this is an error, please contact support.';
      return result;
    }
    if (!password) {
      result.error = 'Password is required';
      return result;
    }
    if (password.length < 3) {
      result.error = 'Password must be at least 3 characters long (but please make it much, much longer).';
      return result;
    }
    if (password.length > 100) {
      result.error = 'Password length cannot exceed 100 characters.';
      return result;
    }
    return result;
  } catch (err) {
    result.error = err.message;
    return result;
  }
};

// validate data for existing user
export const validateExistingUser = (data: ExistingUserData) => {
  const result: ValidationResult = { error: undefined };
  try {
    const { email, password, _id } = data;
    if (!email) {
      result.error = 'Email address is required.';
      return result;
    }
    if (email.length > 100) {
      result.error = 'Email address cannot be over 100 characters in length.';
      return result;
    }
    if (regexpatterns.email.test(email)) {
      result.error =
        'Email address does not appear to be valid. If you believe this is an error, please contact support.';
      return result;
    }
    if (!password) {
      result.error = 'Password is required';
      return result;
    }
    if (password.length < 3) {
      result.error = 'Password must be at least 3 characters long (but please make it much, much longer).';
      return result;
    }
    if (password.length > 100) {
      result.error = 'Password length cannot exceed 100 characters.';
      return result;
    }
    if (_id) {
      result.error = 'User is missing _id property.';
      return result;
    }
    return result;
  } catch (err) {
    result.error = err.message;
    return result;
  }
};

// check a user JWT for an existing role
export const userHasRole = (roles: string | string[], user: JWTUser) => {
  if (!user) {
    return false;
  }
  if (Array.isArray(roles)) {
    let i = 0,
      max = roles.length;
    if (!user || !user.roles) {
      throw Error(`Unable to validate user role.`);
    }
    for (; i < max; ++i) {
      const role = roles[i];
      if (user.roles.includes(role)) {
        return true;
      }
    }
  } else {
    if (user.roles.includes(roles)) {
      return true;
    }
  }
  return false;
}