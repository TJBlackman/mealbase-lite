import {
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  TableContainer,
} from '@mui/material';
import { GetServerSideProps } from 'next';
import { MealPlansModel } from '@src/db/meal-plans';
import { MealPlanDocument } from '@src/types';
import { RecipeTableRow } from '@src/components/meal-plans/recipe-table-row';
import { useRefreshServerSideProps } from '@src/hooks/refresh-serverside-props';

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
        // sort recipes so uncooked recipes are first
        mealplan.recipes.sort((item) => (item.isCooked ? 1 : -1));
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
  const refreshSSPHook = useRefreshServerSideProps({ data: props.mealplan });
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
          <Divider />
          <TableContainer sx={{ maxWidth: '100vw', overflow: 'scroll' }}>
            <Table sx={{ minWidth: '500px' }}>
              <TableHead>
                <TableCell>Recipes</TableCell>
                <TableCell>Cooked</TableCell>
                <TableCell>Delete</TableCell>
              </TableHead>
              <TableBody>
                {props.mealplan.recipes.map((item) => (
                  <RecipeTableRow
                    recipe={item.recipe}
                    isCooked={item.isCooked}
                    mealplanId={props.mealplan!._id}
                    refreshSSP={refreshSSPHook.refreshSSP}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </>
  );
}
