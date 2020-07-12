import { RecipeRecord } from "../types/type-definitions";


// This function removes site name from the title of the recipe
// ie: "Best Vegetable Lasagna Recipe - Cookie and Kate" becomes "Best Vegetable Lasagna Recipe"

export const cleanRecipeTitle = (data: RecipeRecord) => {
  switch (data.siteName) {
    case 'Cookie and Kate': {
      data.title = data.title.replace(' - Cookie and Kate', '');
      break;
    }
    default: {
      // dont do anything
    }
  }
}
