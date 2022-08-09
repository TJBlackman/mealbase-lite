import { GetServerSideProps } from "next";
import { User } from "@src/db/users";
import { UserModel } from "@src/db/users";
import { Typography } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const users = await UserModel.find({})
      .select("email lastActiveDate deleted")
      .sort({ email: 1 })
      .lean();

    return { props: { users: JSON.parse(JSON.stringify(users)) } };
  } catch (err) {
    let msg = "An unknown error has occurred.";
    if (err instanceof Error) {
      msg = err.message;
    }
    return {
      props: { users: [], error: msg },
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
    minWidth: 250,
    flex: 1,
  },
  {
    field: "lastActiveDate",
    headerName: "Last Activity",
    width: 150,
    renderCell: (value) => {
      return new Date(value.row.lastActiveDate).toLocaleDateString();
    },
  },
  {
    field: "deleted",
    headerName: "isDeleted",
    width: 120,
  },
];

type Props = {
  users: (User & { _id: string })[];
  error?: string;
};

export default function AdminUsersPage(props: Props) {
  if (props.error) {
    return <Typography variant="body1">Error: {props.error}</Typography>;
  }

  return (
    <>
      <Typography variant="body1" paragraph>
        {props.users.length} Users
      </Typography>
      <DataGrid
        rows={props.users}
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
