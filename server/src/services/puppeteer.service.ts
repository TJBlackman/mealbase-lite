import puppeteer from 'puppeteer-core';
import { RecipeRecord } from '../types/type-definitions';

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
    const urlSansQueryParams = url.split('?')[0].trim();
    const page = await browser.newPage();
    await page.goto(urlSansQueryParams);
    const data: RecipeRecord = await page.evaluate(() => new Promise((resolve, reject) => {
      try {
        const data: any = {};
        const title: any = document.querySelector('[property="og:title"]');
        if (title) {
          data.title = title.content;
        }
        const description: any = document.querySelector('[property="og:description"]');
        if (description) {
          data.description = description.content;
        }
        const image: any = document.querySelector('[property="og:image"]');
        if (image) {
          data.image = image.content;
        }
        const url: any = document.querySelector('[property="og:url"]');
        if (url) {
          data.url = url.content;
        }
        const siteName: any = document.querySelector('[property="og:site_name"]');
        if (siteName) {
          data.siteName = siteName.content;
        }
        resolve(data);
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