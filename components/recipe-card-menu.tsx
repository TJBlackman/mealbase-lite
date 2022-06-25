import { useEffect, useState } from 'react';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import LinkIcon from '@mui/icons-material/Link';
import { Dialog, DialogContent, Menu, Typography } from '@mui/material';
import { Recipe } from '@src/types';
import { useUserContext } from '@src/contexts/user';
import { copyTextToClipboard } from '@src/utils/copy-to-clipboard';
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import Link from 'next/link';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { AddRecipeToMealplanDialog } from './add-recipe-to-mealplan-dialog';
import { AddRecipeToMealPlanForm } from '@src/forms/meal-plans/add-recipe';

type Props = {
  recipe: Recipe & { _id: string };
  anchor: HTMLElement;
  onClose: () => void;
};

export function RecipeCardMenu(props: Props) {
  const userContext = useUserContext();
  const [isCopied, setIsCopied] = useState(false);
  const [mealplanDialog, setMealplanDialog] = useState(false);
  const [collectionDialog, setCollectionDialog] = useState(false);

  function handleCopy() {
    copyTextToClipboard(props.recipe.url);
    setIsCopied(true);
  }

  // reset isCopied state, if commponent is still mounted
  useEffect(() => {
    if (isCopied) {
      const timeout = setTimeout(() => {
        setIsCopied(false);
      }, 3000);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [isCopied]);

  return (
    <>
      <Menu anchorEl={props.anchor} open={true} onClose={props.onClose}>
        <MenuList sx={{ p: 0 }}>
          <MenuItem onClick={handleCopy}>
            <ListItemIcon>
              {isCopied ? (
                <CheckIcon fontSize="small" color="success" />
              ) : (
                <LinkIcon fontSize="small" />
              )}
            </ListItemIcon>
            <ListItemText>
              {isCopied ? (
                <Typography sx={{ color: 'palette.success' }}>
                  Copied
                </Typography>
              ) : (
                <Typography>Copy Recipe URL</Typography>
              )}
            </ListItemText>
          </MenuItem>
          {userContext.isLoggedIn && (
            <>
              <MenuItem onClick={() => setMealplanDialog(true)}>
                <ListItemIcon>
                  <RestaurantIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Add to Meal Plan</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <MenuBookIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Add to Collection</ListItemText>
              </MenuItem>
            </>
          )}
          {userContext.isAdmin && (
            <Link href={`/admin/recipes/${props.recipe._id}/edit`}>
              <MenuItem>
                <ListItemIcon>
                  <EditIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Edit Recipe</ListItemText>
              </MenuItem>
            </Link>
          )}
        </MenuList>
      </Menu>
      <Dialog open={mealplanDialog} onClose={() => setMealplanDialog(false)}>
        <DialogContent>
          <AddRecipeToMealPlanForm recipe={props.recipe} />
        </DialogContent>
      </Dialog>
    </>
  );
}
