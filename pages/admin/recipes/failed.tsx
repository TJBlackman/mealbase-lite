import { GetServerSideProps } from 'next';
import { User } from '@src/types/index.d';
import { FailedRecipeModel } from '@src/db/failed-recipes';
import { Typography } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const recipes = await FailedRecipeModel.find({}).lean();

    return { props: { recipes: JSON.parse(JSON.stringify(recipes)) } };
  } catch (err) {
    let msg = 'An unknown error has occurred.';
    if (err instanceof Error) {
      msg = err.message;
    }
    return {
      props: { users: [], error: msg },
    };
  }
};

type Props = {
  recipes: (User & { _id: string })[];
  error?: string;
};

export default function AdminUsersPage(props: Props) {
  if (props.error) {
    return <Typography variant="body1">Error: {props.error}</Typography>;
  }

  return (
    <>
      <Typography variant="body1" paragraph>
        {props.recipes.length} Failed Recipes
      </Typography>
    </>
  );
}
