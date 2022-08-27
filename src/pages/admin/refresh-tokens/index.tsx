import { GetServerSideProps } from 'next';
import { User } from '@src/db/users';
import { RefreshTokenModel } from '@src/db/refresh-tokens';
import { Toolbar, Typography, Button } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const tokens = await RefreshTokenModel.find({})
      .populate('userId', 'email _id')
      .sort({ userId: 1 })
      .lean();

    return { props: { tokens: JSON.parse(JSON.stringify(tokens)) } };
  } catch (err) {
    let msg = 'An unknown error has occurred.';
    if (err instanceof Error) {
      msg = err.message;
    }
    return {
      props: { tokens: [], error: msg },
    };
  }
};

// reference current time, for future calculations of refresh tokens
const currentTimestamp = Date.now();

/**
 * Define table columns
 */
const columns: GridColDef[] = [
  {
    field: '_id',
    headerName: '_id',
    width: 230,
  },
  {
    field: 'email',
    headerName: 'Email',
    minWidth: 250,
    flex: 1,
    renderCell: (value) => {
      return value.row.userId.email;
    },
  },
  {
    field: 'createdAt',
    headerName: 'Age',
    width: 180,
    renderCell: (value) => {
      const tokenDate = new Date(value.row.createdAt).getTime();
      var delta = Math.abs(currentTimestamp - tokenDate) / 1000;
      var days = Math.floor(delta / 86400);
      delta -= days * 86400;
      var hours = Math.floor(delta / 3600) % 24;
      delta -= hours * 3600;
      var minutes = Math.floor(delta / 60) % 60;
      delta -= minutes * 60;
      return `${days}d ${hours}h ${minutes}m`;
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
      <Typography>Refresh Tokens</Typography>
      <Toolbar sx={{ justifyContent: 'space-between' }} disableGutters>
        <Typography variant="body2">{props.tokens.length} Records</Typography>
        <Button
          variant="outlined"
          onClick={() => alert('TODO: Complete this feature')}
        >
          Delete Old Tokens
        </Button>
      </Toolbar>
      <DataGrid
        rows={props.tokens}
        columns={columns}
        pageSize={100}
        rowsPerPageOptions={[5]}
        disableSelectionOnClick
        getRowId={(data) => data._id}
        sx={{ height: '65vh', overflowX: 'scroll' }}
      />
    </>
  );
}
