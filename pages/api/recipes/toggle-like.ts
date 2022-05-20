import { mongoDbConnection } from '@src/db/connection';
import { UserJwt } from '@src/types';
import { verifyJwt } from '@src/utils/jwt-helpers';
import { toggleRecipeLikeSchema } from '@src/validation/schemas/recipes';
import type { NextApiHandler } from 'next';
import { RecipeLikesModel } from '@src/db/recipe-likes';
import { RecipeModel } from '@src/db/recipes';

const handler: NextApiHandler = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      return res.status(404).send('Not Found');
    }

    // validate logged in user
    const accessToken = req.cookies[process.env.ACCESS_TOKEN_COOKIE_NAME!];
    if (!accessToken) {
      return res.status(401).send('Unauthorized.');
    }
    const user = await verifyJwt<UserJwt>(accessToken).catch((err) => {
      console.log('Unable to verify Access Token JWT.');
      console.log(err);
    });
    if (!user) {
      return res.status(401).send('Unauthorized.');
    }

    // validate incoming req.body
    const validationResult = toggleRecipeLikeSchema.validate(req.body);
    if (validationResult.error) {
      return res.status(400).send(validationResult.error.message);
    }

    // connect to db
    await mongoDbConnection();

    // look for existing recipe like
    const likeRecord = await RecipeLikesModel.findOne({
      recipeId: req.body.recipeId,
      userId: user._id,
    });
    if (likeRecord) {
      await RecipeModel.findByIdAndUpdate(likeRecord.recipeId, {
        $inc: { likes: -1 },
      });
      await likeRecord.delete();
      return res.json({ status: 'unliked' });
    } else {
      const newRecord = new RecipeLikesModel({
        userId: user._id,
        recipeId: req.body.recipeId,
      });
      await newRecord.save();
      await RecipeModel.findByIdAndUpdate(newRecord.recipeId, {
        $inc: { likes: 1 },
      });
      return res.json({ status: 'liked' });
    }
  } catch (err) {
    let msg = `An unknown error occurred.`;
    if (err instanceof Error) {
      msg = err.message;
    } else {
      if (typeof err === 'string') {
        msg = err;
      }
    }
    res.status(500).send(msg);
  }
};

export default handler;
