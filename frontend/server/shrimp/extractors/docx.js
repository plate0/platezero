
module.exports = {
  load: async filename => {
    // Read document.xml from docx document
    const AdmZip = require("adm-zip");
    const zip = new AdmZip(filename);
    const xml = zip.readAsText("word/document.xml");
    // Load xml DOM
    const cheerio = require("cheerio");
    $ = cheerio.load(xml, {
      normalizeWhitespace: true,
      xmlMode: true
    });
    let out = new Array();
    $("w\\:t").each((i, el) => {
      out.push($(el).text());
    });
    return out;
  }
};
