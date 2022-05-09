import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useUserContext } from '@src/contexts/user';
import Link from 'next/link';
import LoginIcon from '@mui/icons-material/Login';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import AddBoxIcon from '@mui/icons-material/AddBox';
import InfoIcon from '@mui/icons-material/Info';
import LogoutIcon from '@mui/icons-material/Logout';

type Props = {
  onClose: () => void;
  open: boolean;
};

export function SideMenu(props: Props) {
  const userContext = useUserContext();
  return (
    <Drawer anchor="right" open={props.open} onClose={props.onClose}>
      <List sx={{ width: { xs: '100vw', sm: '300px' } }}>
        <ListItem button onClick={props.onClose}>
          <ListItemIcon>
            <CloseIcon />
          </ListItemIcon>
          <ListItemText primary="Close" />
        </ListItem>
        <Divider sx={{ mt: 2, mb: 2 }} />
        {!userContext.isLoggedIn && (
          <>
            <Link href="/login">
              <ListItem button>
                <ListItemIcon>
                  <LoginIcon />
                </ListItemIcon>
                <ListItemText primary="Login" />
              </ListItem>
            </Link>
            <Link href="/register">
              <ListItem button>
                <ListItemIcon>
                  <AccountCircleIcon />
                </ListItemIcon>
                <ListItemText primary="Register" />
              </ListItem>
            </Link>
            <Divider sx={{ mt: 2, mb: 2 }} />
          </>
        )}
        <Link href="/browse">
          <ListItem button>
            <ListItemIcon>
              <LibraryBooksIcon />
            </ListItemIcon>
            <ListItemText primary="Browse Recipes" />
          </ListItem>
        </Link>
        <Link href="/add-recipe">
          <ListItem button>
            <ListItemIcon>
              <AddBoxIcon />
            </ListItemIcon>
            <ListItemText primary="Add Recipe" />
          </ListItem>
        </Link>
        <Link href="/">
          <ListItem button>
            <ListItemIcon>
              <InfoIcon />
            </ListItemIcon>
            <ListItemText primary="About MealBase" />
          </ListItem>
        </Link>
        {userContext.isLoggedIn && (
          <>
            <Divider sx={{ mt: 2, mb: 2 }} />
            <Link href="/account">
              <ListItem button>
                <ListItemIcon>
                  <AccountCircleIcon />
                </ListItemIcon>
                <ListItemText primary="Account" />
              </ListItem>
            </Link>
            <Link href="/logout">
              <ListItem button>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItem>
            </Link>
          </>
        )}
      </List>
    </Drawer>
  );
}
