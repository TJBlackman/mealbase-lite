import { useEffect, useState } from "react";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import LinkIcon from "@mui/icons-material/Link";
import { Menu } from "@mui/material";
import { Recipe } from "@src/types";
import { useUserContext } from "@src/contexts/user";
import { copyTextToClipboard } from "@src/utils/copy-to-clipboard";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Link from "next/link";

type Props = {
  recipe: Recipe & { _id: string };
  anchor: HTMLElement;
  onClose: () => void;
};

export function RecipeCardMenu(props: Props) {
  const userContext = useUserContext();
  const [isCopied, setIsCopied] = useState(false);

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
    <Menu anchorEl={props.anchor} open={true} onClose={props.onClose}>
      <MenuList sx={{ p: 0 }}>
        <MenuItem onClick={handleCopy}>
          <ListItemIcon>
            {isCopied ? (
              <CheckIcon fontSize="small" />
            ) : (
              <LinkIcon fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText>Copy Recipe URL</ListItemText>
        </MenuItem>
        {userContext.isAdmin && (
          <>
            <Link href={`/admin/recipes/${props.recipe._id}/edit`}>
              <MenuItem>
                <ListItemIcon>
                  <EditIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Edit Recipe</ListItemText>
              </MenuItem>
            </Link>
          </>
        )}
      </MenuList>
    </Menu>
  );
}
