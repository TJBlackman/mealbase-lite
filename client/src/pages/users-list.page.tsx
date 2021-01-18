import React, { useEffect, useState } from 'react';
import {
  Typography,
  Grid,
  Divider,
  TextField,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';

import Layout from '../layouts/app-layout';
import { networkRequest } from '../utils/network-request';
import { IUserData } from '../types';

export const UserListPage = () => {
  const [users, setUsers] = useState<IUserData[]>([]);
  const [search, setSearch] = useState<string>('');
  const { rowStyles } = useStyles();
  const history = useHistory();

  const searchUsers = () =>
    networkRequest({
      url: `/api/v1/users?search=${search}`,
      success: (json) => setUsers(json.data),
      error: (err) => {
        alert(err.message);
      },
    });

  useEffect(searchUsers, []);
  return (
    <Layout>
      <Typography variant='h4'>Manage Users</Typography>
      <Typography variant='body1' paragraph>
        An admin can use this page to manage other user accounts.
      </Typography>
      <Grid container spacing={3} justify='flex-end' alignItems='center'>
        <Grid item xs={12} sm='auto'>
          <TextField
            fullWidth
            variant='outlined'
            size='small'
            label='Search for users'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm='auto'>
          <Button variant='contained' onClick={searchUsers}>
            Search Users
          </Button>
        </Grid>
      </Grid>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: 'bold' }}>Email Address</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Roles</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id} className={rowStyles} onClick={() => history.push(`/users/${user._id}`)}>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.roles.join(', ')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Layout>
  );
};

const useStyles = makeStyles((theme) => ({
  rowStyles: {
    '&:hover': {
      cursor: 'pointer',
      backgroundColor: theme.palette.grey[200],
    },
  },
}));
