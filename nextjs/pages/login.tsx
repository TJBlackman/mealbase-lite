import {
  Typography,
  Box,
  Container,
  TextField,
  Toolbar,
  Button,
  Link as MuiLink,
} from "@mui/material";
import Link from "next/link";

export default function () {
  return (
    <Box mt={4}>
      <Container maxWidth="sm">
        <Typography variant="h5" component="h1">
          Login
        </Typography>
        <Typography paragraph>Please use the form below to log in.</Typography>
        <form>
          <TextField label="Email Address" fullWidth sx={{ mb: 2 }} />
          <TextField label="Password" type="password" fullWidth />
          <Toolbar disableGutters>
            <Button type="submit" variant="contained" sx={{ mr: 2 }}>
              Submit
            </Button>
            <Button type="button">Reset</Button>
          </Toolbar>
        </form>

        <Typography variant="body2">
          Don't have an account?{" "}
          <Link href="/register" passHref>
            <MuiLink sx={{ textDecoration: "underline" }}>Sign Up!</MuiLink>
          </Link>
        </Typography>
      </Container>
    </Box>
  );
}
