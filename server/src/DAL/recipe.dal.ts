import RecipeModel from '../models/recipe.model';
import RecipeLikeModel from '../models/recipe-likes.model';
import { RecipeRecord, RecipeQuery, IRecipeLikeRecord, IRecipeLikeRequest } from '../types/type-definitions'

export const queryRecipes = async (query: RecipeQuery) => {
  // create filter to match documents against
  const filter = (() => {
    const conditions: RecipeRecord = {
      deleted: false
    };
    if (query._id) {
      conditions._id = query._id;
    }
    if (query.url) {
      conditions.url = query.url;
    }
    if (query.deleted) {
      conditions.deleted = query.deleted;
    }
    if (query.search) {
      conditions.title = { $regex: query.search, $options: 'i' };;
    }
    return conditions;
  })();

  // set min and max limit, 1 - 100, default 20
  const queryLimit = (() => {
    let limit = 20;
    const potential_limit = Number(query.limit);
    if (potential_limit) {
      limit = potential_limit;
      if (potential_limit < 1) {
        limit = 1;
      }
      if (potential_limit > 100) {
        limit = 100;
      }
    }
    return limit;
  })();

  // skip, not below 0
  const querySkip = (() => {
    let skip = 0;
    const potential_skip = Number(query.skip);
    if (potential_skip) {
      skip = potential_skip;
      if (potential_skip < 0) {
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
      if (['title', 'createdAt', 'updatedAt', 'siteName'].includes(sortBy)) {
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
    if (query.deleted !== true) {
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
  const recipes = await RecipeModel.find(filter, projections, dbOptions);
  return recipes as unknown as RecipeRecord[];
}

export const saveNewRecipe = async (data: RecipeRecord) => {
  const newRecipe = new RecipeModel({
    createdAt: new Date().toUTCString(),
    updatedAt: new Date().toUTCString(),
    title: data.title,
    description: data.description,
    image: data.image,
    url: data.url,
    siteName: data.siteName
  });
  const recipe = await newRecipe.save();
  return recipe.toObject() as RecipeRecord;
}

export const updateRecipe = async (data: RecipeRecord) => {
  if (!data._id) {
    throw Error('Cannot update recipe without an _id.')
  }
  const id = data._id;
  // can never edit these values
  delete data.createdAt;
  delete data.__v;
  delete data._id;
  // update timestamp here
  data.updatedAt = new Date().toUTCString();
  const recipe = await RecipeModel.findByIdAndUpdate(id, data, { new: true });
  if (!recipe) {
    throw Error(`No recipe found with id: ${data._id}`);
  }
  return recipe.toObject() as RecipeRecord;
}

export const getRecipeLikedRecord = async (data: IRecipeLikeRequest) => {
  const document = await RecipeLikeModel.findOne(data);
  return document as unknown as IRecipeLikeRecord;
};

export const likeRecipe = async (data: IRecipeLikeRequest) => {
  const record = new RecipeLikeModel({
    userId: data.userId,
    recipeId: data.recipeId,
    createdAt: new Date().toUTCString()
  })
  const document = await record.save();
  return document as unknown as IRecipeLikeRecord;
}

export const unLikedRecipe = async (_id: string) => {
  const result = await RecipeLikeModel.findByIdAndDelete(_id);
  return result;
}