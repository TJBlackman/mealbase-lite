import { getUserJWT } from '@src/validation/server-requests';
import { NextApiHandler } from 'next';
import { MealPlansModel } from '@src/db/meal-plans';
import { mongoDbConnection } from '@src/db/connection';
import Joi from 'joi';

/**
 * Post a new meal plan
 */
const postBodyValidation = Joi.object({
  title: Joi.string().required(),
});
const postMealplan: NextApiHandler = async (req, res) => {
  try {
    // require POST request
    if (req.method !== 'POST') {
      return res.status(404).send('Not Found');
    }

    // validate req.body
    const bodyValidationResult = postBodyValidation.validate(req.body);
    if (bodyValidationResult.error) {
      return res.status(400).send(bodyValidationResult.error.message);
    }

    // required user to be logged in admin
    const user = await getUserJWT(req.cookies);
    if (!user) {
      return res.status(401).send('Unauthorized');
    }

    // connect to db
    await mongoDbConnection();

    // create new mealplan
    const newMealPlan = new MealPlansModel({
      title: req.body.title,
      owner: user._id,
    });
    await newMealPlan.save();

    // convert from mongoose document to plain object
    const mealplan = newMealPlan.toObject();

    // send response of newly created document
    res.json(JSON.parse(JSON.stringify(mealplan)));
  } catch (err) {
    console.log(err);
    let msg = 'An unknown error occurred.';
    if (err instanceof Error) {
      msg = err.message;
    }
    return res.status(500).send(msg);
  }
};

/**
 * Get all the meal plans a users has.
 */
const getMealplans: NextApiHandler = async (req, res) => {
  try {
    // use GET method
    if (req.method !== 'GET') {
      return res.status(404).send('Not Found');
    }

    // required user to be logged in admin
    const user = await getUserJWT(req.cookies);
    if (!user) {
      return res.status(401).send('Unauthorized');
    }

    // connect to db
    await mongoDbConnection();

    // get all this users mealplans, reverse chronologically
    const mealplans = await MealPlansModel.find({ owner: user._id }).sort({
      createdAt: -1,
    });

    return res.json(JSON.parse(JSON.stringify(mealplans)));
  } catch (err) {
    console.log(err);
    let msg = 'An unknown error occurred.';
    if (err instanceof Error) {
      msg = err.message;
    }
    return res.status(500).send(msg);
  }
};

/**
 * The request handler will call either the POST or GET method
 */
export default async (req, res) => {
  if (req.method === 'GET') {
    return getMealplans(req, res);
  }
  if (req.method === 'POST') {
    return postMealplan(req, res);
  }
  return res.status(404).send('Not found.');
};
