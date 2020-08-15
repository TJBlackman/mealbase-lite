import React, { useState } from 'react';
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
  Link,
} from '@material-ui/core';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { IRecipe } from '../types';
import { networkRequest } from '../utils/network-request';
import { RecipeCardMenu } from './recipe-card-menu';
import { useRecipeContext } from '../context/recipes';
import { useUserContext } from '../context/user';

// types
interface IProps {
  recipe: IRecipe;
}

// component
export const RecipeListItemDense = ({ recipe }: IProps) => {
  const { replaceRecipe } = useRecipeContext();
  const { user } = useUserContext();
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [loadingLike, setLoadingLike] = useState(false);
  const classes = useStyles();
  const handleLikeClick = () => {
    if (!user.email) {
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
      <CardActionArea className={classes.actionArea} onClick={() => window.open(recipe.url)}>
        <CardMedia className={classes.media} image={recipe.image} title={recipe.title} />
      </CardActionArea>
      <CardContent className={classes.cardContent}>
        <Link href={recipe.url} target='_blank' color='textPrimary' style={{ cursor: 'pointer' }}>
          <Typography variant='h6' component='h2' style={{ lineHeight: '1.1' }}>
            {recipe.title}
          </Typography>
        </Link>
        <Typography color='textSecondary' component='h4' style={{ lineHeight: '1.1' }}>
          {recipe.siteName}
        </Typography>
        <Typography variant='body2' component='p' className={classes.description}>
          {recipe.description}
        </Typography>
        <CardActions className={classes.cardActions}>
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
          <RecipeCardMenu recipe={recipe} user={user} onClose={() => setMenuAnchor(null)} anchor={menuAnchor} />
        )}
      </CardContent>
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
  likeBtn: {
    top: '0px',
    right: '0px',
    position: 'absolute',
    zIndex: 9,
    color: 'white',
    filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.5))',
  },
  media: {
    height: 110,
  },
  cardContent: {
    padding: '5px 5px 5px 20px',
    paddingBottom: '5px !important',
    flex: '1 1 100%',
    display: 'flex',
    flexFlow: 'column nowrap',
    justifyContent: 'flex-start',
    overflow: 'hidden',
  },
  actionArea: {
    flex: '0 0 150px',
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  cardActions: {
    marginTop: 'auto',
    padding: 0,
  },
  description: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
}));
