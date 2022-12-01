const siteUrl = 'https://test.cosmology.finance';
const siteAddress = new URL(siteUrl);
const canonical = siteAddress.href.slice(0, -1);
const title = 'Cosmology Coding Challenge';
const description = 'Web3 tooling for the Cosmos';
const fbAppId = null;
module.exports = {
  title,
  canonical,
  description,
  openGraph: {
    type: 'website',
    url: siteUrl,
    title,
    description,
    site_name: title,
    images: [
      {
        url: canonical + '/og/image.jpg',
        width: 942,
        height: 466,
        alt: title
      }
    ]
  },
  twitter: {
    handle: '@cosmology_tech',
    site: '@cosmology_tech'
  },
  facebook: fbAppId
    ? {
        appId: fbAppId
      }
    : undefined
};
