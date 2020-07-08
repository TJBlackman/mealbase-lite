import React, { useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Snackbar,
  Grid,
} from '@material-ui/core';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { IRecipe } from '../types';
import { networkRequest } from '../utils/network-request';
import { AppContext } from '../context';

// types
interface IProps {
  recipe: IRecipe;
}

// component
export const RecipeCard = ({ recipe }: IProps) => {
  const { replaceRecipe, globalState } = useContext(AppContext);
  const [requireLogin, setRequireLogin] = useState(true);
  const classes = useStyles();
  const handleLikeClick = () => {
    // if logged in
    if (globalState.user.email) {
      networkRequest({
        url: `/api/v1/recipes/${recipe.isLiked ? 'unlike' : 'like'}`,
        method: 'POST',
        body: {
          recipeId: recipe._id,
        },
        success: (json) => {
          replaceRecipe(json.data);
        },
        error: (err) => {
          alert(err.message);
        },
      });
    } else {
    }
  };
  return (
    <Card className={classes.root} elevation={2}>
      <CardActionArea onClick={() => window.open(recipe.url)}>
        <CardMedia className={classes.media} image={recipe.image} title={recipe.title} />
      </CardActionArea>
      <CardContent>
        <Grid container alignItems='center' justify='space-between'>
          <Grid item>
            <Button color='primary' size='large' onClick={handleLikeClick}>
              <span>{recipe.likes}</span>
              {recipe.isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </Button>
          </Grid>
          <Grid item>
            <Button color='primary' size='large'>
              <MoreVertIcon />
            </Button>
          </Grid>
        </Grid>
        <Typography gutterBottom variant='h6' component='h2'>
          {recipe.title}
        </Typography>
        <Typography gutterBottom color='textSecondary' component='h4'>
          {recipe.siteName}
        </Typography>
        <Typography variant='body2' component='p'>
          {recipe.description}
        </Typography>
      </CardContent>
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
