import { cleanUrl } from "@src/utils/clean-url";
import { mongoDbConnection } from "@src/db/connection";
import { UserJwt } from "@src/types";
import { verifyJwt } from "@src/utils/jwt-helpers";
import { addRecipeSchema } from "@src/validation/schemas/recipes";
import type { NextApiHandler } from "next";
import { RecipeModel } from "@src/db/recipes";
import { scrapeRecipeData } from "@src/utils/scrape-url";
import { FailedRecipeModel } from "@src/db/failed-recipes";
import { domainFromUrl } from "@src/utils/get-domain-from-url";
import { DomainHashSelectorsModel } from "@src/db/domain-hash-selectors";

const handler: NextApiHandler = async (req, res) => {
  try {
    if (req.method !== "POST") {
      return res.status(404).send("Not Found");
    }

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
    const validationResult = addRecipeSchema.validate(req.body);
    if (validationResult.error) {
      return res.status(400).send(validationResult.error.message);
    }

    // connect to db
    await mongoDbConnection();

    // clean url
    const _url = cleanUrl(req.body.url);

    // look for existing recipe
    const existingRecipe = await RecipeModel.findOne(
      { url: _url },
      {},
      { lean: true }
    );
    if (existingRecipe) {
      const { addedByUser, deleted, ...rest } = existingRecipe;
      return res.json(rest);
    }

    // scrape recipe
    let scrapedData: ScrapedRecipeDate;
    const domain = domainFromUrl(_url);
    const domainHash = await DomainHashSelectorsModel.findOne({
      domain,
    }).lean();
    try {
      scrapedData = await scrapeRecipeData(_url, domainHash);
    } catch (err) {
      console.log(err);
      const existingFailed = await FailedRecipeModel.findOne({
        url: req.body.url,
      });
      if (!existingFailed) {
        const failed = new FailedRecipeModel({
          addedByUser: user._id,
          url: req.body.url,
        });
        await failed.save();
      }

      // throw error
      let msg = `Unable to add this recipe. An administrator will review this error, and contact you if/when the recipe can be added.`;
      throw Error(msg);
    }

    // check for existing recipe again
    const existingRecipe2 = await RecipeModel.findOne({
      url: scrapedData.url,
    }).lean();
    if (existingRecipe2) {
      const { addedByUser, deleted, ...rest } = existingRecipe2;
      return res.json(rest);
    }

    // create new recipe
    const newRecipe = new RecipeModel({
      addedByUser: user._id,
      description: scrapedData.description,
      image: scrapedData.image,
      siteName: scrapedData.siteName,
      title: scrapedData.title.replace(/\s[\-\|]\s.+/, ""), // try to remove siteName from recipe title
      url: scrapedData.url,
      hash: scrapedData.hash,
    });
    await newRecipe.save();

    // remove some fields, return the rest
    const { addedByUser, deleted, ...rest } = newRecipe.toObject();

    return res.send(rest);
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

type ScrapedRecipeDate = {
  title: string;
  description: string;
  image: string;
  url: string;
  siteName: string;
  hash?: string | undefined;
};
