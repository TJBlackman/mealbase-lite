import { GetServerSideProps } from "next";
import { User } from "@src/types/index.d";
import { RefreshTokenModel } from "@src/db/refresh-tokens";
import { Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const tokens = await RefreshTokenModel.find({})
      .populate("userId", "email _id")
      .sort({ userId: 1 })
      .lean();

    return { props: { tokens: JSON.parse(JSON.stringify(tokens)) } };
  } catch (err) {
    let msg = "An unknown error has occurred.";
    if (err instanceof Error) {
      msg = err.message;
    }
    return {
      props: { tokens: [], error: msg },
    };
  }
};

/**
 * Define table columns
 */
const columns: GridColDef[] = [
  {
    field: "_id",
    headerName: "_id",
    width: 230,
  },
  {
    field: "email",
    headerName: "Email",
    width: 250,
    flex: 1,
    renderCell: (value) => {
      return value.row.userId.email;
    },
  },
];

type Props = {
  tokens: (User & { _id: string })[];
  error?: string;
};

export default function AdminTokensPage(props: Props) {
  if (props.error) {
    return <Typography variant="body1">Error: {props.error}</Typography>;
  }

  return (
    <>
      <Typography variant="body1" paragraph>
        {props.tokens.length} Refresh Tokens
      </Typography>
      <DataGrid
        rows={props.tokens}
        columns={columns}
        pageSize={100}
        rowsPerPageOptions={[5]}
        disableSelectionOnClick
        getRowId={(data) => data._id}
        sx={{ height: "65vh" }}
      />
    </>
  );
}
