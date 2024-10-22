import { cleanUrl } from "@src/utils/clean-url";
import { mongoDbConnection } from "@src/db/connection";
import { UserJwt } from "@src/types";
import { verifyJwt } from "@src/utils/jwt-helpers";
import { AddRecipeAsAdminSchema } from "@src/validation/schemas/recipes";
import type { NextApiHandler } from "next";
import { RecipeModel } from "@src/db/recipes";

/**
 * Controller for /api/admin/recipes
 */
const handler: NextApiHandler = async (req, res) => {
  try {
    switch (req.method) {
      case "POST": {
        return await post(req, res);
      }
      default:
        return res.status(404).send("Not Found");
    }
  } catch (err) {
    let msg = `An unknown error occurred.`;
    if (err instanceof Error) {
      msg = err.message;
    } else {
      if (typeof err === "string") {
        msg = err;
      }
    }
    return res.status(500).send(msg);
  }
};

export default handler;

/**
 * Post a new recipe manually
 */
const post: NextApiHandler = async function (req, res) {
  // validate logged in user
  const accessToken = req.cookies[process.env.ACCESS_TOKEN_COOKIE_NAME!];
  if (!accessToken) {
    return res.status(401).send("Unauthorized.");
  }
  const user = await verifyJwt<UserJwt>(accessToken).catch((err) => {
    console.log("Unable to verify Access Token JWT.");
    console.log(err);
  });
  if (!user) {
    return res.status(401).send("Unauthorized.");
  }

  // validate incoming req.body
  const validationResult = AddRecipeAsAdminSchema.validate(req.body);
  if (validationResult.error) {
    return res.status(400).send(validationResult.error.message);
  }

  // connect to db
  await mongoDbConnection();

  // clean recipe url
  const _url = cleanUrl(req.body.url);

  // look for existing recipe
  const existingRecipe = await RecipeModel.findOne(
    { url: _url },
    {},
    { lean: true }
  );
  if (existingRecipe) {
    const { addedByUser, deleted, ...rest } = existingRecipe;
    return res.status(400).send("Recipe already exists;" + existingRecipe._id);
  }

  // create new recipe
  const newRecipe = new RecipeModel({
    addedByUser: user._id,
    description: req.body.description,
    image: req.body.image,
    siteName: req.body.siteName,
    title: req.body.title.replace(/\s[\-\|]\s.+/, ""),
    url: req.body.url,
    hash: req.body.hash,
  });
  await newRecipe.save();

  // remove some fields, return the rest
  const { addedByUser, deleted, ...rest } = newRecipe.toObject();

  return res.send(rest);
};
