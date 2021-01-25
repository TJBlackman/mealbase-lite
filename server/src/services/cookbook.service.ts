import { queryCookBooks, saveNewCookbook, updateCookbook, addRecipeIdToCookbook, removeRecipeIdFromCookbook } from '../DAL/cookbook.dal';
import { CookbookQuery, JWTUser, Roles, CookbookRecord, AddIdToCookbook } from '../types/type-definitions';
import { userHasRole } from '../utils/validators';
import { queryRecipeDAL } from "../DAL/recipe.dal";
import { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } from 'constants';

export const getCookbooks = async (query: CookbookQuery, user: JWTUser) => {
  if (userHasRole([Roles.Admin, Roles.Support], user)) {
    const _cookbooks = await queryCookBooks(query);
    return _cookbooks;
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
    const _cookbook = await saveNewCookbook({
      ...data,
      owner: data.owner || user._id
    });
    return _cookbook;
  }
  const cookbook = await saveNewCookbook({
    title: data.title,
    description: data.description,
    owner: user._id
  });
  return cookbook;
}

export const editCookbook = async (data: CookbookRecord, user: JWTUser) => {
  if (!data._id) {
    throw Error('Cookbook id is required.');
  }

  if (userHasRole([Roles.Admin, Roles.Support], user)) {
    const _cookbook = await updateCookbook(data);
    return _cookbook;
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
    const _cookbook = await updateCookbook({
      ...data,
      deleted: true
    });
    return _cookbook;
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

export const addRecipeToCookbook = async (data: AddIdToCookbook, user: JWTUser) => {
  if (!data.cookbookId || !data.recipeId) {
    throw Error('CookbookId and RecipeId are both required!');
  };

  const cookbooks = await queryCookBooks({ _id: data.cookbookId });
  if (cookbooks.length < 1) {
    throw Error(`Cookbook with id "${data.cookbookId}" dos not exist.`);
  }
  const recipes = await queryRecipeDAL({ _id: data.recipeId });
  if (recipes.length < 1) {
    throw Error(`Recipe with id "${data.recipeId}" does not exist.`)
  }

  if (userHasRole([Roles.Admin, Roles.Support], user)) {
    await addRecipeIdToCookbook(data);
    return true;
  }

  if (user._id.toString() !== cookbooks[0].owner.toString()) {
    throw Error('Only the cookbook owner can add recipes to their cookbooks.')
  }

  await addRecipeIdToCookbook(data);
  return true;
}

export const removeRecipeFromCookbook = async (data: AddIdToCookbook, user: JWTUser) => {
  if (!data.cookbookId || !data.recipeId) {
    throw Error('CookbookId and RecipeId are both required!');
  };

  const cookbooks = await queryCookBooks({ _id: data.cookbookId });
  if (cookbooks.length < 1) {
    throw Error(`Cookbook with id "${data.cookbookId}" dos not exist.`);
  }

  if (userHasRole([Roles.Admin, Roles.Support], user)) {
    await removeRecipeIdFromCookbook(data);
    return true;
  }

  if (user._id.toString() !== cookbooks[0].owner.toString()) {
    throw Error('Only the cookbook owner can remove recipes from their cookbooks.')
  }

  await removeRecipeIdFromCookbook(data);
  return true;
}