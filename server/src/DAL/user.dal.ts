import UserModel from '../models/user.model';
import ResetPasswordModel from "../models/password-reset-record";
import {
  GetUsersQuery,
  GetUsersDbConditions,
  ExistingUserData,
  NewUserData,
} from '../types/type-definitions';

export const getSensitiveUserDataById = async (id: string) => {
  const user = UserModel.findById(id);
  return (user as undefined) as ExistingUserData;
};

export const queryUsers = async (query: GetUsersQuery) => {
  // create filter to match documents against
  const filter = (() => {
    const conditions: GetUsersDbConditions = {
      deleted: false,
    };
    if (query.deleted) {
      conditions.deleted = true;
    }
    if (query.email) {
      conditions.email = query.email;
    }
    if (query._id) {
      conditions._id = query._id;
    }
    if (query.role) {
      conditions.roles = query.role;
    }
    if (query.search) {
      conditions.email = { $regex: query.search, $options: 'i' };
    }
    return conditions;
  })();

  // set min and max limit, 1 - 100, default 20
  const queryLimit = (() => {
    let limit = 20;
    const possibleLimit = Number(query.limit);
    if (possibleLimit) {
      limit = possibleLimit;
      if (possibleLimit < 1) {
        limit = 1;
      }
      if (possibleLimit > 100) {
        limit = 100;
      }
    }
    return limit;
  })();

  // skip, not below 0
  const querySkip = (() => {
    let skip = 0;
    const possibleSkip = Number(query.skip);
    if (possibleSkip) {
      skip = possibleSkip;
      if (possibleSkip < 0) {
        skip = 0;
      }
    }
    return skip;
  })();

  // create sort object; {fieldName: 1|-1}
  const querySort = (() => {
    let fieldName = 'createdAt';
    let direction = 1;

    const { sortBy, sortOrder } = query;
    if (sortBy) {
      // whitelist sortable properties
      if (['email', 'createdAt', 'updatedAt', 'roles'].includes(sortBy)) {
        fieldName = sortBy;
      }
    }
    if (Number(sortOrder) === -1) {
      direction = -1;
    }

    const result: any = {};
    result[fieldName] = direction;
    return result;
  })();

  // set default projectstion
  const projections = (() => {
    let str = '-password';
    if (query.deleted !== true) {
      str = `${str} -deleted`;
    }
    return str;
  })();
  const dbOptions = {
    limit: queryLimit,
    skip: querySkip,
    sort: querySort,
    lean: true,
  };
  const users = await UserModel.find(filter, projections, dbOptions);
  return (users as unknown) as [ExistingUserData];
};

export const saveNewUser = async (data: NewUserData) => {
  const newUser = new UserModel({
    createdAt: new Date().toUTCString(),
    updatedAt: new Date().toUTCString(),
    email: data.email,
    password: data.password,
    roles: ['user'],
  });
  const user = await newUser.save();
  return user.toObject() as ExistingUserData;
};

export const updateExistingUser = async (data: ExistingUserData) => {
  if (!data._id) {
    throw Error('Cannot update user without an _id.');
  }
  // save reference to id
  const id = data._id;
  // can never edit these values
  delete data.createdAt;
  delete data.__v;
  delete data._id;
  // update timestamp here
  data.updatedAt = new Date().toUTCString();
  const user = await UserModel.findByIdAndUpdate(id, data, { new: true });
  if (!user) {
    throw Error(`No user found with id: ${data._id}`);
  }
  return user.toObject() as ExistingUserData;
};

export const createResetPasswordRecord = async (data: { userId: string }) => {
  const record = new ResetPasswordModel({
    createdAt: new Date().toUTCString(),
    userId: data.userId
  });
  const savedRecord = await record.save();
  return savedRecord.toObject();
}