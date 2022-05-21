import { List, ListItem, ListItemText } from '@mui/material';
import Link from 'next/link';

export default function Page() {
  return (
    <List>
      <Link href="/admin/users" passHref>
        <ListItem button divider>
          <ListItemText primary="Users" />
        </ListItem>
      </Link>
      <Link href="/admin/recipes/failed" passHref>
        <ListItem button divider>
          <ListItemText primary="Failed Recipes" />
        </ListItem>
      </Link>
    </List>
  );
}
