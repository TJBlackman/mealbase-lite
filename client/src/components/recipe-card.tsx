import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardActionArea, CardActions, CardContent, CardMedia, Button, Typography } from '@material-ui/core';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import { IRecipe } from '../types';

// types
interface IProps {
  recipe: IRecipe;
}

// component
export const RecipeCard = ({ recipe }: IProps) => {
  const classes = useStyles();
  return (
    <Card className={classes.root} elevation={2}>
      <Button color='inherit' size='large' className={classes.likeBtn}>
        <FavoriteBorderIcon />
      </Button>
      <CardActionArea onClick={() => window.open(recipe.url)}>
        <CardMedia className={classes.media} image={recipe.image} title={recipe.title} />
        <CardContent>
          <Typography gutterBottom variant='h5' component='h2'>
            {recipe.title}
          </Typography>
          <Typography>{recipe.siteName}</Typography>
          <Typography variant='body2' color='textSecondary' component='p'>
            {recipe.description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button fullWidth color='primary' size='large'>
          Actions
        </Button>
      </CardActions>
    </Card>
  );
};

// styles
const useStyles = makeStyles({
  root: {
    maxWidth: 345,
    margin: '20px',
    display: 'flex',
    flexFlow: 'column',
    justifyContent: 'space-between',
    position: 'relative',
  },
  likeBtn: {
    top: '0px',
    right: '0px',
    position: 'absolute',
    zIndex: 9,
    color: 'white',
    filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.5))',
  },
  media: {
    height: 180,
  },
});
