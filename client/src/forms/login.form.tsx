import React, { useReducer } from 'react';
import { TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

interface ILoginFormValues {
  email: string;
  password: string;
}
interface Action {
  type: string;
  value: string;
}

// form default values
const defaultValues: ILoginFormValues = {
  email: '',
  password: '',
};

// reducer action types
const formActions = {
  UPDATE_EMAIL: 'UPDATE EMAIL',
  UPDATE_PASSWORD: 'UPDATE PASSWORD',
};

// form state reducer
const reducer = (state: ILoginFormValues, action: Action) => {
  const newState: ILoginFormValues = { ...state };
  switch (action.type) {
    case formActions.UPDATE_EMAIL: {
      newState.email = action.value;
      break;
    }
    case formActions.UPDATE_PASSWORD: {
      newState.password = action.value;
      break;
    }
    default: {
      console.error(`Unknown action type: ${action.type}`);
    }
  }
  return newState;
};

// component
export const LoginForm = () => {
  const [state, dispatch] = useReducer(reducer, defaultValues);
  const { formClass, textFieldClass, btnClass } = useStyles();
  const onSubmit = (e) => {
    e.preventDefault();
    alert(JSON.stringify(state, null, 4));
  };
  return (
    <form onSubmit={onSubmit} className={formClass}>
      <TextField
        className={textFieldClass}
        required
        fullWidth
        label='Email Address'
        variant='outlined'
        value={state.email}
        onChange={(e) =>
          dispatch({
            type: formActions.UPDATE_EMAIL,
            value: e.target.value,
          })
        }
      />
      <TextField
        className={textFieldClass}
        required
        fullWidth
        label='Password'
        variant='outlined'
        value={state.password}
        onChange={(e) =>
          dispatch({
            type: formActions.UPDATE_PASSWORD,
            value: e.target.value,
          })
        }
      />
      <Button variant='contained' className={btnClass}>
        Reset
      </Button>
      <Button variant='contained' className={btnClass} color='primary' type='submit'>
        Submit
      </Button>
    </form>
  );
};

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
    marginLeft: '20px',
  },
});
