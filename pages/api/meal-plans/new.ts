import { getUserJWT } from '@src/validation/server-requests';
import { NextApiHandler } from 'next';
import { MealPlansModel } from '@src/db/meal-plans';
import { mongoDbConnection } from '@src/db/connection';

/**
 * Allow a logged in user to create a new Mealplan
 */
const handler: NextApiHandler = async (req, res) => {
  try {
    // require POST request
    if (req.method !== 'POST') {
      return res.status(404).send('Not Found');
    }

    // validate req.body
    if (!req.body.title || typeof req.body.title !== 'string') {
      return res.status(400).send("Missing required property 'title'.");
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

export default handler;
