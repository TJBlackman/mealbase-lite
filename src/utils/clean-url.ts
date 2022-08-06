// attempt at standardizing incoming recipe urls

export const cleanUrl = (url: string) => {
  let _url = url.split("?")[0].trim().toLowerCase();
  return _url;
};
