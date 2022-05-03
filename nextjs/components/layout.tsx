import { AppBar, Toolbar, Typography, Container } from "@mui/material";
import { PropsWithChildren } from "react";

export function Layout(props: PropsWithChildren<{}>) {
  return (
    <>
      <AppBar position="static">
        <Container>
          <Toolbar>
            <Typography>MealBase Lite</Typography>
          </Toolbar>
        </Container>
      </AppBar>
      <Container>{props.children}</Container>
    </>
  );
}
