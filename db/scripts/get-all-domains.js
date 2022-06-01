const mongoose = require("mongoose");

/**
 * This script is meant to return a list of unique domain names from all the recipes in the database.
 */

const Recipes = mongoose.model("Recipes", {
  url: {
    type: String,
    required: true,
    unique: true,
  },
});
const HashSelectors = mongoose.model("DomainHashSelectors", {
  domain: {
    type: String,
    required: true,
  },
});

(async function () {
  await mongoose.connect("mongodb://192.168.1.2/mealbase-production");

  const all = await Recipes.find({});
  const domains = all.reduce((acc, item) => {
    const domain = domain_from_url(item.url);
    if (acc.indexOf(domain) < 0) {
      acc.push(domain);
    }
    return acc;
  }, []);
  console.log(domains);

  let i = 0;
  const iMax = domains.length;
  for (; i < iMax; ++i) {
    const _domain = domains[i];
    const record = await HashSelectors.findOne({ domain: _domain });
    console.log(_domain, record);
    if (!record) {
      const newRecord = new HashSelectors({
        domain: _domain,
        selector: "",
      });
      await newRecord.save();
      console.log("saved new domain: ", _domain);
    }
  }
  process.exit();
})();

// https://stackoverflow.com/a/34818545/4927236
function domain_from_url(url) {
  var result;
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
