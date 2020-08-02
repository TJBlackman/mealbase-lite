import React, { useContext } from 'react';
import { AppContext } from '../context';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

export const RecipeListTypeSelect = () => {
  const { globalState, setDisplayType } = useContext(AppContext);
  const classes = useStyles();

  const handleChange = (e) => {
    setDisplayType(e.target.value);
  };

  return (
    <FormControl variant='outlined' className={classes.formControl} size='small' fullWidth>
      <InputLabel>Display Type</InputLabel>
      <Select value={globalState.recipes.displayType} onChange={handleChange} label='Display Type' name='display-type'>
        <MenuItem value='cards'>Cards</MenuItem>
        <MenuItem value='list'>List</MenuItem>
        <MenuItem value='dense'>Dense</MenuItem>
      </Select>
    </FormControl>
  );
};

// styles
const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));
