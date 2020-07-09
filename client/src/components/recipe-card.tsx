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
  Grid,
  Menu,
  MenuItem,
  ListItemIcon,
} from '@material-ui/core';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import DoneIcon from '@material-ui/icons/Done';
import ReportIcon from '@material-ui/icons/Report';
import LinkIcon from '@material-ui/icons/Link';
import EventNoteIcon from '@material-ui/icons/EventNote';
import { IRecipe } from '../types';
import { networkRequest } from '../utils/network-request';
import { AppContext } from '../context';
import { copyTextToClipboard } from '../utils/copy-to-clipboard';

// types
interface IProps {
  recipe: IRecipe;
}

// component
export const RecipeCard = ({ recipe }: IProps) => {
  const { replaceRecipe, globalState } = useContext(AppContext);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [loadingLike, setLoadingLike] = useState(false);
  const [copied, setCopied] = useState(false);
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
  const closeMenu = () => setMenuAnchor(null);
  const copyLink = () => {
    copyTextToClipboard(recipe.url);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

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
      <Menu id='simple-menu' anchorEl={menuAnchor} keepMounted open={Boolean(menuAnchor)} onClose={closeMenu}>
        <MenuItem onClick={closeMenu}>
          <ListItemIcon>
            <MenuBookIcon fontSize='small' />
          </ListItemIcon>
          <Typography variant='inherit' noWrap>
            Add to Cookbook
          </Typography>
        </MenuItem>
        <MenuItem onClick={closeMenu}>
          <ListItemIcon>
            <EventNoteIcon fontSize='small' />
          </ListItemIcon>
          <Typography variant='inherit' noWrap>
            Add to Mealplan
          </Typography>
        </MenuItem>
        <MenuItem onClick={copyLink}>
          <ListItemIcon>{copied ? <DoneIcon fontSize='small' /> : <LinkIcon fontSize='small' />}</ListItemIcon>
          <Typography variant='inherit' noWrap>
            Copy Link
          </Typography>
        </MenuItem>
        <MenuItem onClick={closeMenu}>
          <ListItemIcon>
            <ReportIcon fontSize='small' />
          </ListItemIcon>
          <Typography variant='inherit' noWrap>
            Report
          </Typography>
        </MenuItem>
      </Menu>
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
