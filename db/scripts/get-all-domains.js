const mongoose = require('mongoose');
const { Browser, chromium } = require('playwright');

/**
 * This script is meant to return a list of unique domain names from all the recipes in the database.
 */

const Recipes = mongoose.model('Recipes', {
  url: {
    type: String,
    required: true,
    unique: true,
  },
  hash: {
    type: String,
    required: true,
    default: '',
  },
});
const HashSelectors = mongoose.model('DomainHashSelectors', {
  domain: {
    type: String,
    required: true,
  },
});

(async function () {
  await mongoose.connect('mongodb://192.168.1.2/mealbase-production');

  const recipes = await Recipes.find({});
  const selectors = await HashSelectors.find({}).lean();
  const browser = await chromium.launch();
  const page = await browser.newPage();

  let i = 0;
  const iMax = recipes.length;
  for (; i < iMax; ++i) {
    const _recipe = recipes[i];
    const domain = domainFromUrl(_recipe.url);
    const selector = selectors.find((s) => s.domain === domain);
    if (!_recipe.hash) {
      try {
        await page.goto(_recipe.url);
        await page.waitForLoadState();

        const result = await page.evaluate(async (hashSelector) => {
          // optionally, get the hash of the recipe so the URL can jump directly to the recipe.
          // ie: www.recipes.com/best-tacos#tasty-recipes-2301
          let hash = '';
          if (hashSelector) {
            if (!hashSelector.isDynamic) {
              hash = hashSelector.selector;
            } else {
              const _hash = document.querySelector(hashSelector.selector);
              if (_hash) {
                hash = '#' + _hash.id;
              }
            }
          }

          return {
            hash: hash,
          };
        }, selector);
        console.log(`Recipe #${i}`);
        console.log(selector);
        console.log(result);
        console.log(_recipe.url);
        console.log(result.hash);
        console.log('');
        _recipe.hash = result.hash;
        await _recipe.save();
      } catch (err) {
        console.log('Error at:', _recipe.url);
        console.log(err);
        console.log('');
      }
    }
  }
  await browser.close();
  process.exit();
})();

// https://stackoverflow.com/a/34818545/4927236
function domainFromUrl(url) {
  let result = '';
  var match;
  if (
    (match = url.match(
      /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n\?\=]+)/im
    ))
  ) {
    result = match[1];
    if ((match = result.match(/^[^\.]+\.(.+\..+)$/))) {
      result = match[1];
    }
  }
  return result;
}
