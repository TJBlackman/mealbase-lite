import { MealPlanPermissions } from "@src/db/meal-plans";
import { getUserJWT } from "@src/validation/server-requests";
import { NextApiHandler } from "next";
import { MealPlansModel } from "@src/db/meal-plans";
import { mongoDbConnection } from "@src/db/connection";
import Joi from "joi";
import { isObjectIdOrHexString, ObjectId } from "mongoose";

// validates the URL params for this route
export const queryValidationSchema = Joi.object({
  id: Joi.string()
    .custom((value) => {
      const isValid = isObjectIdOrHexString(value);
      if (!isValid) {
        throw Error("Not a valid objectId.");
      }
    }, "Not a valid objectId.")
    .required(),
  memberId: Joi.string()
    .custom((value) => {
      const isValid = isObjectIdOrHexString(value);
      if (!isValid) {
        throw Error("Not a valid objectId.");
      }
    }, "Not a valid objectId.")
    .required(),
});

// validate request body
export const bodyValidationSchema = Joi.object({
  permissions: Joi.array().items(
    Joi.string().valid(...Object.values(MealPlanPermissions))
  ),
});

/**
 * Add an email address to a mealplan as a member, permissions can be added later.
 * If the email address is registered with mealbase, add that user.
 * If the email address is NOT registered with mealbase, create an invite record and add that user.
 */
const handler: NextApiHandler = async (req, res) => {
  try {
    // use PUT method
    if (req.method !== "PUT") {
      return res.status(404).send("Not Found");
    }

    // require user to be logged in
    const user = await getUserJWT(req.cookies);
    if (!user) {
      return res.status(401).send("Unauthorized");
    }

    // validate URL params
    const queryValidationResult = queryValidationSchema.validate(req.query);
    if (queryValidationResult.error) {
      return res
        .status(400)
        .send(
          (queryValidationResult.error as Error)?.message ||
            "A query validation error occurred."
        );
    }

    // validate request body
    const bodyValidationResult = bodyValidationSchema.validate(req.body);
    if (bodyValidationResult.error) {
      return res
        .status(400)
        .send(
          (bodyValidationResult.error as Error)?.message ||
            "A request body validation error occurred."
        );
    }

    // connect to db
    await mongoDbConnection();

    // find mealplan
    const mealplan = await MealPlansModel.findById<MealPlan>(req.query.id);

    if (!mealplan) {
      return res.status(404).send("Meal plan not found.");
    }

    const hasMember = Boolean(
      mealplan.members.find((m) => m.member.toString() === req.query.memberId)
    );
    const hasInvitee = Boolean(
      mealplan.invites.find((i) => i.invitee.toString() === req.query.memberId)
    );

    if (!hasMember && !hasInvitee) {
      return res.status(404).send("Member not found.");
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
          (m) => m.member.toString() === user._id
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
      return res.status(403).send("Forbidden.");
    }

    // edit member permissions
    if (hasMember) {
      const memberResult = await MealPlansModel.updateOne(
        { _id: req.query.id, "members.member": req.query.memberId },
        {
          $set: {
            "members.$.permissions": req.body.permissions,
          },
        }
      );
    }

    // edit invite permissions
    if (hasInvitee) {
      const inviteResult = await MealPlansModel.updateOne(
        { _id: req.query.id, "invites.invitee": req.query.memberId },
        {
          $set: {
            "invites.$.permissions": req.body.permissions,
          },
        }
      );
    }

    return res.status(200).send({});
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

// data queried in this API
interface MealPlan {
  _id: ObjectId;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  recipes: {
    recipe: ObjectId;
    isCooked: boolean;
  }[];
  members: {
    member: ObjectId;
    permissions: MealPlanPermissions[];
  }[];
  invites: {
    invitee: ObjectId;
    permissions: MealPlanPermissions[];
  }[];
  owner: ObjectId;
}
