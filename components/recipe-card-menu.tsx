import * as React from "react";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import LinkIcon from "@mui/icons-material/Link";
import { Menu } from "@mui/material";
import { Recipe } from "@src/types";
import { useUserContext } from "@src/contexts/user";

type Props = {
  recipe: Recipe & { _id: string };
  anchor: HTMLElement;
  onClose: () => void;
};

export function RecipeCardMenu(props: Props) {
  const userContext = useUserContext();
  return (
    <Menu anchorEl={props.anchor} open={true} onClose={props.onClose}>
      <MenuList sx={{ p: 0 }}>
        <MenuItem>
          <ListItemIcon>
            <LinkIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Copy Recipe URL</ListItemText>
        </MenuItem>
        {userContext.isAdmin && (
          <>
            <MenuItem>
              <ListItemIcon>
                <LinkIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Edit Recipe</ListItemText>
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <LinkIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Delete Recipe</ListItemText>
            </MenuItem>
          </>
        )}
      </MenuList>
    </Menu>
  );
}
