const fs = require("fs");
const dev = require("../dev");

module.exports = {
  load: async filename => {
    let p = new Promise((resolve, reject) => {
      fs.readFile(filename, { encoding: "UTF-8" }, function(err, data) {
        if (err) {
          reject(err);
        }
        if (data) {
          resolve(data.split("\n"));
        } else {
          reject("No data");
        }
      });
    });
    let out = await p;
    return out;
  }
};
