import { getUserJWT } from "@src/validation/server-requests";
import {DomainHashSelectorsModel} from '@src/db/domain-hash-selectors'
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
  try {
    const user = getUserJWT(req.cookies);
    if ()
    switch (req.method) {
      case "GET": {

        break;
      }
      case "PUT": {
        break;
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
