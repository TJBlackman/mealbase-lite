import { queryRecipes, saveNewRecipe, updateRecipe } from '../DAL/recipe.dal';
import { userHasRole } from '../utils/validators'
import { JWTUser, RecipeQuery, RecipeRecord } from '../types/type-definitions';
import { getRecipeData } from './puppeteer.service';

export const getRecipes = async (query: RecipeQuery, user: JWTUser) => {
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