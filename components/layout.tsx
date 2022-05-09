import { Roles } from "@src/types";
import { useQuery } from "react-query";
import { useUserContext } from "@src/contexts/user";
import { PropsWithChildren, useEffect, useState } from "react";
import { networkRequest } from "@src/utils/network-request";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  IconButton,
  Link as MuiLink,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";
import { SideMenu } from "./side-menu";
import { useRouter } from "next/router";

export function Layout(props: PropsWithChildren<{}>) {
  const userContext = useUserContext();
  const router = useRouter();
  const [sideMenuIsOpen, setSideMenuIsOpen] = useState(true);

  const refreshTokensQuery = useQuery(
    "refresh-tokens",
    () =>
      networkRequest<{ email: string; roles: Roles[] }>({
        url: "/api/auth/refresh-tokens",
      }),
    {
      onSuccess: (data) => {
        userContext.setUser({
          email: data.email,
          roles: data.roles,
        });
      },
      onError: (err) => {
        let msg =
          "An unknown error occurred while attempting to refresh tokens.";
        if (err instanceof Error) {
          msg = err.message;
        }
        console.error(msg);
      },
    }
  );

  // refresh auth tokens every n minutes
  useEffect(() => {
    if (userContext.isLoggedIn) {
      const minutes =
        parseInt(process.env.NEXT_PUBLIC_ACCESS_TOKEN_JWT_EXPIRE!) - 1;
      const timeout = 1000 * 60 * minutes;
      let interval = setInterval(refreshTokensQuery.refetch, timeout);
      return function () {
        clearInterval(interval);
      };
    }
  }, [userContext.isLoggedIn]);

  // on url changes, close menu
  useEffect(() => {
    if (sideMenuIsOpen) {
      setSideMenuIsOpen(false);
    }
  }, [router.pathname]);

  return (
    <>
      <AppBar position="static">
        <Container>
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Link href="/browse">
              <MuiLink
                sx={{
                  color: "common.white",
                  textDecoration: "none",
                  cursor: "pointer",
                }}
              >
                MealBase Lite
              </MuiLink>
            </Link>
            <Toolbar>
              {userContext.isLoggedIn && (
                <Link href="/account" passHref>
                  <MuiLink
                    sx={{
                      color: "common.white",
                      textDecoration: "none",
                      mr: 2,
                    }}
                    variant="body2"
                  >
                    {userContext.email}
                  </MuiLink>
                </Link>
              )}
              {!userContext.isLoggedIn && (
                <>
                  <Link href="/login" passHref>
                    <MuiLink
                      sx={{
                        color: "common.white",
                        textDecoration: "none",
                        mr: 2,
                      }}
                      variant="body2"
                    >
                      Login
                    </MuiLink>
                  </Link>
                  <Link href="/register" passHref>
                    <MuiLink
                      sx={{
                        color: "common.white",
                        textDecoration: "none",
                        mr: 2,
                      }}
                      variant="body2"
                    >
                      Register
                    </MuiLink>
                  </Link>
                </>
              )}
              <IconButton onClick={() => setSideMenuIsOpen(true)}>
                <MenuIcon sx={{ color: "common.white" }} />
              </IconButton>
            </Toolbar>
          </Toolbar>
        </Container>
      </AppBar>
      <Container sx={{ pt: { xs: 2, sm: 4 } }}>{props.children}</Container>
      <SideMenu
        open={sideMenuIsOpen}
        onClose={() => setSideMenuIsOpen(false)}
      />
    </>
  );
}
