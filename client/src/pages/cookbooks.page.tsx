import React, { useReducer, useEffect } from 'react';
import Layout from '../layouts/app-layout';
import { Typography, Button, Divider, Grid, TextField } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { useModalContext } from '../context/modal';
import { useCookbookContext } from '../context/cookbooks';
import { useUserContext } from '../context/user';
import { CookbookListItem } from '../components/cookbook-list-item';
import { AccountRequiredWarning } from '../components/account-required-warning';
import { makeStyles } from '@material-ui/core/styles';
import { IGenericAction, ICookbookRecord } from '../types';

interface ILocalState {
  search: string;
  visibleCookbooks: ICookbookRecord[];
}

type Action = IGenericAction<'SET SEARCH', string> | IGenericAction<'SET VISIBLE COOKBOOKS', ICookbookRecord[]>;

const defaultState: ILocalState = {
  search: '',
  visibleCookbooks: [],
};

const reducer = (state: ILocalState, action: Action) => {
  const newState = { ...state };
  switch (action.type) {
    case 'SET SEARCH': {
      newState.search = action.payload;
      return newState;
    }
    case 'SET VISIBLE COOKBOOKS': {
      newState.visibleCookbooks = action.payload;
      return newState;
    }
    default: {
      console.error('Unknown action.type:\n' + JSON.stringify(action, null, 4));
      return state;
    }
  }
};

export const CookbooksPage = () => {
  const { showModal } = useModalContext();
  const { cookbooks } = useCookbookContext();
  const { user } = useUserContext();
  const [localState, dispatch] = useReducer(reducer, defaultState);

  useEffect(() => {
    if (localState.search == '') {
      return dispatch({
        type: 'SET VISIBLE COOKBOOKS',
        payload: cookbooks,
      });
    }

    const visibleCookbooks = cookbooks.filter(({ title }) => {
      return title.toLocaleLowerCase().includes(localState.search.toLocaleLowerCase());
    });
    dispatch({
      type: 'SET VISIBLE COOKBOOKS',
      payload: visibleCookbooks,
    });
  }, [localState.search, cookbooks]);

  return (
    <Layout>
      <Typography variant='h3' component='h1'>
        Cookbooks
      </Typography>
      <Typography variant='body1'>
        Cookbooks can be used to create groups of recipes you like. To get started, create a new cookbook and give it
        the title "My Favorite Recipes." Now, find a recipe you like, and click "Add to cookbook," then select your new
        cookbook!
      </Typography>
      <Grid
        container
        justify='space-between'
        alignItems='flex-start'
        spacing={3}
        style={{ marginTop: '10px', marginBottom: '10px' }}
        direction='row-reverse'
      >
        <Grid item xs={12} sm='auto'>
          <Button
            style={{ display: 'flex' }}
            variant='contained'
            color='primary'
            startIcon={<AddIcon />}
            disabled={!user.email}
            onClick={() =>
              showModal({
                modalType: 'NEW COOKBOOK',
              })
            }
          >
            Add New Cookbook
          </Button>
        </Grid>
        <Grid item xs={12} sm='auto'>
          <TextField
            fullWidth
            variant='outlined'
            value={localState.search}
            onChange={(e) => dispatch({ type: 'SET SEARCH', payload: e.target.value })}
            size='small'
            placeholder='Search Your Cookbooks'
            style={{ minWidth: '220px', maxWidth: '100%' }}
            helperText={`Found ${localState.visibleCookbooks.length} cookbook${
              localState.visibleCookbooks.length !== 1 ? 's' : ''
            }`}
          />
        </Grid>
      </Grid>
      <Divider style={{ margin: '20px 0' }} />
      {localState.visibleCookbooks.map((cb) => (
        <CookbookListItem key={cb._id} cookbook={cb} />
      ))}
      {!user.email && <AccountRequiredWarning text='before you creating your first cookbook.' />}
    </Layout>
  );
};

const useStyles = makeStyles((theme) => ({
  actionRow: {
    margin: '20px 0',
  },
}));
