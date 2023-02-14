import { Recipe } from "@src/db/recipes";
import {
  Typography,
  Container,
  Alert,
  TextField,
  Grid,
  Toolbar,
  Button,
  CircularProgress,
} from "@mui/material";
import { useState, FormEvent, useEffect } from "react";
import { RecipeCard } from "@src/components/recipe-card";
import { useMutation } from "react-query";
import { networkRequest } from "@src/utils/network-request";
import { useRouter } from "next/router";

export default function AdminCreateRecipe() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [img, setImg] = useState("");
  const [url, setUrl] = useState("");
  const [hash, setHash] = useState("");
  const [siteName, setSiteName] = useState("");

  // API mutation
  const mutation = useMutation((payload: Recipe) =>
    networkRequest({
      url: `/api/admin/recipes`,
      method: "POST",
      body: payload,
    })
  );

  // handle form submit
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    mutation.mutate(
      {
        title,
        description,
        image: img,
        url,
        hash,
        siteName,
      },
      {
        onSuccess: () => {
          setTimeout(() => {
            router.replace(router.asPath);
          }, 3000);
        },
      }
    );
  }

  function reset() {
    setTitle("");
    setDescription("");
    setImg("");
    setUrl("");
    setSiteName("");
    setHash("");
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h5" component="h1" paragraph>
        Manually Create Recipe
      </Typography>
      <Grid container spacing={2} alignItems="flex-start">
        <Grid item xs={12} sm={6}>
          <form onSubmit={handleSubmit}>
            <TextField
              sx={{ mb: 2 }}
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              variant="outlined"
            />
            <TextField
              sx={{ mb: 2 }}
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              variant="outlined"
              multiline
              maxRows={5}
              minRows={2}
            />
            <TextField
              sx={{ mb: 2 }}
              label="Image URL"
              value={img}
              onChange={(e) => setImg(e.target.value)}
              fullWidth
              variant="outlined"
            />
            <TextField
              sx={{ mb: 2 }}
              label="Recipe URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              fullWidth
              variant="outlined"
            />
            <TextField
              sx={{ mb: 2 }}
              label="Hash"
              value={hash}
              onChange={(e) => setHash(e.target.value)}
              fullWidth
              variant="outlined"
            />
            <TextField
              sx={{ mb: 2 }}
              label="Site Name"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              fullWidth
              variant="outlined"
            />
            {mutation.isError && (
              <Alert severity="error">An error occurred.</Alert>
            )}
            <Toolbar disableGutters>
              <Button
                type="submit"
                variant="contained"
                sx={{ mr: 2 }}
                disabled={mutation.isLoading}
              >
                {mutation.isLoading ? (
                  <CircularProgress size={20} color="primary" />
                ) : (
                  "Submit"
                )}
              </Button>
              <Button
                type="button"
                onClick={reset}
                disabled={mutation.isLoading}
              >
                Reset
              </Button>
            </Toolbar>
            {mutation.isSuccess && <Alert severity="success">Success!</Alert>}
          </form>
        </Grid>
        <Grid item xs={12} sm={6} container justifyContent="center">
          <RecipeCard
            recipe={{
              _id: "0",
              title,
              description,
              image: img,
              url,
              siteName,
              deleted: false,
              isLiked: false,
              createdAt: new Date(),
              updatedAt: new Date(),
              likes: 0,
              addedByUser: "",
            }}
            isPreview
          />
        </Grid>
      </Grid>
    </Container>
  );
}
