const { JSDOM } = require("jsdom");

async function crawlPage(baseURL, currentURL, pages) {
  const baseURLObj = new URL(baseURL);
  const currentURLObj = new URL(currentURL);
  if (baseURLObj.hostname !== currentURLObj.hostname) {
    return pages;
  }

  const normalizeCurrentURL = normalizeURL(currentURLObj);
  if (pages[normalizeCurrentURL] > 0) {
    pages[normalizeCurrentURL]++;
    return pages;
  }

  pages[normalizeCurrentURL] = 1;

  console.log("Crawling: " + currentURL);
  try {
    const response = await fetch(currentURL);
    if (response.status > 399) {
      console.log("Error while fetching with status code:" + response.status);
      return pages;
    }
    if (!response.headers.get("content-type").includes("text/html")) {
      console.log(
        "Error while fetching with content-type: " +
          response.headers.get("content-type")
      );
      return pages;
    }
    const htmlBody = await response.text();

    nextURLs = getURLSfromHTML(htmlBody, baseURL);

    for (const nextURL of nextURLs) {
      pages = await crawlPage(baseURL, nextURL, pages);
    }
  } catch (e) {
    console.log("Error while fetching page: " + e.message);
  }
  return pages;
}

function getURLSfromHTML(htmlBody, baseURL) {
  urls = [];
  const dom = new JSDOM(htmlBody);
  const linksElements = dom.window.document.querySelectorAll("a");
  for (const link of linksElements) {
    if (link.href.slice(0, 1) === "/") {
      // relative URL
      try {
        const urlObj = new URL(baseURL + link.href);
        urls.push(urlObj.href);
      } catch (err) {
        console.log(`Error with relavive URL: ${err.message}`);
      }
    } else if (link.href.slice(0, 1) === ".") {
      try {
        const urlObj = new URL(baseURL + link.href.slice(2, link.href.length));
        urls.push(urlObj.href);
      } catch (err) {
        console.log(`Error with relavive URL: ${err.message}`);
      }
    } else {
      // absolute URL
      try {
        const urlObj = new URL(link.href);
        urls.push(urlObj.href);
      } catch (err) {
        console.log(`Error with absolute URL: ${err.message}`);
      }
    }
  }
  return urls;
}

function normalizeURL(urlString) {
  // url constructor handle caplock sensitivity
  const urlObj = new URL(urlString);
  const hostpath = `${urlObj.hostname}${urlObj.pathname}`;
  if (hostpath.length > 0 && hostpath.slice(-1) === "/") {
    return hostpath.slice(0, -1);
  }
  return hostpath;
}

module.exports = {
  normalizeURL,
  getURLSfromHTML,
  crawlPage,
};
