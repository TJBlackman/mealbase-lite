import { Grid, Toolbar, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { RecipeCard } from "@src/components/recipe-card";
import { SearchAndPage } from "@src/components/search-and-pagination";
import { RecipeModel } from "@src/db/recipes";
import { Recipe } from "@src/types";
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
    .lean()
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: 1 });

  const count = await RecipeModel.find(filter).countDocuments();

  // I guess .lean() doesn't work anymore and _id is an object and dates are objects
  // manually convert to strings.... ugh
  const flatRecipes = recipes.map((recipe) => ({
    ...recipe,
    _id: recipe._id.toString(),
    createdAt: recipe.createdAt.toISOString(),
    updatedAt: recipe.updatedAt.toISOString(),
  }));

  // search from query.param.search or ""
  const search = context.query.search || "";

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
  recipes: (Recipe & { _id: string })[];
  count: number;
  limit: number;
  skip: number;
  search: string;
};

export default function (props: Props) {
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
