import { Roles } from "@src/types";
import { useQuery } from "react-query";
import { useUserContext } from "@src/contexts/user";
import { PropsWithChildren, useEffect } from "react";
import { networkRequest } from "@src/utils/network-request";
import { AppBar, Toolbar, Typography, Container } from "@mui/material";

export function Layout(props: PropsWithChildren<{}>) {
  const userContext = useUserContext();
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

  useEffect(() => {
    const minutes =
      parseInt(process.env.NEXT_PUBLIC_ACCESS_TOKEN_JWT_EXPIRE!) - 1;
    const timeout = 1000 * 60 * minutes;
    let interval = setInterval(refreshTokensQuery.refetch, timeout);
    return function () {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <AppBar position="static">
        <Container>
          <Toolbar sx={{ justifyContent: " space-between" }}>
            <Typography>MealBase Lite</Typography>
            <Typography>{userContext.email || "Unknown"}</Typography>
          </Toolbar>
        </Container>
      </AppBar>
      <Container sx={{ pt: { xs: 2, sm: 4 } }}>{props.children}</Container>
    </>
  );
}
