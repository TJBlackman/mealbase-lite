import { MealPlanPermissions } from '@src/db/meal-plans';
import { getUserJWT } from '@src/validation/server-requests';
import { NextApiHandler } from 'next';
import { MealPlansModel } from '@src/db/meal-plans';
import { UserModel } from '@src/db/users';
import { mongoDbConnection } from '@src/db/connection';
import Joi from 'joi';
import { isObjectIdOrHexString, ObjectId } from 'mongoose';
import { InvitationModel } from '@src/db/invites';

// validation
export const validationSchema = Joi.object({
  email: Joi.string().email().required(),
});

/**
 * Add an email address to a mealplan as a member, permissions can be added later.
 * If the email address is registered with mealbase, add that user.
 * If the email address is NOT registered with mealbase, create an invite record and add that user.
 */
const handler: NextApiHandler = async (req, res) => {
  try {
    // use GET method
    if (req.method !== 'POST') {
      return res.status(404).send('Not Found');
    }

    // required user to be logged in
    const user = await getUserJWT(req.cookies);
    if (!user) {
      return res.status(401).send('Unauthorized');
    }

    // validate request body
    const validationResult = validationSchema.validate(req.body);
    if (validationResult.error) {
      return res.status(400).send(validationResult.error.message);
    }

    // validate mealplan id
    const isObjectId = isObjectIdOrHexString(req.query.mealplanId);
    if (!isObjectId) {
      return res.status(400).send('Meal plan ID is invalid.');
    }

    // connect to db
    await mongoDbConnection();

    // find mealplan
    const mealplan = await MealPlansModel.findById<MealPlan>(
      req.query.mealplanId
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
      });

    if (!mealplan) {
      return res.status(404).send('Meal plan not found.');
    }

    // check if requesting user is meal plan owner
    // OR, if they're a member with permission to edit members
    const hasPermissionToInviteMembers = (() => {
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
        return member.permissions.includes(MealPlanPermissions.EditMembers);
      })();
      return isMemberWithPermissionToEditMembers;
    })();

    // if not owner or member with permission, then you are forbidden!
    if (!hasPermissionToInviteMembers) {
      return res.status(403).send('Forbidden.');
    }

    // if requested member is already a member, return error
    const existingMember = mealplan.members.find(
      (item) => item.member.email === req.body.email
    );
    if (existingMember) {
      return res
        .status(409)
        .send('Email address is already a member of this meal plan.');
    }

    // if requested member is already a pending invite, return error
    const existingInvite = mealplan.invites.find(
      (item) => item.email === req.body.email
    );
    if (existingInvite) {
      return res
        .status(409)
        .send('Email address is already a pending invite of this meal plan.');
    }

    // if requested member is already a user of mealbase, use their _id
    const existingUser = await UserModel.findOne({ email: req.body.email });
    if (existingUser) {
      const result = await MealPlansModel.findByIdAndUpdate(
        mealplan._id,
        {
          $push: {
            members: {
              member: existingUser._id,
              permissions: [],
            },
          },
        },
        {
          new: true,
        }
      );
      return res.status(200).send(JSON.parse(JSON.stringify(result)));
    }

    // finally, if the requested member is unknown, create an invite record
    const inviteRecord = new InvitationModel({
      email: req.body.email,
    });
    await inviteRecord.save();

    // push invite record id into invites array of this mealplan
    const result = await MealPlansModel.findByIdAndUpdate(
      mealplan._id,
      {
        $push: {
          invites: {
            invitee: inviteRecord._id,
            permissions: [],
          },
        },
      },
      {
        new: true,
      }
    );
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
