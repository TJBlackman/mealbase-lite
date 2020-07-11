// attempt at standardizing incoming recipe urls

export const cleanUrl = (url: string) => {
  return url.split('?')[0].trim().toLowerCase();
}