import { getUserJWT } from '@src/validation/server-requests';
import { NextApiHandler } from 'next';
import { MealPlansModel } from '@src/db/meal-plans';
import { mongoDbConnection } from '@src/db/connection';
import { addRecipeToMealplanSchema } from '@src/validation/schemas/add-recipe-to-mealplan';

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
    const validationResult = addRecipeToMealplanSchema.validate(req.body);
    if (validationResult.error) {
      return res.status(400).send(validationResult.error.message);
    }

    // connect to db
    await mongoDbConnection();

    let savedMealplan: any;

    // if req.body.mealplanTitle is present, create new mealplan with recipe
    if (req.body.mealplanTitle) {
      const mealplan = new MealPlansModel({
        title: req.body.mealplanTitle,
        owner: user._id,
        recipes: [req.body.recipeId],
      });
      await mealplan.save();
      savedMealplan = mealplan.toObject();
    }

    // if req.body.mealplanId, add recipe to existing mealplan
    if (req.body.mealplanId) {
      const mealplan = await MealPlansModel.findById(req.body.mealplanId);
      if (!mealplan) {
        return res.status(404).send('Not Found');
      }
      mealplan.recipes.push(req.body.mealplanId);
      await mealplan.save();
      savedMealplan = mealplan.toObject();
    }

    return res.json(JSON.parse(JSON.stringify(savedMealplan)));
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
