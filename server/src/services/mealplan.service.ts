import { queryMealPlans, saveNewMealPlan, updateMealPlan } from '../DAL/mealplan.dal';
import { MealPlanQuery, MealPlanRecord, JWTUser, Roles } from '../types/type-definitions';
import { userHasRole } from '../utils/validators';

export const getMealPlans = async (query: MealPlanQuery, user: JWTUser) => {
  if (userHasRole([Roles.Admin, Roles.Support], user)) {
    const _mealplans = await queryMealPlans(query);
    return _mealplans;
  }
  // revoke ability to search by deleted
  delete query.deleted;

  const mealplans = await queryMealPlans({
    ...query,
    owner: user._id
  });
  return mealplans;
}

export const createNewMealPlan = async (data: MealPlanRecord, user: JWTUser) => {
  if (userHasRole([Roles.Admin, Roles.Support], user)) {
    const _mealplan = await saveNewMealPlan(data);
    return _mealplan;
  }

  const mealplan = await saveNewMealPlan({
    ...data,
    owner: user._id
  });
  return mealplan;
}

export const editMealPlans = async (data: MealPlanRecord, user: JWTUser) => {
  if (!data._id) {
    throw Error('Mealplan id is required.');
  }

  if (userHasRole([Roles.Admin, Roles.Support], user)) {
    const _mealplan = await updateMealPlan(data);
    return _mealplan;
  }

  const mp = await queryMealPlans({ _id: data._id });
  if (mp.length < 1) {
    throw Error('No recipe with _id: ' + data._id);
  }

  if (mp[0].owner.toString() !== user._id) {
    throw Error('You do not have permission to edit this mealplan.');
  }
  const mealplan = await updateMealPlan(data);
  return mealplan;
}

export const deleteMealPlans = async (data: MealPlanRecord, user: JWTUser) => {
  if (!data._id) {
    throw Error('Cookbook id is required.');
  }

  if (userHasRole([Roles.Admin, Roles.Support], user)) {
    const _mealplan = await updateMealPlan({
      ...data,
      deleted: true
    });
    return _mealplan;
  }

  const cb = await queryMealPlans({ _id: data._id });
  if (cb.length < 1) {
    throw Error('No recipe with _id: ' + data._id);
  }
  if (cb[0].owner.toString() !== user._id) {
    throw Error('You do not have permission to delete this cookbook.');
  }
  const mealplan = await updateMealPlan({
    _id: data._id,
    deleted: true
  });
  return mealplan;
}