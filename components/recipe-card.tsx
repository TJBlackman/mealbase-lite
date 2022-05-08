import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import { Recipe } from '@src/types';
import { Link as MuiLink } from '@mui/material';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton } from '@mui/material';
import { useState } from 'react';
import { RecipeCardMenu } from './recipe-card-menu';
import { RecipeLikeButton } from './recipe-card-like-btn';

type Props = {
  recipe: Recipe & { _id: string; isLiked: boolean };
};

export function RecipeCard(props: Props) {
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);

  function showMenu(e: React.MouseEvent<HTMLButtonElement>) {
    setAnchor(e.currentTarget);
  }

  function closeMenu() {
    setAnchor(null);
  }

  return (
    <>
      <Card
        sx={{
          maxWidth: 345,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
        elevation={10}
      >
        <a href={props.recipe.url} target="_blank" referrerPolicy="no-referrer">
          <CardMedia
            component="img"
            height="194"
            image={props.recipe.image}
            alt={props.recipe.title}
          />
        </a>
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            sx={{ lineHeight: '1.2' }}
          >
            <MuiLink
              href={props.recipe.url}
              target="_blank"
              referrerPolicy="no-referrer"
              sx={{
                color: 'text.primary',
                textDecoration: 'none',
                ':hover': {
                  color: 'primary.main',
                  textDecoration: 'underline',
                },
              }}
            >
              {props.recipe.title}
            </MuiLink>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {props.recipe.description}
          </Typography>
        </CardContent>
        <CardActions disableSpacing sx={{ justifyContent: 'space-between' }}>
          <RecipeLikeButton
            recipeId={props.recipe._id}
            isLiked={props.recipe.isLiked || false}
            likes={props.recipe.likes}
          />
          <IconButton onClick={showMenu}>
            <MoreVertIcon />
          </IconButton>
        </CardActions>
      </Card>
      {anchor && (
        <RecipeCardMenu
          anchor={anchor}
          onClose={closeMenu}
          recipe={props.recipe}
        />
      )}
    </>
  );
}
