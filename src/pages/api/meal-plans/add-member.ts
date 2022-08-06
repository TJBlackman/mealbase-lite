import { MealPlan, With_Id } from "@src/types";
import { getUserJWT } from "@src/validation/server-requests";
import { NextApiHandler } from "next";
import { MealPlansModel } from "@src/db/meal-plans";
import { UserModel } from "@src/db/users";
import { mongoDbConnection } from "@src/db/connection";
import { inviteUserToMealPlan } from "@src/validation/schemas/meal-plans/invite-user";

/**
 * Count the number of meal plans the currently logged in user has created
 */
const handler: NextApiHandler = async (req, res) => {
  try {
    // use GET method
    if (req.method !== "POST") {
      return res.status(404).send("Not Found");
    }

    // required user to be logged in
    const user = await getUserJWT(req.cookies);
    if (!user) {
      return res.status(401).send("Unauthorized");
    }

    // validate request body
    const validationResult = inviteUserToMealPlan.validate(req.body);
    if (validationResult.error) {
      return res.status(400).send(validationResult.error.message);
    }

    // connect to db
    await mongoDbConnection();

    // find mealplan
    const mealplan = await MealPlansModel.findById(
      req.body.mealplanId
    ).populate({
      path: "members",
      select,
    });

    console.log(mealplan);

    // if (!mealplan) {
    //   return res.status(404).send("Meal plan not found.");
    // }

    // // find member
    // const member = mealplan.members.find((m) => m.email === req.body.email);

    // // if member does already exist
    // // add them to mealplan
    // if (member) {
    //   member.permission = req.body.permissions;
    // }

    // // if member does not already
    // if (!member) {
    //   mealplan.members.push(req.body);
    // }

    // await mealplan.save({});

    return res.json({ data: 1 });
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

type QueryResponse = With_Id<
  Omit<MealPlan, "members" | "pendingMembers"> & {
    members: {
      member: With_Id<{}>;
    }[];
  }
>;
