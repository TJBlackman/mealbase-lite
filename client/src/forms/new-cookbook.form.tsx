import React, { useReducer } from 'react';
import { IGenericAction } from '../types';
import { getNewState } from '../utils/copy-state';
import { makeStyles } from '@material-ui/styles';
import { TextField, Button, Grid } from '@material-ui/core';

// styles
const useStyles = makeStyles({
  formClass: {
    padding: '20px 0',
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'flex-end',
  },
  textFieldClass: {
    marginBottom: '20px',
    flex: '0 0 100%',
  },
  btnClass: {
    margin: '0 0 20px 20px',
  },
  errorClass: {
    flex: '1 1 100%',
    marginBottom: '20px',
  },
});

interface IState {
  title: string;
  description: string;
  loading: boolean;
}
const defaultState: IState = {
  title: '',
  description: '',
  loading: false,
};

type Actions =
  | IGenericAction<'SET LOADING', boolean>
  | IGenericAction<'SET TITLE', string>
  | IGenericAction<'RESET FORM'>
  | IGenericAction<'SET DESCRIPTION', string>;

const reducer = (state: IState, action: Actions) => {
  const newState = getNewState<IState>(state);
  switch (action.type) {
    case 'SET LOADING': {
      newState.loading = action.payload;
      return newState;
    }
    case 'SET TITLE': {
      newState.title = action.payload;
      return newState;
    }
    case 'SET DESCRIPTION': {
      newState.description = action.payload;
      return newState;
    }
    case 'RESET FORM': {
      return defaultState;
    }
    default: {
      console.error(`Unknown action type:\n${JSON.stringify(action, null, 4)}`);
      return state;
    }
  }
};

export const NewCookbookForm = () => {
  const [localState, dispatch] = useReducer(reducer, defaultState);
  const { formClass, textFieldClass, btnClass, errorClass } = useStyles();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert(JSON.stringify(localState, null, 4));
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        className={textFieldClass}
        required
        fullWidth
        label='Title'
        variant='outlined'
        value={localState.title}
        disabled={localState.loading}
        onChange={(e) =>
          dispatch({
            type: 'SET TITLE',
            payload: e.target.value,
          })
        }
      />
      <TextField
        required
        fullWidth
        multiline
        rows={3}
        className={textFieldClass}
        label='Description'
        variant='outlined'
        value={localState.description}
        disabled={localState.loading}
        onChange={(e) =>
          dispatch({
            type: 'SET DESCRIPTION',
            payload: e.target.value,
          })
        }
      />
      <Grid container style={{ flexFlow: 'row-reverse' }}>
        <Button type='submit' variant='contained' color='primary'>
          Submit
        </Button>
        <Button type='button' variant='contained' color='default' onClick={() => dispatch({ type: 'RESET FORM' })}>
          Reset
        </Button>
      </Grid>
    </form>
  );
};
