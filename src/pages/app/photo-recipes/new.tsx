import { CloudinaryImage } from "@src/db/photo-recipes";
import React, { useState } from "react";
import { PhotoRecipeForm } from "@src/forms/photo-recipes";
import { Grid, Typography } from "@mui/material";

export default function NewPhotoRecipePage() {
  const [images, setImages] = useState<(File | CloudinaryImage)[]>([]);

  /**
   * Submit form to server. If slideshow prop was provided, edit existing slideshow,
   * else, create a new slideshow.
   */
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {}

  return (
    <>
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <Typography variant="body1">New Photo Recipe</Typography>
          <Typography variant="body2">
            Take pictures of physical recipes, and upload them here.
          </Typography>
        </Grid>
        <Grid item>
          <PhotoRecipeForm />
        </Grid>
      </Grid>
    </>
  );
}
