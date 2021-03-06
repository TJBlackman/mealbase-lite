import MealPlanModel from '../models/mealplan.model';
import { MealPlanQuery, MealPlanRecord } from '../types/type-definitions';

export const queryMealPlans = async (query: MealPlanQuery) => {
  // create filter to match documents against
  const filter = (() => {
    const conditions: MealPlanRecord = {
      deleted: false
    };
    if (query._id) {
      conditions._id = query._id;
    }
    if (query.owner) {
      conditions.owner = query.owner;
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
  const recipes = await MealPlanModel.find(filter, projections, dbOptions);
  return recipes as unknown as MealPlanRecord[];
}
export const saveNewMealPlan = async (data: MealPlanRecord) => {
  const newRecipe = new MealPlanModel({
    createdAt: new Date().toUTCString(),
    updatedAt: new Date().toUTCString(),
    title: data.title,
    owner: data.owner,
    sharedWith: data.sharedWith,
    recipes: data.recipes
  });
  const recipe = await newRecipe.save();
  return recipe.toObject() as MealPlanRecord;
}
export const updateMealPlan = async (data: MealPlanRecord) => {
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
  const recipe = await MealPlanModel.findByIdAndUpdate(id, data, { new: true });
  if (!recipe) {
    throw Error(`No recipe found with id: ${data._id}`);
  }
  return recipe.toObject() as MealPlanRecord;
}