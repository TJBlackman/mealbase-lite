import { NextApiHandler } from "next";
import { getUserJWT } from "@src/validation/server-requests";
import { Roles } from "@src/types/index.d";
import { FailedRecipeModel } from "@src/db/failed-recipes";
import { mongoDbConnection } from "@src/db/connection";
import { editFailedRecipesSchema } from "@src/validation/schemas/failed-recipes";

const handler: NextApiHandler = async (req, res) => {
  try {
    // required user to be logged in admin
    const user = await getUserJWT(req.cookies);
    if (!user || user.roles.indexOf(Roles.Admin) < 0) {
      return res.status(401).send("Unauthorized");
    }

    // connect to db
    await mongoDbConnection();

    switch (req.method) {
      case "GET": {
        const record = await FailedRecipeModel.findById(req.query.id).lean();
        if (!record) {
          return res.status(404).send("Not Found.");
        }
        return res.json(JSON.parse(JSON.stringify(record)));
      }
      case "PUT": {
        const validationResult = editFailedRecipesSchema.validate(req.body);
        if (validationResult.error) {
          return res.status(400).send(validationResult.error.message);
        }

        const record = await FailedRecipeModel.findById(req.query.id);
        if (!record) {
          return res.status(404).send("Not Found.");
        }
        record.resolved = req.body.resolved;
        await record.save();
        return res.send("ok");
      }
      case "DELETE": {
        await FailedRecipeModel.findByIdAndDelete(req.query.id);
        res.send("ok");
      }
      default: {
        return res
          .status(400)
          .send(
            `Unknown request type. Expected GET,  PUT or DELETE, but received: ${req.method}`
          );
      }
    }
  } catch (err) {
    console.log(err);
    let msg = "An unknown error occurred.";
    if (err instanceof Error) {
      msg = err.message;
    }
    return res.status(500).send(msg);
  }
};
