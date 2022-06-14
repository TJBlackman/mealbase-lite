import { getUserJWT } from '@src/validation/server-requests';
import { NextApiHandler } from 'next';
import {} from '@src/db/mealplans';

/**
 * Allow a logged in user to create a new Mealplan
 */
const handler: NextApiHandler = async (req, res) => {
  try {
    // required user to be logged in admin
    const user = await getUserJWT(req.cookies);
    if (!user) {
      return res.status(401).send('Unauthorized');
    }
  } catch (err) {}
};

export default handler;
