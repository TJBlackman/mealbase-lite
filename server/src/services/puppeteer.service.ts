import puppeteer from 'puppeteer-core';
import { RecipeRecord } from '../types/type-definitions';
import { cleanUrl } from '../utils/clean-url'

export const getRecipeData = async (url: string): Promise<RecipeRecord | boolean> => {
  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: process.env.CHROME_EXE_PATH,
      args: [
        '--disable-notifications',
        '--disable-gpu',
        '--no-sandbox',
        '--lang=en-US',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
      ]
    });
    const newUrl = cleanUrl(url);
    const page = await browser.newPage();
    await page.goto(newUrl);
    const data: RecipeRecord = await page.evaluate(() => new Promise((resolve, reject) => {
      try {
        const recipeData: any = {};
        const title: any = document.querySelector('[property="og:title"]');
        if (title) {
          recipeData.title = title.content;
        }
        const description: any = document.querySelector('[property="og:description"]');
        if (description) {
          recipeData.description = description.content;
        }
        const image: any = document.querySelector('[property="og:image"]');
        if (image) {
          recipeData.image = image.content;
        }
        const recipeURL: any = document.querySelector('[property="og:url"]');
        if (recipeURL) {
          recipeData.url = recipeURL.content;
        }
        const siteName: any = document.querySelector('[property="og:site_name"]');
        if (siteName) {
          recipeData.siteName = siteName.content;
        }
        resolve(recipeData);
      }
      catch (err) {
        reject(err);
      }
    }))
    await browser.close();
    data.url = url;
    return data;
  }
  catch (err) {
    console.log(err);
    if (browser.close) {
      await browser.close();
    }
    return false;
  }
}