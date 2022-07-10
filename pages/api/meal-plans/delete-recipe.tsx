import { getUserJWT } from '@src/validation/server-requests';
import { NextApiHandler } from 'next';
import { MealPlansModel } from '@src/db/meal-plans';
import { mongoDbConnection } from '@src/db/connection';
import { deleteRecipeFromMealPlanSchema } from '@src/validation/schemas/meal-plans/delete-recipe';

/**
 * A user can add a recipe to an existing meal plan.
 * Alternatively, they can add the recipe to a new meal plan, which needs to be created here also.
 */

const handler: NextApiHandler = async (req, res) => {
  try {
    // require POST request
    if (req.method !== 'DELETE') {
      return res.status(404).send('Not Found');
    }

    // required user to be logged in
    const user = await getUserJWT(req.cookies);
    if (!user) {
      return res.status(401).send('Unauthorized');
    }

    // validate req.body
    const validationResult = deleteRecipeFromMealPlanSchema.validate(req.body);
    if (validationResult.error) {
      return res.status(400).send(validationResult.error.message);
    }

    // connect to db
    await mongoDbConnection();

    // get mealplan from db
    const mealplan = await MealPlansModel.findById(req.body.mealplanId);
    if (!mealplan) {
      return res.status(404).send('Not Found');
    }

    // filter out recipe
    mealplan.recipes = mealplan.recipes.filter((item) => {
      return item.recipe.toString() === req.body.recipeId;
    });

    // save mealplan
    await mealplan.save();

    return res.json({
      success: true,
      message: 'Recipe deleted from mealplan.',
    });
  } catch (err) {
    console.log(err);
    let msg = 'An unknown error occurred.';
    if (err instanceof Error) {
      msg = err.message;
    }
    return res.status(500).send(msg);
  }
};

export default handler;
