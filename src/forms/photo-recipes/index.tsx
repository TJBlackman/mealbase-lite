import React, { useState, useEffect } from "react";
import { CloudinaryImage } from "@src/db/photo-recipes";
import { useDropzone } from "react-dropzone";
import {
  Box,
  Typography,
  Grid,
  TextField,
  IconButton,
  RadioGroup,
  FormControlLabel,
  Radio,
  Toolbar,
  Button,
  Dialog,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { uploadToCloudinary } from "@src/utils/cloudinary/unsigned-upload";
import { useMutation } from "react-query";
import { networkRequest } from "@src/utils/network-request";

export function PhotoRecipeForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState<"private" | "public">("public");
  const [images, setImages] = useState<(File | CloudinaryImage)[]>([]);
  const [deletedImages, setDeletedImages] = useState<string[]>([]); // images hosted on cloudinary, that need to be deleted

  const mutation = useMutation(
    (payload: {
      title: string;
      description: string;
      images: CloudinaryImage[];
      isPrivate: boolean;
    }) =>
      networkRequest({
        url: "/api/photo-recipes",
        method: "POST",
        body: payload,
      })
  );

  /**
   * User is adding local images.
   *  - Filter out any previously added images with the same name.
   */
  function addLocalImages(newImages: File[]) {
    const filtered = images.filter((img1) => {
      if (img1 instanceof File) {
        return newImages.some((img2) => img1.name !== img2.name);
      }
      return true;
    });
    setImages([...filtered, ...newImages]);
  }

  /**
   * Upload images to Cloudinary, then put their CloudinaryImage objects
   * into the array in the correct spot they were in.
   */
  async function uploadCloudinaryImages() {
    const cloudinaryImages: CloudinaryImage[] = [];
    const uploadPromises: Promise<CloudinaryImage>[] = [];
    const placeholderIndex: number[] = [];
    let i = 0;
    const iMax = images.length;
    for (; i < iMax; ++i) {
      const _img = images[i];
      if (_img instanceof File) {
        const promise = uploadToCloudinary(_img);
        uploadPromises.push(promise);
        placeholderIndex.push(i);
      } else {
        cloudinaryImages.push(_img);
      }
    }

    const uploads = await Promise.all(uploadPromises);

    // loop over placeholder indexes, and put Cloudinary data back into the correct spot in the array
    placeholderIndex.forEach((item, index) => {
      const cloudinaryData = uploads[index];
      cloudinaryImages.splice(item, 0, cloudinaryData);
    });

    // save uploaded images so we don't have to upload them multipe times, if the form submission fails.
    setImages(cloudinaryImages);

    return cloudinaryImages;
  }

  /**
   * Delete an image, which could be a File object or a CloudinaryImage object
   * - If it's a local file, just delete it.
   * - If it's a CloudinaryImage, the server must be told to delete it from Cloudinary
   */
  function deleteImage(image: File | CloudinaryImage) {
    const filtered = images.filter((_img) => {
      if (_img instanceof File) {
        return image instanceof File ? _img.name !== image.name : true;
      } else {
        if (image instanceof File) {
          return true;
        } else {
          if (_img.public_id === image.public_id) {
            setDeletedImages([...deletedImages, image.public_id]);
            return false;
          }
          return true;
        }
      }
    });
    setImages(filtered);
  }

  // Dropzone setup
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: addLocalImages,
    multiple: true,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/heic": [".heic", ".heif"],
      "image/webp": [".webp"],
    },
  });

  /**
   * Submit form to server. If slideshow prop was provided, edit existing slideshow,
   * else, create a new slideshow.
   */
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const images = await uploadCloudinaryImages();
    } catch (err) {}
  }

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          variant="standard"
          fullWidth
        />
      </Box>
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          variant="standard"
          fullWidth
        />
      </Box>
      <Box sx={{ mb: 2 }}>
        <RadioGroup
          value={isPrivate}
          onChange={(e) => setIsPrivate(e.target.value as "private" | "public")}
        >
          <FormControlLabel
            value="public"
            control={<Radio />}
            label="This is public."
          />
          <FormControlLabel
            value="private"
            control={<Radio />}
            label="This is private."
          />
        </RadioGroup>
      </Box>
      <Box sx={{ mb: 2 }}>
        <Box
          {...getRootProps()}
          sx={{
            backgroundColor: "rgba(0,0,0,0.05)",
            p: 2,
            mb: 2,
          }}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <Typography variant="body2" sx={{ textAlign: "center" }}>
              Drop the files here!
            </Typography>
          ) : (
            <Typography variant="body2" sx={{ textAlign: "center" }}>
              Drag-n-drop pictures here, or click to select files.
            </Typography>
          )}
        </Box>
        <Grid container spacing={1}>
          {images.map((file) => {
            const key = "name" in file ? file.name : file.public_id;
            return (
              <Grid item key={key}>
                <FileThumbnail
                  file={file}
                  onDelete={(filename) => deleteImage(filename)}
                />
              </Grid>
            );
          })}
        </Grid>
      </Box>
      <Box>
        <Toolbar disableGutters>
          <Button variant="contained" type="submit">
            Save
          </Button>
        </Toolbar>
      </Box>
    </form>
  );
}

/**
 *
 * @param props
 * @returns
 */
export function FileThumbnail(props: {
  file: File | CloudinaryImage;
  onDelete?: (filename: File | CloudinaryImage) => void;
  disabled?: boolean;
}) {
  const [showPreview, setShowPreview] = useState(false);
  const [url, setUrl] = useState("");

  // on mount, set URL, or create ObjectUrl
  useEffect(() => {
    if (props.file instanceof File) {
      const _url = URL.createObjectURL(props.file);
      setUrl(_url);

      return () => {
        URL.revokeObjectURL(_url);
      };
    }
    setUrl(props.file.secure_url);
  }, []);

  // call props.onDelete
  function onDelete(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    props.onDelete?.(props.file);
  }

  return (
    <>
      <Box sx={{ position: "relative" }}>
        {props.onDelete && !props.disabled && (
          <IconButton
            onClick={onDelete}
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 99,
              color: "common.white",
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
        <Box
          component="img"
          src={url}
          alt="User provided image"
          sx={{
            display: "block",
            width: "auto",
            height: "200px",
            cursor: "pointer",
          }}
          onClick={() => setShowPreview(true)}
        />
      </Box>
      <Dialog fullScreen open={showPreview}>
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          sx={{
            height: "100%",
            position: "relative",
            backgroundColor: "rgba(0,0,0,0.92)",
          }}
        >
          <Grid item sx={{ maxHeight: "100%" }}>
            <Box
              component="img"
              src={url}
              alt="User provided image"
              sx={{
                maxHeight: "100%",
                maxWidth: "100%",
                display: "block",
                margin: "0 auto",
              }}
            />
          </Grid>
          <IconButton
            onClick={() => setShowPreview(false)}
            size="large"
            sx={{
              position: "absolute",
              bottom: 10,
              left: "45%",
              backgroundColor: "rgba(0,0,0,0.6)",
              color: "common.white",
            }}
          >
            <CloseIcon />
          </IconButton>
        </Grid>
      </Dialog>
    </>
  );
}
