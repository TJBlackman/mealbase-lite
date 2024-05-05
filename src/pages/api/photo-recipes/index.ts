import { getUserJWT } from "@src/validation/server-requests";
import { PhotoRecipeModel } from "@src/db/photo-recipes";
import { UserModel } from "@src/db/users";
import { mongoDbConnection } from "@src/db/connection";

export default async function (req, res) {
  try {
    // require POST request
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

    // find users photo recipes, or photo recipes they're a member of
    const photoRecipes = await PhotoRecipeModel.find({
      $or: [{ owner: user._id }, { members: user._id }],
    })
      .populate({
        path: "owner",
        select: "email",
        model: UserModel,
      })
      .populate({
        path: "members",
        select: "email",
        model: UserModel,
      })
      .lean();

    // send response of newly created document
    res.json(JSON.parse(JSON.stringify(photoRecipes)));
  } catch (err) {
    // console.log(err);
    let msg = "An unknown error occurred.";
    if (err instanceof Error) {
      msg = err.message;
    }
    return res.status(500).send(msg);
  }
}
