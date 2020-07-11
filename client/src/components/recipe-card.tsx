import React, { useContext, useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Grid,
  useMediaQuery,
} from '@material-ui/core';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { IRecipe } from '../types';
import { networkRequest } from '../utils/network-request';
import { AppContext } from '../context';
import { RecipeCardMenu } from './recipe-card-menu';

// types
interface IProps {
  recipe: IRecipe;
}

// component
export const RecipeCard = ({ recipe }: IProps) => {
  const { replaceRecipe, setModal, globalState } = useContext(AppContext);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [loadingLike, setLoadingLike] = useState(false);
  const classes = useStyles();
  const handleLikeClick = () => {
    if (!globalState.user.email) {
      // not logged in
      return;
    }
    setLoadingLike(true);
    networkRequest({
      url: `/api/v1/recipes/${recipe.isLiked ? 'unlike' : 'like'}`,
      method: 'POST',
      body: {
        recipeId: recipe._id,
      },
      success: (json) => {
        setLoadingLike(false);
        replaceRecipe(json.data);
      },
      error: (err) => {
        setLoadingLike(false);
        alert(err.message);
      },
    });
  };
  const theme = useTheme();

  return (
    <Card className={classes.root} elevation={2}>
      <CardActionArea onClick={() => window.open(recipe.url)}>
        <CardMedia className={classes.media} image={recipe.image} title={recipe.title} />
      </CardActionArea>
      <CardContent>
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
      <CardActions>
        <Grid container alignItems='center' justify='space-between'>
          <Grid item>
            <Button color='primary' size='large' onClick={handleLikeClick} disabled={loadingLike}>
              <Typography component='span' variant='body1'>
                {recipe.likes}&nbsp;
              </Typography>
              {recipe.isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </Button>
          </Grid>
          <Grid item>
            <Button color='primary' size='large' onClick={(e) => setMenuAnchor(e.currentTarget)}>
              <MoreVertIcon />
            </Button>
          </Grid>
        </Grid>
      </CardActions>
      {menuAnchor && (
        <RecipeCardMenu
          recipe={recipe}
          user={globalState.user}
          onClose={() => setMenuAnchor(null)}
          anchor={menuAnchor}
          setModal={setModal}
        />
      )}
    </Card>
  );
};

// styles
const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    margin: '20px',
    display: 'flex',
    flexFlow: 'column',
    justifyContent: 'space-between',
    position: 'relative',
    [theme.breakpoints.down('xs')]: {
      margin: '20px 0',
    },
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
}));
