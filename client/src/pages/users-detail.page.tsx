import React, { useEffect, useReducer } from 'react';
import {
  Typography,
  Grid,
  TextField,
  Checkbox,
  CircularProgress,
  ListItemText,
  MenuItem,
  Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useParams, useHistory } from 'react-router-dom';
import cloneDeep from 'lodash.clonedeep';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import Layout from '../layouts/app-layout';
import { networkRequest } from '../utils/network-request';
import { FormFeedback } from '../components/form-feedback';

interface IUser {
  email: string;
  _id: string;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}
interface ILocalState {
  originalUser: IUser;
  editedUser: IUser;
  newPassword: string;
  loading: boolean;
  success: string;
  error: string;
}
const defaultState: ILocalState = {
  originalUser: {
    email: '',
    _id: '',
    roles: [],
    createdAt: '',
    updatedAt: '',
  },
  editedUser: {
    email: '',
    _id: '',
    roles: [],
    createdAt: '',
    updatedAt: '',
  },
  newPassword: '',
  loading: true,
  success: '',
  error: '',
};
type Action =
  | { type: 'SET ORIGINAL USER'; payload: IUser }
  | { type: 'SET NEW EMAIL'; payload: string }
  | { type: 'SET NEW ROLES'; payload: string[] }
  | { type: 'SET NEW PASSWORD'; payload: string }
  | { type: 'SUBMIT NETWORK REQUEST' }
  | { type: 'SET SUCCESS'; payload: string }
  | { type: 'SET ERROR'; payload: string }
  | { type: 'RESET FORM' };

const reducer = (state: ILocalState, action: Action) => {
  const newState = cloneDeep(state);
  switch (action.type) {
    case 'SET ERROR': {
      newState.error = action.payload;
      newState.loading = false;
      return newState;
    }
    case 'SET SUCCESS': {
      newState.success = action.payload;
      newState.originalUser = { ...newState.editedUser };
      newState.newPassword = '';
      newState.loading = false;
      return newState;
    }
    case 'SET NEW EMAIL': {
      newState.editedUser.email = action.payload;
      return newState;
    }
    case 'SET NEW ROLES': {
      newState.editedUser.roles = action.payload;
      return newState;
    }
    case 'SET NEW PASSWORD': {
      newState.newPassword = action.payload;
      return newState;
    }
    case 'SUBMIT NETWORK REQUEST': {
      newState.loading = true;
      return newState;
    }
    case 'SET ORIGINAL USER': {
      newState.originalUser = { ...action.payload };
      newState.editedUser = { ...action.payload };
      newState.loading = false;
      return newState;
    }
    case 'RESET FORM': {
      const resetState = { ...defaultState };
      resetState.editedUser = { ...state.originalUser };
      resetState.loading = false;
      return resetState;
    }
    default: {
      console.error(`Unknown Action:\n${JSON.stringify(action, null, 2)}`);
      return state;
    }
  }
};

export const UserDetailPage = () => {
  const [localState, dispatch] = useReducer(reducer, defaultState);
  const { userId } = useParams<{ userId: string }>();
  const history = useHistory();

  useEffect(() => {
    dispatch({ type: 'SUBMIT NETWORK REQUEST' });
    networkRequest({
      url: `/api/v1/users?_id=${userId}`,
      success: (json) => {
        dispatch({ type: 'SET ORIGINAL USER', payload: json.data[0] });
      },
      error: (err) => {
        console.error(err);
        dispatch({ type: 'SET ERROR', payload: err.message });
      },
    });
  }, []);

  const submitForm = () => {
    dispatch({ type: 'SUBMIT NETWORK REQUEST' });
    networkRequest({
      url: '/api/v1/users',
      method: 'PUT',
      body: (() => {
        const changedValues: any = {
          _id: localState.originalUser._id,
        };
        if (localState.originalUser.email !== localState.editedUser.email) {
          changedValues.email = localState.editedUser.email;
        }
        if (localState.originalUser.roles.join('') !== localState.editedUser.roles.join('')) {
          changedValues.roles = localState.editedUser.roles;
        }
        if (localState.newPassword.length > 0) {
          changedValues.password = localState.newPassword;
        }
        return changedValues;
      })(),
      success: (json) => {
        dispatch({ type: 'SET SUCCESS', payload: 'User successfully updated.' });
        setTimeout(() => {
          dispatch({ type: 'SET SUCCESS', payload: '' });
        }, 4000);
      },
      error: (err) => {
        console.error(err);
        dispatch({ type: 'SET ERROR', payload: err.message });
      },
    });
  };

  return (
    <Layout>
      <Typography variant='h4' paragraph>
        User Account
      </Typography>
      <Button
        variant='contained'
        startIcon={<ArrowBackIcon />}
        style={{ marginBottom: '40px' }}
        onClick={() => history.goBack()}
      >
        Back to all users
      </Button>
      {localState.loading && (
        <CircularProgress size={50} thickness={2} style={{ display: 'block', margin: '50px auto' }} />
      )}
      {!localState.loading && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant='outlined'
              label='Email Address'
              value={localState.editedUser.email}
              onChange={(e) => dispatch({ type: 'SET NEW EMAIL', payload: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant='outlined'
              label='User ID'
              value={localState.editedUser._id}
              inputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              select
              variant='outlined'
              label='User Roles'
              value={localState.editedUser.roles}
              SelectProps={{
                multiple: true,
                renderValue: (selected) => (selected as string[]).join(', '),
              }}
              onChange={(e) => dispatch({ type: 'SET NEW ROLES', payload: (e.target.value as unknown) as string[] })}
            >
              <MenuItem value='user'>
                <Checkbox checked={localState.editedUser.roles.indexOf('user') > -1} />
                <ListItemText primary='user' />
              </MenuItem>
              <MenuItem value='admin'>
                <Checkbox checked={localState.editedUser.roles.indexOf('admin') > -1} />
                <ListItemText primary='admin' />
              </MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant='outlined'
              label='Date Joined'
              value={new Date(localState.editedUser.createdAt).toLocaleDateString()}
              inputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant='outlined'
              label='Date Updated'
              value={new Date(localState.editedUser.updatedAt).toLocaleDateString()}
              inputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              variant='outlined'
              label='Reset Password'
              value={localState.newPassword}
              onChange={(e) => dispatch({ type: 'SET NEW PASSWORD', payload: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <FormFeedback
              success={localState.success}
              error={localState.error}
              clearError={() => dispatch({ type: 'SET ERROR', payload: '' })}
            />
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2} justify='flex-start' alignItems='center' direction='row-reverse'>
              <Grid item>
                <Button variant='contained' color='primary' onClick={submitForm}>
                  Submit
                </Button>
              </Grid>
              <Grid item>
                <Button variant='contained' onClick={() => dispatch({ type: 'RESET FORM' })}>
                  Reset
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}

      <Button
        variant='contained'
        startIcon={<ArrowBackIcon />}
        style={{ marginTop: '40px' }}
        onClick={() => history.goBack()}
      >
        Back to all users
      </Button>
    </Layout>
  );
};
