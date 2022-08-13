import { MealPlanPermissions } from '@src/db/meal-plans';
import { getUserJWT } from '@src/validation/server-requests';
import { NextApiHandler } from 'next';
import { MealPlansModel } from '@src/db/meal-plans';
import { mongoDbConnection } from '@src/db/connection';
import Joi from 'joi';
import { isObjectIdOrHexString } from 'mongoose';

// validates the URL params for this route
export const validationSchema = Joi.object({
  mealplanId: Joi.string()
    .custom((value) => {
      const isValid = isObjectIdOrHexString(value);
      if (!isValid) {
        throw Error('Not a valid objectId.');
      }
    }, 'Not a valid objectId.')
    .required(),
  recipeId: Joi.string()
    .custom((value) => {
      const isValid = isObjectIdOrHexString(value);
      if (!isValid) {
        throw Error('Not a valid objectId.');
      }
    }, 'Not a valid objectId.')
    .required(),
});

/**
 * In a given mealplan, mark a specific recipe as "cooked"
 */
const handler: NextApiHandler = async (req, res) => {
  try {
    // use PUT method
    if (req.method !== 'PUT') {
      return res.status(404).send('Not Found');
    }

    // required user to be logged in
    const user = await getUserJWT(req.cookies);
    if (!user) {
      return res.status(401).send('Unauthorized');
    }

    // validate URL params
    const validationResult = validationSchema.validate(req.query);
    if (validationResult.error) {
      return res
        .status(400)
        .send(
          (validationResult.error as Error)?.message ||
            'A validation error occurred.'
        );
    }

    // connect to db
    await mongoDbConnection();

    // find mealplan
    const mealplan = await MealPlansModel.findById(req.query.mealplanId);
    if (!mealplan) {
      return res.status(404).send('Meal plan not found.');
    }

    // check if requesting user is meal plan owner
    // OR, if they're a member with permission to edit members
    const hasPermissionToEditRecipes = (() => {
      const isMealplanOwner = user._id === mealplan.owner.toString();
      if (isMealplanOwner) {
        return true;
      }
      const isMemberWithPermissionToEditMembers = (() => {
        const member = mealplan.members.find(
          (m) => m.member.toString() === user._id
        );
        if (!member) {
          return false;
        }
        return member.permissions.includes(MealPlanPermissions.EditRecipes);
      })();
      return isMemberWithPermissionToEditMembers;
    })();

    // if not owner or member with permission, then you are forbidden!
    if (!hasPermissionToEditRecipes) {
      return res.status(403).send('Forbidden.');
    }

    // mark recipe as "cooked" :D
    const recipe = mealplan.recipes.find(
      (r) => r.recipe.toString() === req.query.recipeId
    );
    if (!recipe) {
      return res.status(404).send('Recipe not found.');
    }
    recipe.isCooked = false;
    await mealplan.save();

    return res.status(200).send(JSON.parse(JSON.stringify(recipe)));
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
