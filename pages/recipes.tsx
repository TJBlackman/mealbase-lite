import { Grid, Box, Typography } from '@mui/material';
import { RecipeCard } from '@src/components/recipe-card';
import { SearchAndPage } from '@src/components/search-and-pagination';
import { RecipeLikesModel } from '@src/db/recipe-likes';
import { RecipeModel } from '@src/db/recipes';
import { Recipe } from '@src/types';
import { getUserJWT } from '@src/validation/server-requests';
import { GetServerSidePropsContext } from 'next';
import { Pagination } from '@src/components/pagination';
import { mongoDbConnection } from '@src/db/connection';

/** get server side data and SSR page */
export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    // get userJWT, if user is logged in
    const user = await getUserJWT(context.req.cookies);

    // connect to db
    await mongoDbConnection();

    // array of liked recipe ids
    const likedRecipes: string[] = [];

    // if user is logged in
    // And, they are requesting their liked recipes, get them all
    if (user && context.query.likedRecipes) {
      const result = await RecipeLikesModel.find({ userId: user._id })
        .select('recipeId')
        .lean();

      result.forEach((r) => likedRecipes.push(r.recipeId.toString()));
    }

    // calculate limit, or use default
    const limit = (() => {
      let _limit = '25';
      const { limit } = context.query;
      if (limit) {
        if (Array.isArray(limit)) {
          _limit = limit[0];
        } else {
          _limit = limit;
        }
      }
      return Number(_limit);
    })();

    // calculate page (number recipes to skip)
    const skip = (() => {
      const { page } = context.query;
      const _page = page ? Number(page) : 1;
      const skipMultiplier = _page - 1;
      const skipNumber = limit * skipMultiplier;
      return skipNumber;
    })();

    // calculate filter
    const filter = (() => {
      const result: Record<string, any> = {
        deleted: false,
      };
      if (context.query.search) {
        result.title = { $regex: context.query.search, $options: 'i' };
      }
      if (context.query.likedRecipes) {
        result._id = { $in: likedRecipes };
      }
      return result;
    })();

    // get recipes from DB
    const recipes = await RecipeModel.find(filter)
      .select('-addedByUser -deleted -__v')
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 })
      .lean();

    // if user is logged,
    // mark recipe as "liked" by currently logged in user
    if (user) {
      const recipeIds = recipes.map((r) => r._id);
      const likedRecipes = await RecipeLikesModel.find({
        userId: user._id,
        recipeId: { $in: recipeIds },
      }).select('recipeId');

      likedRecipes.forEach((liked) => {
        const _likedRecipe = recipes.find(
          (recipe) => recipe._id.toString() === liked.recipeId.toString()
        );
        if (_likedRecipe) {
          // @ts-ignore
          _likedRecipe.isLiked = true;
        }
      });
    }

    // count total recipes that match this filter
    const totalCount = await RecipeModel.find(filter).countDocuments();

    return {
      props: {
        recipes: JSON.parse(JSON.stringify(recipes)),
        totalCount,
      },
    };
  } catch (error) {
    console.log(error);
    let msg = 'An unknown error occurred.';
    if (error instanceof Error) {
      msg = error.message;
    }
    return { props: { recipes: [], totalCound: 0, error: msg } };
  }
}

type Props = {
  recipes: (Recipe & { _id: string; isLiked: boolean })[];
  totalCount: number;
  error?: string;
};

export default function BrowsePage(props: Props) {
  return (
    <>
      <Typography variant="h5" component="h1">
        Browse Recipes
      </Typography>
      <Box mb={4}>
        <SearchAndPage totalCount={props.totalCount} />
      </Box>
      {props.error && (
        <Typography color="error" paragraph>
          {props.error}
        </Typography>
      )}
      {props.recipes.length < 1 && (
        <Box textAlign="center">No Recipes Found!</Box>
      )}
      {props.recipes.length > 0 && (
        <Grid
          container
          spacing={2}
          justifyContent={{ xs: 'center', sm: 'space-around' }}
        >
          {props.recipes.map((r) => (
            <Grid item key={r._id} sx={{ mb: { sx: 2, sm: 4 } }}>
              <RecipeCard recipe={r} />
            </Grid>
          ))}
        </Grid>
      )}
      <Box textAlign="right" pt={3}>
        <Pagination totalCount={props.totalCount} />
      </Box>
    </>
  );
}
