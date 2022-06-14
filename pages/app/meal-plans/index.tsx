import { Typography } from '@mui/material';
import { MealPlan } from '@src/types/index.d';
import {} from '@src/db/meal-plans';

const MOCK_PLAN: MealPlan = {
  createdAt: new Date(),
  updatedAt: new Date(),
  members: [],
  owner: '123',
  recipes: [],
  title: 'My First Mealplan',
};
const recipes = [MOCK_PLAN, MOCK_PLAN, MOCK_PLAN];

export default function MealPlansPage() {
  return (
    <>
      <Typography variant="h5" component="h1">
        Meal Plans
      </Typography>
      <Typography sx={{ maxWidth: 'md' }}>
        A Mealplan is a small collection of the recipes to help you plan what
        meals you want to cook in the near future. Use this page to create and
        manage all your Mealplans!
      </Typography>
    </>
  );
}
