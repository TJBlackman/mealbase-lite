import { Grid, Box, Typography } from "@mui/material";
import { RecipeCard } from "@src/components/recipe-card";
import { SearchAndPage } from "@src/components/search-and-pagination";
import { RecipeLikesModel } from "@src/db/recipe-likes";
import { RecipeModel } from "@src/db/recipes";
import { Recipe } from "@src/types";
import { getUserJWT } from "@src/validation/server-requests";
import { GetServerSidePropsContext } from "next";

/** get server side data and SSR page */
export async function getServerSideProps(context: GetServerSidePropsContext) {
  // calculate limit, or use default
  const limit = (() => {
    let _limit = "25";
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
      result.title = { $regex: context.query.search, $options: "i" };
    }
    return result;
  })();

  // get recipes from DB
  const recipes = await RecipeModel.find(filter)
    .select("-addedByUser -deleted -__v")
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: 1 })
    .lean();

  // count total recipes that match this filter
  const count = await RecipeModel.find(filter).countDocuments();

  // if user is logged in,
  // get their liked recipe and check if any of the above recipes are liked this user
  const user = await getUserJWT(context.req.cookies);
  if (user) {
    const recipeIds = recipes.map((r) => r._id);
    const likedRecipes = await RecipeLikesModel.find({
      userId: user._id,
      recipeId: { $in: recipeIds },
    }).select("recipeId");
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

  // search from query.param.search or ""
  const search = context.query.search || "";

  return {
    props: {
      recipes: JSON.parse(JSON.stringify(recipes)),
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

export default function BrowsePage(props: Props) {
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
        <Grid
          container
          spacing={2}
          justifyContent={{ xs: "center", sm: "space-around" }}
        >
          {props.recipes.map((r) => (
            <Grid item key={r._id} sx={{ mb: { sx: 2, sm: 4 } }}>
              <RecipeCard recipe={r} />
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
}
