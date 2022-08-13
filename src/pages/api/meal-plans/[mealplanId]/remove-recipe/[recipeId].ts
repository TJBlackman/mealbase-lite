import { MealPlanPermissions } from '@src/db/meal-plans';
import { getUserJWT } from '@src/validation/server-requests';
import { NextApiHandler } from 'next';
import { MealPlansModel } from '@src/db/meal-plans';
import { UserModel } from '@src/db/users';
import { mongoDbConnection } from '@src/db/connection';
import Joi from 'joi';
import { isObjectIdOrHexString, ObjectId } from 'mongoose';
import { InvitationModel } from '@src/db/invites';

// validates the URL params for this route
export const validationSchema = Joi.object({
  mealplanId: Joi.string()
    .custom((value) => {
      const isValid = isObjectIdOrHexString(value);
      if (!isValid) {
        throw Error('Not a valid objectId.');
      }
    }, 'Not a valid objectId.')
    .required(),
  recipeId: Joi.string()
    .custom((value) => {
      const isValid = isObjectIdOrHexString(value);
      if (!isValid) {
        throw Error('Not a valid objectId.');
      }
    }, 'Not a valid objectId.')
    .required(),
});

/**
 * Add an email address to a mealplan as a member, permissions can be added later.
 * If the email address is registered with mealbase, add that user.
 * If the email address is NOT registered with mealbase, create an invite record and add that user.
 */
const handler: NextApiHandler = async (req, res) => {
  try {
    // use DELETE method
    if (req.method !== 'DELETE') {
      return res.status(404).send('Not Found');
    }

    // required user to be logged in
    const user = await getUserJWT(req.cookies);
    if (!user) {
      return res.status(401).send('Unauthorized');
    }

    // validate URL params
    const validationResult = validationSchema.validate(req.query);
    if (validationResult.error) {
      return res
        .status(400)
        .send(
          (validationResult.error as Error)?.message ||
            'A validation error occurred.'
        );
    }

    // connect to db
    await mongoDbConnection();

    // find mealplan
    const mealplan = await MealPlansModel.findById<MealPlan>(
      req.query.mealplanId
    );

    if (!mealplan) {
      return res.status(404).send('Meal plan not found.');
    }

    // check if requesting user is meal plan owner
    // OR, if they're a member with permission to edit members
    const hasPermissionToEditRecipes = (() => {
      const isMealplanOwner = user._id === mealplan.owner.toString();
      if (isMealplanOwner) {
        return true;
      }
      const isMemberWithPermissionToEditMembers = (() => {
        const member = mealplan.members.find(
          (m) => m.member._id.toString() === user._id
        );
        if (!member) {
          return false;
        }
        return member.permissions.includes(MealPlanPermissions.EditRecipes);
      })();
      return isMemberWithPermissionToEditMembers;
    })();

    // if not owner or member with permission, then you are forbidden!
    if (!hasPermissionToEditRecipes) {
      return res.status(403).send('Forbidden.');
    }

    // remove the member or invite
    const result = await MealPlansModel.findByIdAndUpdate(
      req.query.mealplanId,
      {
        $pull: {
          recipes: {
            recipe: req.query.recipeId,
          },
        },
      },
      {
        new: true,
      }
    )
      .populate({
        path: 'members.member',
        select: { email: 1 },
        model: UserModel,
      })
      .populate({
        path: 'invites.invitee',
        select: { email: 1 },
        model: InvitationModel,
      })
      .lean();

    return res.status(200).send(JSON.parse(JSON.stringify(result)));
  } catch (err) {
    console.log(err);
    let msg = 'An unknown error occurred.';
    if (err instanceof Error) {
      msg = err.message;
    }
    return res.status(500).send(msg);
  }
};

export default handler;

// data queried in this API
interface MealPlan {
  _id: ObjectId;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  recipes: {
    recipe: string;
    isCooked: boolean;
  }[];
  members: {
    member: {
      _id: ObjectId;
      email: string;
    };
    permissions: MealPlanPermissions[];
  }[];
  invites: {
    email: string;
    _id: ObjectId;
  }[];
  owner: ObjectId;
}
