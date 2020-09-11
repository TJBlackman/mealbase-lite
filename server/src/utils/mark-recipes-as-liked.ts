import { RecipeRecord, IRecipeLikeRecord } from "../types/type-definitions";

// Take in an array of recipes AND array of likes
// check every recipe to see if it has been liked, and mark as such

export const markRecipesAsLiked = (recipes: RecipeRecord[], likes: IRecipeLikeRecord[]): RecipeRecord[] => {
  let i = 0;
  const imax = recipes.length;
  for (; i < imax; ++i) {
    const recipe = recipes[i];
    let j = 0;
    const jmax = likes.length;
    for (; j < jmax; ++j) {
      const like = likes[j];
      if (recipe._id.toString() === like.recipeId.toString()) {
        recipe.isLiked = true;
        break;
      }
    }
  }
  return recipes;
}