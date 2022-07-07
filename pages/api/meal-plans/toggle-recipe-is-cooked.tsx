import { getUserJWT } from '@src/validation/server-requests';
import { NextApiHandler } from 'next';
import { MealPlansModel } from '@src/db/meal-plans';
import { mongoDbConnection } from '@src/db/connection';
import { toggleRecipeIsCooked } from '@src/validation/schemas/meal-plans/toggle-is-cooked';

/**
 * A user can add a recipe to an existing meal plan.
 * Alternatively, they can add the recipe to a new meal plan, which needs to be created here also.
 */

const handler: NextApiHandler = async (req, res) => {
  try {
    // require POST request
    if (req.method !== 'POST') {
      return res.status(404).send('Not Found');
    }

    // required user to be logged in
    const user = await getUserJWT(req.cookies);
    if (!user) {
      return res.status(401).send('Unauthorized');
    }

    // validate req.body
    const validationResult = toggleRecipeIsCooked.validate(req.body);
    if (validationResult.error) {
      return res.status(400).send(validationResult.error.message);
    }

    // connect to db
    await mongoDbConnection();

    // get mealplan from db
    const mealplan = await MealPlansModel.findOne({
      owner: user._id,
      _id: req.body.mealplanId,
    });
    if (!mealplan) {
      return res.status(404).send('Mealplan not found.');
    }

    // get recipe
    const recipe = mealplan.recipes.find((item) => {
      return item.recipe.toString() === req.body.recipeId;
    });
    if (!recipe) {
      return res.status(404).send('Recipe not found.');
    }

    // toggle isCooked status
    recipe.isCooked = !recipe.isCooked;

    await mealplan.save();

    const payload = JSON.parse(
      JSON.stringify({
        mealplan: mealplan.toObject(),
        isCooked: recipe.isCooked,
      })
    );
    return res.status(200).json(payload);
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
