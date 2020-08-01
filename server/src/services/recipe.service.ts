import { queryRecipeDAL, saveRecipeDAL, editRecipeDAL, getLikeRecordsByUserId, likeRecipeDAL, unLikedRecipeDAL, getLikeRecordsByRecipeId, countRecipesDAL } from '../DAL/recipe.dal';
import { userHasRole } from '../utils/validators'
import { JWTUser, RecipeQuery, RecipeRecord } from '../types/type-definitions';
import { getRecipeData } from './puppeteer.service';
import { cleanUrl } from '../utils/clean-url';
import { cleanRecipeTitle } from '../utils/clean-recipe-title';

export const getRecipesService = async (query: RecipeQuery, user: JWTUser) => {
  const totalCount = await countRecipesDAL(query);
  const recipes = await queryRecipeDAL(query);
  if (user) {
    // confirm which recipes this user has liked
    const recipeIds = recipes.map(i => i._id);
    const likeRecords = await getLikeRecordsByUserId({ userId: user._id, recipeIds });
    if (likeRecords.length > 0) {
      let i = 0;
      const imax = likeRecords.length;
      for (; i < imax; ++i) {
        const likeRecord = likeRecords[i];
        let j = 0;
        const jmax = recipes.length;
        for (; j < jmax; ++j) {
          const recipe = recipes[j];
          if (recipe._id.toString() === likeRecord.recipeId.toString()) {
            recipe.isLiked = true;
          }
        }
      }
    }
  }
  return {
    totalCount,
    recipes
  };
}

export const newRecipeService = async (data: RecipeRecord, user: JWTUser) => {
  const { url } = data;
  if (!url) {
    throw Error('URL is required.');
  }
  const newUrl = cleanUrl(url);

  const foundRecipe = await queryRecipeDAL({ url: newUrl });
  if (foundRecipe.length > 0) {
    return foundRecipe[0];
  }
  const pptrData = await getRecipeData(newUrl);
  if (pptrData) {
    const pptrRecipe = pptrData as RecipeRecord;
    cleanRecipeTitle(pptrRecipe);
    const recipe = await saveRecipeDAL(pptrRecipe);
    return recipe;
  } else {
    throw Error('Recipe could not be retreived.')
  }
}

export const editRecipeService = async (data: RecipeRecord, user: JWTUser) => {
  if (userHasRole('admin', user)) {
    const recipe = await editRecipeDAL(data);
    return recipe;
  }
  throw Error('Only an admin can edit a recipe.')
}

export const deleteRecipeService = async (data: RecipeRecord, user: JWTUser) => {
  if (userHasRole('admin', user)) {
    const recipe = await editRecipeDAL({ ...data, deleted: true });
    // delete any like-recipe records
    const likeRecords = await getLikeRecordsByRecipeId(recipe._id);
    let i = 0;
    const imax = likeRecords.length;
    for (; i - imax; ++i) {
      await unLikedRecipeDAL(likeRecords[i]._id);
    }
    return recipe;
  }
  throw Error('Only an admin can delete a recipe.')
}

export const likeRecipeService = async (data: { recipeId: string; }, user: JWTUser) => {
  const existingRecipe = await queryRecipeDAL({ _id: data.recipeId });
  if (existingRecipe.length < 1) {
    throw Error('Recipe does not exist.');
  }
  const alreadyLiked = await getLikeRecordsByUserId({ recipeIds: [data.recipeId], userId: user._id });
  if (alreadyLiked.length > 0) {
    return {
      ...existingRecipe[0],
      isLiked: true
    };
  }
  await likeRecipeDAL({ recipeId: data.recipeId, userId: user._id });
  const newRecipe = await editRecipeDAL({
    _id: data.recipeId,
    likes: existingRecipe[0].likes + 1
  })
  return {
    ...newRecipe,
    isLiked: true
  };
}

export const unLikedRecipeService = async (data: { recipeId: string; }, user: JWTUser) => {
  const existingRecipe = await queryRecipeDAL({ _id: data.recipeId });
  if (existingRecipe.length < 1) {
    throw Error('Recipe does not exist.');
  }
  const recipeIsLiked = await getLikeRecordsByUserId({ recipeIds: [data.recipeId], userId: user._id });
  if (recipeIsLiked.length < 1) {
    return existingRecipe[0];
  }
  await unLikedRecipeDAL(recipeIsLiked[0]._id);
  const newRecipe = await editRecipeDAL({
    _id: data.recipeId,
    likes: existingRecipe[0].likes - 1
  });
  return newRecipe;
}