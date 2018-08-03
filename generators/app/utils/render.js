const ejs = require('ejs');

// Ejs renderFile to Promise version
module.exports = (filename, data, options = { escape: false }) =>
  new Promise((resolve, reject) => {
    ejs.renderFile(filename, data, options, (err, str) => {
      if (err) {
        reject(err);
      } else {
        resolve(str);
      }
    });
  });
