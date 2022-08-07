import { getUserJWT } from "@src/validation/server-requests";
import { NextApiHandler } from "next";
import { MealPlansModel } from "@src/db/meal-plans";
import { UserModel } from "@src/db/users";
import { RecipeModel } from "@src/db/recipes";
import { mongoDbConnection } from "@src/db/connection";
import { isObjectIdOrHexString } from "mongoose";
import { InvitationModel } from "@src/db/invites";

/**
 * Get all the recipes a users has.
 */
const handler: NextApiHandler = async (req, res) => {
  try {
    // use GET method
    if (req.method !== "GET") {
      return res.status(404).send("Not Found");
    }

    // required user to be logged in admin
    // const user = await getUserJWT(req.cookies);
    // if (!user) {
    //   return res.status(401).send('Unauthorized');
    // }

    // validate mealplan id
    const isObjectId = isObjectIdOrHexString(req.query.id);
    if (!isObjectId) {
      return res.status(400).send("Meal plan ID is invalid.");
    }

    // connect to db
    await mongoDbConnection();

    // get all this users mealplans, reverse chronologically
    const mealplans = await MealPlansModel.findById(req.query.id)
      .populate({
        path: "owner",
        select: { email: 1 },
      })
      .populate({
        path: "recipes.recipe",
        model: RecipeModel,
      })
      .populate({
        path: "members.member",
        select: { email: 1 },
        model: UserModel,
      })
      .populate({
        path: "invites",
        model: InvitationModel,
      });

    return res.json(JSON.parse(JSON.stringify(mealplans)));
  } catch (err) {
    console.log(err);
    let msg = "An unknown error occurred.";
    if (err instanceof Error) {
      msg = err.message;
    }
    return res.status(500).send(msg);
  }
};

export default handler;
