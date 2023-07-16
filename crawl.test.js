const { normalizeURL, getURLSfromHTML } = require("./crawl.js");
const { test, expect } = require("@jest/globals");

test("normalizeURL strip protocol", () => {
  const input = "https://blog.boot.dev/path";
  const actual = normalizeURL(input);
  const expected = "blog.boot.dev/path";
  expect(actual).toEqual(expected);
});

test("normalizeURL strip trailing slash", () => {
  const input = "https://blog.boot.dev/path/";
  const actual = normalizeURL(input);
  const expected = "blog.boot.dev/path";
  expect(actual).toEqual(expected);
});

test("normalizeURL capitals", () => {
  const input = "https://BLOG.boot.dev/path/";
  const actual = normalizeURL(input);
  const expected = "blog.boot.dev/path";
  expect(actual).toEqual(expected);
});

test("normalizeURL http", () => {
  const input = "http://BLOG.boot.dev/path/";
  const actual = normalizeURL(input);
  const expected = "blog.boot.dev/path";
  expect(actual).toEqual(expected);
});

test("get URLS from HTML absolute", () => {
  const inputHTMLBody = `
  <html>
    <body>
      <a href="https://blog.boot.dev/path/">Boot.dev Blog</a>
    </body>
  </html>
  `;
  const inputBaseURL = "https://blog.boot.dev/path/";
  const actual = getURLSfromHTML(inputHTMLBody, inputBaseURL);
  const expected = ["https://blog.boot.dev/path/"];
  expect(actual).toEqual(expected);
});

test("get URLS from HTML relative", () => {
  const inputHTMLBody = `
  <html>
    <body>
      <a href="/path/">Boot.dev Blog</a>
    </body>
  </html>
  `;
  const inputBaseURL = "https://blog.boot.dev";
  const actual = getURLSfromHTML(inputHTMLBody, inputBaseURL);
  const expected = ["https://blog.boot.dev/path/"];
  expect(actual).toEqual(expected);
});

test("get URLS from HTML multiple links", () => {
  const inputHTMLBody = `
  <html>
    <body>
      <a href="/path1/">Boot.dev Blog</a>
      <a href="https://blog.boot.dev/path2/">Boot.dev Blog</a>
    </body>
  </html>
  `;
  const inputBaseURL = "https://blog.boot.dev";
  const actual = getURLSfromHTML(inputHTMLBody, inputBaseURL);
  const expected = [
    "https://blog.boot.dev/path1/",
    "https://blog.boot.dev/path2/",
  ];
  expect(actual).toEqual(expected);
});

test("invalid URL", () => {
  const inputHTMLBody = `
  <html>
    <body>
      <a href="invalid">Boot.dev Blog</a>
    </body>
  </html>
  `;
  const inputBaseURL = "https://blog.boot.dev";
  const actual = getURLSfromHTML(inputHTMLBody, inputBaseURL);
  const expected = [];
  expect(actual).toEqual(expected);
});
