import { queryCookBooks, saveNewCookbook, updateCookbook } from '../DAL/cookbook.dal';
import { CookbookQuery, JWTUser, Roles, CookbookRecord } from '../types/type-definitions';
import { userHasRole } from '../utils/validators';

export const getCookbooks = async (query: CookbookQuery, user: JWTUser) => {
  if (userHasRole([Roles.Admin, Roles.Support], user)) {
    const cookbooks = await queryCookBooks(query);
    return cookbooks;
  }
  // revoke ability to search by deleted
  delete query.deleted;

  const cookbooks = await queryCookBooks({
    ...query,
    userId: user._id
  });
  return cookbooks;
}

export const createNewCookbook = async (data: CookbookRecord, user: JWTUser) => {
  if (userHasRole([Roles.Admin, Roles.Support], user)) {
    const cookbook = await saveNewCookbook(data);
    return cookbook;
  }

  const cookbook = await saveNewCookbook({
    ...data,
    owner: user._id
  });
  return cookbook;
}

export const editCookbook = async (data: CookbookRecord, user: JWTUser) => {
  if (!data._id) {
    throw Error('Cookbook id is required.');
  }

  if (userHasRole([Roles.Admin, Roles.Support], user)) {
    const cookbook = await updateCookbook(data);
    return cookbook;
  }

  const cb = await queryCookBooks({ _id: data._id });
  if (cb.length < 1) {
    throw Error('No recipe with _id: ' + data._id);
  }
  if (cb[0].owner.toString() !== user._id) {
    throw Error('You do not have permission to edit this cookbook.');
  }
  const cookbook = await updateCookbook(data);
  return cookbook;
}

export const deleteCookbook = async (data: CookbookRecord, user: JWTUser) => {
  if (!data._id) {
    throw Error('Cookbook id is required.');
  }

  if (userHasRole([Roles.Admin, Roles.Support], user)) {
    const cookbook = await updateCookbook({
      ...data,
      deleted: true
    });
    return cookbook;
  }

  const cb = await queryCookBooks({ _id: data._id });
  if (cb.length < 1) {
    throw Error('No recipe with _id: ' + data._id);
  }
  if (cb[0].owner.toString() !== user._id) {
    throw Error('You do not have permission to delete this cookbook.');
  }
  const cookbook = await updateCookbook({
    _id: data._id,
    deleted: true
  });
  return cookbook;
}