import { getRecipeData } from '../services/puppeteer.service';
import { saveRecipeDAL } from '../DAL/recipe.dal';
import { RecipeRecord } from '../types/type-definitions';
import { cleanRecipeTitle } from '../utils/clean-recipe-title';

const urls: string[] = [
  'https://cookieandkate.com/best-vegetable-lasagna-recipe/',
  'https://cookieandkate.com/lemony-kale-pasta-recipe/',
  'https://cookieandkate.com/quinoa-vegetable-soup-recipe/',
  'https://www.allrecipes.com/recipe/151915/roast-beef-horseradish-roll-ups/?internalSource=staff%20pick&referringId=1031&referringContentType=Recipe%20Hub',
  'https://www.allrecipes.com/recipe/8665/braised-balsamic-chicken/?internalSource=hub%20recipe&referringId=201&referringContentType=Recipe%20Hub&clickId=cardslot%2019',
  'https://www.foodnetwork.com/recipes/spicy-3-bean-chili-salad-3415883',
  'https://www.foodnetwork.com/recipes/food-network-kitchen/healthy-blt-pasta-skillet-recipe-2109459'
];

export const seedRecipes = async () => {
  let i = 0;
  const imax = urls.length;
  for (; i < imax; ++i) {
    try {
      const url = urls[i];
      const pptrData = await getRecipeData(url);
      if (!pptrData) {
        throw Error('Recipe could not be retreived.');
      }
      const data = pptrData as RecipeRecord;
      cleanRecipeTitle(data);
      const recipe = await saveRecipeDAL(data);
      console.log(`Added recipe #${i + 1}: ${recipe.url}`);
    }
    catch (err) {
      console.log(err);
    }
  }
}