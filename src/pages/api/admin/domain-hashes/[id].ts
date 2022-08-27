import { getUserJWT } from "@src/validation/server-requests";
import { DomainHashSelectorsModel } from "@src/db/domain-hash-selectors";
import { mongoDbConnection } from "@src/db/connection";
import { NextApiHandler } from "next";
import { Roles } from "@src/db/users";
import { editDomainHashSchema } from "@src/validation/schemas/domain-hashes";

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
        const hash = await DomainHashSelectorsModel.findById(
          req.query.id
        ).lean();
        return res.json(JSON.parse(JSON.stringify(hash)));
      }
      case "PUT": {
        // validate incoming req.body
        const validationResult = editDomainHashSchema.validate(req.body);
        if (validationResult.error) {
          return res.status(400).send(validationResult.error.message);
        }
        const record = await DomainHashSelectorsModel.findById(req.query.id);

        if (!record) {
          return res.status(404).send("Domain hash record not found.");
        }

        record.domain = req.body.domain;
        record.selector = req.body.selector;
        record.isDynamic = req.body.isDynamic;
        await record.save();

        return res.status(200).json(req.body);
      }
      default: {
        return res
          .status(400)
          .send(
            `Unknown request type. Expected GET or PUT, but received: ${req.method}`
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

export default handler;
