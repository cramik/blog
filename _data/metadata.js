const pathPrefix = process.env.PATH_PREFIX || "/";
const cleanPrefix = pathPrefix.startsWith("/") ? pathPrefix : "/" + pathPrefix;
const normalizedPrefix = cleanPrefix.replace(/\/$/, "");
const siteUrl = process.env.SITE_URL || ("https://cramik.github.io" + normalizedPrefix);

module.exports = {
  title: "Cramik",
  url: siteUrl,
  domain: process.env.SITE_URL ? new URL(process.env.SITE_URL).hostname : "cramik.github.io",
  description: "",
  genre: "Insert a schema.org genre",
  feed: {
    filename: "feed.xml",
    path: "/feed/feed.xml",
    id: siteUrl + "/"
  },
  jsonfeed: {
    path: "/feed/feed.json",
    url: `${siteUrl}/feed/feed.json`
  },
  author: {
    name: "Cramik"
  }
};
