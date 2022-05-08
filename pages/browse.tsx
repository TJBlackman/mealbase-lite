import { Grid, Toolbar, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { RecipeCard } from '@src/components/recipe-card';
import { SearchAndPage } from '@src/components/search-and-pagination';
import { RecipeLikesModel } from '@src/db/recipe-likes';
import { RecipeModel } from '@src/db/recipes';
import { Recipe, UserJwt } from '@src/types';
import { verifyJwt } from '@src/utils/jwt-helpers';
import { GetServerSidePropsContext } from 'next';

/** get server side data and SSR page */
export async function getServerSideProps(context: GetServerSidePropsContext) {
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
    return result;
  })();

  // get recipes from DB
  const recipes = await RecipeModel.find(filter)
    .select('-addedByUser -deleted -__v')
    .lean()
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: 1 });

  // count total recipes that match this filter
  const count = await RecipeModel.find(filter).countDocuments();

  // I guess .lean() doesn't work anymore and _id is an object and dates are objects
  // manually convert to strings.... ugh
  let flatRecipes = recipes.map((recipe) => ({
    ...recipe,
    _id: recipe._id.toString(),
    createdAt: recipe.createdAt.toISOString(),
    updatedAt: recipe.updatedAt.toISOString(),
    isLiked: false,
  }));

  // if user is logged in,
  // get their liked recipe and check if any of the above recipes are liked this user
  const accessToken =
    context.req.cookies[process.env.ACCESS_TOKEN_COOKIE_NAME!];
  if (accessToken) {
    const user = await verifyJwt<UserJwt>(accessToken).catch((_err) => {});
    if (user) {
      const recipeIds = flatRecipes.map((r) => r._id);
      const likedRecipes = await RecipeLikesModel.find({
        userId: user._id,
        recipeId: { $in: recipeIds },
      }).select('recipeId');
      likedRecipes.forEach((liked) => {
        const _likedRecipe = flatRecipes.find(
          (recipe) => recipe._id === liked.recipeId.toString()
        );
        if (_likedRecipe) {
          _likedRecipe.isLiked = true;
        }
      });
    }
  }

  // search from query.param.search or ""
  const search = context.query.search || '';

  return {
    props: {
      recipes: flatRecipes,
      count,
      limit,
      skip,
      search,
    },
  };
}

type Props = {
  recipes: (Recipe & { _id: string; isLiked: boolean })[];
  count: number;
  limit: number;
  skip: number;
  search: string;
};

export default function (props: Props) {
  console.log(props);
  return (
    <>
      <Typography variant="h5" component="h1" paragraph>
        Browse Recipes
      </Typography>
      <Box mb={4}>
        <SearchAndPage
          totalCount={props.count}
          limit={props.limit}
          skip={props.skip}
          search={props.search}
        />
      </Box>
      {props.recipes.length < 1 && (
        <Box textAlign="center">No Recipes Found!</Box>
      )}
      {props.recipes.length > 0 && (
        <Grid container spacing={2} justifyContent="space-around">
          {props.recipes.map((r) => (
            <Grid item key={r._id}>
              <RecipeCard recipe={r} />
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
}
