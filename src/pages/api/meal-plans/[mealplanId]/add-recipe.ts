import Joi from 'joi';
import { NextApiHandler } from 'next';
import { isObjectIdOrHexString } from 'mongoose';
import { MealPlanPermissions, MealPlansModel } from '@src/db/meal-plans';
import { RecipeModel } from '@src/db/recipes';
import { mongoDbConnection } from '@src/db/connection';
import { getUserJWT } from '@src/validation/server-requests';

// validates the URL params for this route
export const queryValidationSchema = Joi.object({
  mealplanId: Joi.string()
    .custom((value) => {
      const isValid = isObjectIdOrHexString(value);
      if (!isValid) {
        throw Error('Not a valid objectId.');
      }
    }, 'Not a valid objectId.')
    .required(),
});

// validates the req.body for this route
export const bodyValidationSchema = Joi.object({
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
 * Add recipe to meal plan.
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

    // validate req.query for url params
    const validateUrlParamsResult = queryValidationSchema.validate(req.query);
    if (validateUrlParamsResult.error) {
      return res.status(400).send(validateUrlParamsResult.error.message);
    }

    // validate req.body for url params
    const bodyValidationResult = bodyValidationSchema.validate(req.query);
    if (bodyValidationResult.error) {
      return res.status(400).send(bodyValidationResult.error.message);
    }

    // connect to db
    await mongoDbConnection();

    // if req.body.mealplanId, add recipe to existing mealplan
    const mealplan = await MealPlansModel.findById(req.query.mealplanId);
    if (!mealplan) {
      return res.status(404).send('Meal plan not found.');
    }

    // check if requesting user is meal plan owner
    // OR, if they're a member with permission to edit recipes
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
    if (!hasPermissionToEditRecipes) {
      return res.status(403).send('Forbidden.');
    }

    // check the recipe exists
    const recipe = await RecipeModel.findById(req.body.recipeId);
    if (!recipe) {
      return res.status(404).send('Recipe not found.');
    }

    // add recipe to meal plan
    mealplan.recipes.push(req.body.recipeId);
    await mealplan.save();

    return res.json('ok');
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
