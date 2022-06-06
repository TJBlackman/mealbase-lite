import { GetServerSideProps } from "next";
import EditIcon from "@mui/icons-material/Edit";
import { User } from "@src/types/index.d";
import { FailedRecipeModel } from "@src/db/failed-recipes";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { DataGrid, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import { useState } from "react";
import { EditDomainHashForm } from "@src/forms/edit-domain-hash";
import { EditFailedRecipeEdit } from "@src/forms/failed-recipe-edit";
import { DeleteFailedRecipeEdit } from "@src/forms/failed-recipe-delete";

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const recipes = await FailedRecipeModel.find({})
      .populate("addedByUser", "email")
      .sort({ createdAt: -1 })
      .lean();

    return { props: { recipes: JSON.parse(JSON.stringify(recipes)) } };
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

type Props = {
  recipes: (User & { _id: string })[];
  error?: string;
};

export default function FailedRecipesPage(props: Props) {
  const router = useRouter();
  const [editRecordId, setEditRecordId] = useState<null | string>(null);

  function dismissDialog() {
    setEditRecordId(null);
  }

  function refreshPage() {
    dismissDialog();
    router.replace(router.asPath);
  }

  if (props.error) {
    return <Typography variant="body1">Error: {props.error}</Typography>;
  }

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
      field: "url",
      headerName: "URL",
      minWidth: 250,
      flex: 1,
    },
    {
      field: "addedByUser",
      headerName: "User Email",
      width: 150,
      flex: 1,
      valueGetter: (data) => data.value.email,
    },
    {
      field: "createdAt",
      headerName: "Date Failed",
      width: 180,
      renderCell: (data) => {
        return new Date(data.value).toLocaleString();
      },
    },
    {
      field: "resolved",
      headerName: "Resolved",
      width: 120,
    },
    {
      field: "edit",
      headerName: "Edit",
      width: 100,
      renderCell: (value) => {
        return (
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            onClick={() => setEditRecordId(value.row._id)}
          />
        );
      },
    },
  ];

  return (
    <>
      <Typography variant="body1">
        {props.recipes.length} Failed Recipes
      </Typography>
      <Typography variant="body2" paragraph>
        Use this page to correct any recipes that a user tried to add but was
        unsuccessful.
      </Typography>
      <DataGrid
        rows={props.recipes}
        columns={columns}
        pageSize={100}
        rowsPerPageOptions={[100]}
        disableSelectionOnClick
        getRowId={(data) => data._id}
        sx={{ height: "65vh" }}
        columnVisibilityModel={{ _id: false }}
      />
      <Dialog
        fullWidth
        maxWidth="sm"
        onClose={dismissDialog}
        open={Boolean(editRecordId)}
      >
        <DialogTitle>Failed Recipe</DialogTitle>
        <DialogContent>
          <EditFailedRecipeEdit
            id={editRecordId || ""}
            onSuccess={refreshPage}
          />
          <Divider sx={{ mt: 3, mb: 3 }} />
          <DeleteFailedRecipeEdit
            id={editRecordId || ""}
            onSuccess={refreshPage}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
