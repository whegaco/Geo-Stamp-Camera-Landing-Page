const fs = require('fs');
const { XMLParser, XMLValidator} = require('fast-xml-parser');
const xml = fs.readFileSync('public/sitemap.xml', 'utf8');
const result = XMLValidator.validate(xml);
if (result === true) {
  console.log('XML is valid');
} else {
  console.error('XML is invalid:', result.err);
}
