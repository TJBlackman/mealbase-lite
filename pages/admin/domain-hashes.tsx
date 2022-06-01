import {
  Box,
  Dialog,
  DialogTitle,
  Typography,
  DialogContent,
} from "@mui/material";
import { DataGrid, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import { DomainHashSelectorsModel } from "@src/db/domain-hash-selectors";
import { DomainHashSelector } from "@src/types";
import { GetServerSideProps } from "next";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const result = {
    props: {
      records: [],
      error: "",
    },
  };

  try {
    const records = await DomainHashSelectorsModel.find({}).lean();
    result.props.records = JSON.parse(JSON.stringify(records));
  } catch (err) {
    let msg = "An unknown error has occurred.";
    if (err instanceof Error) {
      msg = err.message;
    }
    result.props.error = msg;
  }

  return result;
};

type Props = {
  records: (DomainHashSelector & { _id: string })[];
  error?: string;
};

export default function DomainHashesPage(props: Props) {
  const [recordId, setRecordId] = useState<null | string>(null);

  function dismissDialog() {
    setRecordId(null);
  }

  /**
   * Define table columns
   */
  const columns: GridColDef[] = [
    {
      field: "_id",
      headerName: "_id",
      width: 230,
      hide: true,
    },
    {
      field: "domain",
      headerName: "Domain",
      minWidth: 250,
      renderCell: (value) => {
        return value.row.domain;
      },
    },
    {
      field: "selector",
      headerName: "Selector",
      minWidth: 250,
      flex: 1,
      renderCell: (value) => {
        return (
          value.row.selector || (
            <Typography component="span" sx={{ fontStyle: "italic" }}>
              None
            </Typography>
          )
        );
      },
    },
    {
      field: "updatedAt",
      headerName: "Updated At",
      minWidth: 250,
      renderCell: (value) => {
        return value.row.updatedAt
          ? new Date(value.row.updatedAt).toLocaleString()
          : "N/A";
      },
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
            onClick={() => setRecordId(value.row._id)}
          />
        );
      },
    },
  ];

  return (
    <>
      <Typography>Domain Hashes</Typography>
      <Box maxWidth="md">
        <Typography variant="body2" paragraph>
          A hash is an identifier of where to scroll to on a given page, which
          allows users to skip the blogs and jump right to the recipe. Example;
          domain.com/recipes/mac-n-cheese#recipe-container. This page allows an
          admin to enter a selector that can be used to find the appropriate
          hash for any given website.
        </Typography>
      </Box>
      <DataGrid
        rows={props.records}
        columns={columns}
        pageSize={100}
        rowsPerPageOptions={[5]}
        disableSelectionOnClick
        getRowId={(data) => data._id}
        sx={{ height: "65vh", overflowX: "scroll" }}
      />
      <Dialog open={Boolean(recordId)} onClose={dismissDialog}>
        <DialogTitle>Edit Domain Hash</DialogTitle>
        <DialogContent>
          <Typography>Domain hash ID: {recordId}</Typography>
        </DialogContent>
      </Dialog>
    </>
  );
}
