import { getUserJWT } from "@src/validation/server-requests";
import { NextApiHandler } from "next";
import { MealPlansModel } from "@src/db/meal-plans";
import { mongoDbConnection } from "@src/db/connection";

/**
 * Count the number of meal plans the currently logged in user has created
 */
const handler: NextApiHandler = async (req, res) => {
  try {
    // use GET method
    if (req.method !== "GET") {
      return res.status(404).send("Not Found");
    }

    // required user to be logged in admin
    const user = await getUserJWT(req.cookies);
    if (!user) {
      return res.status(401).send("Unauthorized");
    }

    // connect to db
    await mongoDbConnection();

    // count meal plans they have so far
    const count = await MealPlansModel.countDocuments({ owner: user._id });

    return res.json({ count });
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
