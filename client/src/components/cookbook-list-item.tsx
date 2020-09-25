import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, Typography, Grid, Button } from '@material-ui/core';
import { ICookbookRecord } from '../types';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { CookbookCardMenu } from './cookbook-card-menu';
import { useRecipeContext } from '../context/recipes';
import { useHistory } from 'react-router-dom';

// types
interface IProps {
  cookbook: ICookbookRecord;
}

// component
export const CookbookListItem = ({ cookbook }: IProps) => {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const history = useHistory();
  const { setFilters } = useRecipeContext();
  const { root, cardContent } = useStyles();

  const goToRecipes = () => {
    setFilters({ cookbook: cookbook._id });
    history.push('/browse');
  };

  return (
    <Card className={root} elevation={2}>
      <CardContent className={cardContent}>
        <Grid container alignItems='flex-start' justify='space-between' wrap='nowrap'>
          <Grid item>
            <Typography variant='h6' component='h2' color='primary' onClick={goToRecipes}>
              {cookbook.title}
            </Typography>
          </Grid>
          <Grid item>
            <Button color='primary' size='large' onClick={(e) => setMenuAnchor(e.currentTarget)}>
              <MoreVertIcon />
            </Button>
          </Grid>
        </Grid>

        <Typography variant='body1' component='p' paragraph>
          {cookbook.recipes.length} {cookbook.recipes.length === 1 ? 'Recipe' : 'Recipes'}
        </Typography>

        <Typography variant='body1' component='p'>
          {cookbook.description}
        </Typography>
      </CardContent>
      {menuAnchor && <CookbookCardMenu cookbook={cookbook} onClose={() => setMenuAnchor(null)} anchor={menuAnchor} />}
    </Card>
  );
};

// styles
const useStyles = makeStyles((theme) => ({
  root: {
    flex: '0 0 100%',
    margin: '10px 0px',
    display: 'flex',
    flexFlow: 'row',
    justifyContent: 'flex-start',
    position: 'relative',
    '&:hover': {
      boxShadow: theme.shadows[10],
    },
  },
  cardContent: {
    padding: '10px 20px',
    flex: '1 1 100%',
    display: 'flex',
    flexFlow: 'column nowrap',
    justifyContent: 'flex-start',
  },
}));
