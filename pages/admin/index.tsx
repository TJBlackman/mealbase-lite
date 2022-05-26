import {
  List,
  ListItem,
  ListItemText,
  Typography,
  ListItemSecondaryAction,
} from "@mui/material";
import Link from "next/link";

import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export default function Page() {
  return (
    <>
      <Typography variant="body1" paragraph>
        Select an Action
      </Typography>
      <List sx={{ maxWidth: "sm" }}>
        <Link href="/admin/users" passHref>
          <ListItem button divider>
            <ListItemText primary="Users" />
            <ListItemSecondaryAction>
              <ChevronRightIcon />
            </ListItemSecondaryAction>
          </ListItem>
        </Link>
        <Link href="/admin/recipes/failed" passHref>
          <ListItem button divider>
            <ListItemText primary="Failed Recipes" />
            <ListItemSecondaryAction>
              <ChevronRightIcon />
            </ListItemSecondaryAction>
          </ListItem>
        </Link>
        <Link href="/admin/refresh-tokens" passHref>
          <ListItem button divider>
            <ListItemText primary="Refresh Tokens" />
            <ListItemSecondaryAction>
              <ChevronRightIcon />
            </ListItemSecondaryAction>
          </ListItem>
        </Link>
      </List>
    </>
  );
}
