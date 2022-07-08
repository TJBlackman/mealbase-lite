import { Divider, List, Toolbar, Typography } from '@mui/material';
import { GetServerSideProps } from 'next';
import { MealPlansModel } from '@src/db/meal-plans';
import { MealPlanDocument } from '@src/types';
import { RecipeListItem } from '@src/components/meal-plans/recipe-list-item';

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const props: Record<string, any> = { mealplan: null };
    if (context.params && context.params.id) {
      const mealplan = await MealPlansModel.findById(context.params.id)
        .populate({
          path: 'recipes',
          populate: 'recipe',
        })
        .lean()
        .catch((err) => {
          console.log(err);
        });
      if (mealplan) {
        props.mealplan = JSON.parse(JSON.stringify(mealplan));
      }
    }

    return { props };
  } catch (error) {
    let msg = 'An unknown error occurred.';
    if (error instanceof Error) {
      msg = error.message;
    }
    return {
      props: {
        error: msg,
      },
    };
  }
};

type Props = {
  mealplan?: MealPlanDocument;
  error?: string;
};

export default function MealPlanDetailsPage(props: Props) {
  return (
    <>
      <Typography variant="h5" component="h1" paragraph color="primary">
        {props.mealplan?.title || 'Meal Plan Details'}
      </Typography>

      {!props.mealplan && (
        <Typography color="error">Error: Meal plan not found.</Typography>
      )}

      {props.mealplan && (
        <>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Typography>Recipes ({props.mealplan?.recipes.length})</Typography>
            <Typography>Cooked</Typography>
          </Toolbar>
          <Divider />
          <List>
            {props.mealplan.recipes.map((item) => (
              <RecipeListItem
                recipe={item.recipe}
                isCooked={item.isCooked}
                mealplanId={props.mealplan!._id}
              />
            ))}
          </List>
        </>
      )}
    </>
  );
}
