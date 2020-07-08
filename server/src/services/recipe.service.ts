import { queryRecipes, saveNewRecipe, updateRecipe, getRecipeLikedRecord, likeRecipe, unLikedRecipe } from '../DAL/recipe.dal';
import { userHasRole } from '../utils/validators'
import { JWTUser, RecipeQuery, RecipeRecord } from '../types/type-definitions';
import { getRecipeData } from './puppeteer.service';

export const getRecipesService = async (query: RecipeQuery, user: JWTUser) => {
  // if (userHasRole('admin', user)){
  const recipes = await queryRecipes(query);
  return recipes;
  // }
}

export const postNewRecipe = async (data: RecipeRecord, user: JWTUser) => {
  const { url } = data;
  if (!url) {
    throw Error('URL is required.');
  }
  const foundRecipe = await queryRecipes({ url: url.split('?')[0] });
  if (foundRecipe.length > 0) {
    return foundRecipe[0];
  }
  const pptrData = await getRecipeData(url);
  if (pptrData) {
    const recipe = await saveNewRecipe(pptrData as RecipeRecord);
    return recipe;
  } else {
    throw Error('Recipe could not be retreived.')
  }
}

export const updateExistingRecipe = async (data: RecipeRecord, user: JWTUser) => {
  if (userHasRole('admin', user)) {
    const recipe = await updateRecipe(data);
    return recipe;
  }
  throw Error('Only an admin can edit a recipe.')
}

export const deleteRecipe = async (data: RecipeRecord, user: JWTUser) => {
  if (userHasRole('admin', user)) {
    const recipe = await updateRecipe({ ...data, deleted: true });
    return recipe;
  }
  throw Error('Only an admin can delete a recipe.')
}

export const likeRecipeService = async (data: { recipeId: string; }, user: JWTUser) => {
  const existingRecipe = await queryRecipes({ _id: data.recipeId });
  if (existingRecipe.length < 1) {
    throw Error('Recipe does not exist.');
  }
  const alreadyLiked = await getRecipeLikedRecord({ recipeId: data.recipeId, userId: user._id });
  if (alreadyLiked) {
    return true;
  }
  await likeRecipe({ recipeId: data.recipeId, userId: user._id });
  await updateRecipe({
    _id: data.recipeId,
    likes: existingRecipe[0].likes + 1
  })
  return true;
}
export const unLikedRecipeService = async (data: { recipeId: string; }, user: JWTUser) => {
  const existingRecipe = await queryRecipes({ _id: data.recipeId });
  if (existingRecipe.length < 1) {
    throw Error('Recipe does not exist.');
  }
  const recipeIsLiked = await getRecipeLikedRecord({ recipeId: data.recipeId, userId: user._id });
  if (!recipeIsLiked) {
    return true;
  }
  await unLikedRecipe(recipeIsLiked._id);
  await updateRecipe({
    _id: data.recipeId,
    likes: existingRecipe[0].likes - 1
  });
  return true;
}