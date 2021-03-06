import CookbookModel from '../models/cookbook.model';
import { CookbookQuery, CookbookRecord, AddIdToCookbook } from '../types/type-definitions';
import { Document } from "mongoose";

export const queryCookBooks = async (query: CookbookQuery) => {
  // create filter to match documents against
  const filter = (() => {
    const conditions: CookbookRecord = {
      deleted: false
    };
    if (query._id) {
      conditions._id = query._id;
    }
    if (query.userId) {
      conditions.owner = query.userId;
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
      if (['title', 'createdAt', 'updatedAt'].includes(sortBy)) {
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
    let str = '';
    if (!query.deleted) {
      str = `${str} -deleted`
    };
    return str;
  })();

  const dbOptions = {
    limit: queryLimit,
    skip: querySkip,
    sort: querySort,
    lean: true
  };
  const cookbooks = await CookbookModel.find(filter, projections, dbOptions);
  return cookbooks as unknown as CookbookRecord[];
}
export const saveNewCookbook = async (data: CookbookRecord) => {
  const newRecipe = new CookbookModel({
    createdAt: new Date().toUTCString(),
    updatedAt: new Date().toUTCString(),
    title: data.title,
    description: data.description,
    owner: data.owner,
    sharedWith: data.sharedWith,
    recipes: data.recipes
  });
  const cookbook = await newRecipe.save();
  return cookbook.toObject() as CookbookRecord;
}
export const updateCookbook = async (data: CookbookRecord) => {
  if (!data._id) {
    throw Error('Cannot update cookbook without an _id.')
  }
  const id = data._id;
  // can never edit these values
  delete data.createdAt;
  delete data.__v;
  delete data._id;
  // update timestamp here
  data.updatedAt = new Date().toUTCString();
  const cookbook = await CookbookModel.findByIdAndUpdate(id, data, { new: true });
  if (!cookbook) {
    throw Error(`No recipe found with id: ${data._id}`);
  }
  return cookbook.toObject() as CookbookRecord;
}
export const addRecipeIdToCookbook = async (data: AddIdToCookbook) => {
  const cookbook = await CookbookModel.findById(data.cookbookId) as unknown as Document & CookbookRecord;
  if (!cookbook) {
    throw Error(`Cookbook does not exist: {_id: ${data.cookbookId}}`);
  }
  cookbook.recipes.push(data.recipeId);
  const result = await cookbook.save();
  return result.toObject();
}
export const removeRecipeIdFromCookbook = async (data: AddIdToCookbook) => {
  const cookbook = await CookbookModel.findById(data.cookbookId) as unknown as Document & CookbookRecord;
  if (!cookbook) {
    throw Error(`Cookbook does not exist: {_id: ${data.cookbookId}}`);
  }
  cookbook.recipes = cookbook.recipes.filter(id => id.toString() !== data.recipeId);
  const result = await cookbook.save();
  return result.toObject();
}