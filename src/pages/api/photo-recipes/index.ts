import { getUserJWT } from "@src/validation/server-requests";
import { NextApiHandler } from "next";
import { PhotoRecipeModel } from "@src/db/photo-recipes";
import { mongoDbConnection } from "@src/db/connection";
import Joi from "joi";

/**
 * Post a new meal plan
 */
const bodyValidation = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional(),
  images: Joi.array().items(
    Joi.object({
      public_id: Joi.string().required(),
      secure_url: Joi.string().uri().required(),
    }).unknown()
  ),
});

const postMealplan: NextApiHandler = async (req, res) => {
  try {
    // require POST request
    if (req.method !== "POST") {
      return res.status(404).send("Not Found");
    }

    // validate req.body
    const bodyValidationResult = bodyValidation.validate(req.body);
    if (bodyValidationResult.error) {
      return res.status(400).send(bodyValidationResult.error.message);
    }

    // required user to be logged in admin
    const user = await getUserJWT(req.cookies);
    if (!user) {
      return res.status(401).send("Unauthorized");
    }

    // connect to db
    await mongoDbConnection();

    // create new mealplan
    const newPhotoRecipe = new PhotoRecipeModel({
      title: req.body.title,
      description: req.body.description,
      owner: user._id,
      images: req.body.images,
    });
    await newPhotoRecipe.save();

    // convert from mongoose document to plain object
    const photoRecipe = newPhotoRecipe.toObject();

    // send response of newly created document
    res.json(JSON.parse(JSON.stringify(photoRecipe)));
  } catch (err) {
    console.log(err);
    let msg = "An unknown error occurred.";
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
  if (req.method === "POST") {
    return postMealplan(req, res);
  }
  return res.status(404).send("Not found.");
};
