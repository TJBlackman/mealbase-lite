import { Browser, chromium } from "playwright";

/**
 * Uses playwright, the newer, better version of puppeteer, to scrape recipe details from a url.
 * @param url {string} URL of recipe to scrape
 * @returns Recipe data
 */
export async function scrapeRecipeData(
  url: string,
  hashSelector: {
    isDynamic: boolean;
    selector: string;
  } | null
) {
  let browser: Browser;
  try {
    browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForLoadState();
    const result = await page
      .evaluate(async (hashSelector) => {
        // scrape the title
        const title = document.querySelector<HTMLMetaElement>(
          '[property="og:title"]'
        );
        if (!title) {
          throw Error(
            `No element found with the select: [property="og:title"]`
          );
        }
        if (!title.content) {
          throw Error("Title meta tag has no content.");
        }

        // scrape the description
        const description = document.querySelector<HTMLMetaElement>(
          '[property="og:description"]'
        );
        if (!description) {
          throw Error(
            `No element found with the select: [property="og:description"]`
          );
        }
        if (!description.content) {
          throw Error("Description meta tag has no content.");
        }

        // scrape the title
        const image = document.querySelector<HTMLMetaElement>(
          '[property="og:image"]'
        );
        if (!image) {
          throw Error(
            `No element found with the select: [property="og:image"]`
          );
        }
        if (!image.content) {
          throw Error("Image meta tag has no content.");
        }

        // scrape the recipe URL
        const recipeURL = document.querySelector<HTMLMetaElement>(
          '[property="og:url"]'
        );
        if (!recipeURL) {
          throw Error(`No element found with the select: [property="og:url"]`);
        }
        if (!recipeURL.content) {
          throw Error("Image meta tag has no content.");
        }

        // scrape the site name
        const siteName = document.querySelector<HTMLMetaElement>(
          '[property="og:site_name"]'
        );
        if (!siteName) {
          throw Error(
            `No element found with the select: [property="og:site_name"]`
          );
        }
        if (!siteName.content) {
          throw Error("Image meta tag has no content.");
        }

        // optionally, get the hash of the recipe so the URL can jump directly to the recipe.
        // ie: www.recipes.com/best-tacos#tasty-recipes-2301
        let hash = "";
        if (hashSelector) {
          if (!hashSelector.isDynamic) {
            hash = hashSelector.selector;
          } else {
            const _hash = document.querySelector(hashSelector.selector);
            if (_hash) {
              hash = "#" + _hash.id;
            }
          }
        }

        return {
          description: description.content,
          image: image.content,
          siteName: siteName.content,
          title: title.content,
          url: recipeURL.content,
          hash: hash,
        };
      }, hashSelector)
      .catch((err) => {
        console.log(err);
        throw Error(err.message);
      });

    browser.close();
    return result;
  } catch (err) {
    // @ts-ignore
    if (browser) {
      browser?.close?.();
    }
    console.log(err);
    throw Error((err as Error).message);
  }
}
