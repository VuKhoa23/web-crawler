const { crawlPage } = require("./crawl.js");

async function main() {
  if (process.argv.length != 3) {
    console.log("Error: Invalid arguments");
    process.exit(1);
  }
  const baseURL = process.argv[2];
  console.log(baseURL);
  const pages = await crawlPage(baseURL, baseURL, {});
  for (const page of Object.entries(pages)) {
    console.log(pages);
  }
}

main();
