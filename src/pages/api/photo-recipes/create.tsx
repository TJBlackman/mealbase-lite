import { getUserJWT } from "@src/validation/server-requests";
import { PhotoRecipeModel } from "@src/db/photo-recipes";
import { UserModel } from "@src/db/users";
import { InvitationModel } from "@src/db/invites";
import { mongoDbConnection } from "@src/db/connection";
import Joi from "joi";

/**
 * Post a new photo recipe
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
  isPrivate: Joi.boolean().optional(),
  sharedWithEmails: Joi.array()
    .items(Joi.string().email({ tlds: { allow: false } }))
    .optional(),
});

export default async function (req, res) {
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

    // create new photo recipe
    const newPhotoRecipe = new PhotoRecipeModel({
      title: req.body.title,
      description: req.body.description,
      owner: user._id,
      images: req.body.images,
      isPrivate: req.body.isPrivate,
    });

    if (req.body.sharedWithEmails?.length) {
      // for each invited users, get account, add to this recipe
      let i = 0;
      let iMax = req.body.sharedWithEmails.length;
      for (; i < iMax; ++i) {
        const email = req.body.sharedWithEmails[i];

        // check if is existing user account
        const existingAccount = await UserModel.findOne({ email });
        if (existingAccount) {
          // @ts-ignore
          newPhotoRecipe.members.push(existingAccount._id);
          continue;
        }

        // check if is existing invitee account
        const existingInvite = await InvitationModel.findOne({ email });
        if (existingInvite) {
          // @ts-ignore
          newPhotoRecipe.invitees.push(existingInvite._id);
          continue;
        }

        // create new invitee account
        const newInvitee = new InvitationModel({
          email,
        });
        await newInvitee.save();
        // @ts-ignore
        newPhotoRecipe.invitees.push(newInvitee._id);
      }
    }

    // save photo recipe
    await newPhotoRecipe.save();

    // convert from mongoose document to plain object
    const photoRecipe = newPhotoRecipe.toObject();

    // send response of newly created document
    res.json(JSON.parse(JSON.stringify(photoRecipe)));
  } catch (err) {
    // console.log(err);
    let msg = "An unknown error occurred.";
    if (err instanceof Error) {
      msg = err.message;
    }
    return res.status(500).send(msg);
  }
}
