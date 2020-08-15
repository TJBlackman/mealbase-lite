import React from 'react';
import { useRecipeContext } from '../context/recipes';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { RecipeDisplayType } from '../context/recipes/types';

export const RecipeListTypeSelect = () => {
  const { displayType, setRecipeDisplayType } = useRecipeContext();
  const classes = useStyles();

  return (
    <FormControl variant='outlined' className={classes.formControl} size='small' fullWidth>
      <InputLabel>Display Type</InputLabel>
      <Select
        value={displayType}
        onChange={(e) => setRecipeDisplayType(e.target.value as RecipeDisplayType)}
        label='Display Type'
        name='display-type'
      >
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
