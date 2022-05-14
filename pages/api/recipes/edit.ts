import { mongoDbConnection } from "@src/db/connection";
import { RecipeModel } from "@src/db/recipes";
import { Roles, UserJwt } from "@src/types/index.d";
import { verifyJwt } from "@src/utils/jwt-helpers";
import { editRecipeSchema } from "@src/validation/recipes";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
  try {
    if (req.method !== "PUT") {
      return res.status(404).send("Not Found");
    }

    // validate logged in user is an ADMIN
    const accessToken = req.cookies[process.env.ACCESS_TOKEN_COOKIE_NAME!];
    if (!accessToken) {
      return res.status(401).send("Unauthorized.");
    }
    const user = await verifyJwt<UserJwt>(accessToken).catch((err) => {
      console.log("Unable to verify Access Token JWT.");
      console.log(err);
    });
    if (!user || user.roles.indexOf(Roles.Admin) < 0) {
      return res.status(401).send("Unauthorized.");
    }

    // validate incoming req.body
    const validationResult = editRecipeSchema.validate(req.body);
    if (validationResult.error) {
      return res.status(400).send(validationResult.error.message);
    }

    // connect to db
    await mongoDbConnection();

    // get recipe from db
    const recipe = await RecipeModel.findById(req.body._id);
    if (!recipe) {
      return res.status(404).send("Recipe not found.");
    }

    // update recipe
    recipe.url = req.body.url;
    recipe.title = req.body.title;
    recipe.image = req.body.image;
    recipe.deleted = req.body.deleted;
    recipe.siteName = req.body.siteName;
    recipe.description = req.body.description;
    recipe.updatedAt = new Date();

    await recipe.save();

    return res.json({ success: true });
  } catch (err) {
    let msg = `An unknown error occurred.`;
    if (err instanceof Error) {
      msg = err.message;
    } else {
      if (typeof err === "string") {
        msg = err;
      }
    }
    res.status(500).send(msg);
  }
};

export default handler;
