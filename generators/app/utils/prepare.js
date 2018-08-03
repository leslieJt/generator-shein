const mkdirp = require('mkdirp-promise');

module.exports = async (...paths) => Promise.all(paths.map(p => mkdirp(p, { mode: '0777' })));
