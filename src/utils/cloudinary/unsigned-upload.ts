import { CloudinaryImage } from "@src/db/photo-recipes";

/**
 * Upload an image to Clousinary for storage
 * @param image A file or a URL to a publicly available image.
 * @returns A promise that resolves with the data from Cloudinary.
 */
export async function uploadToCloudinary(image: File) {
  const formData = new FormData();

  // append the file or the URL to the image
  formData.append("file", image);

  // append the cloudinary upload preset name name
  formData.append(
    "upload_preset",
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_NAME!
  );

  const result = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data: CloudinaryImage = await result.json();
  return data;
}
