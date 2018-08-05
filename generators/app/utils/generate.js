const prettier = require('prettier');
const renderFile = require('./render');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const prepare = require('./prepare');
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const chalk = require('chalk');
const _ = require('lodash');

const prettierConfig = {
  parser: 'babylon',
  singleQuote: true,
  printWidth: 100
};

const prettierSupportLanguages = ['.js', '.css', '.json', '.jsx'];

const isPrettierSupport = fileName => prettierSupportLanguages.find(l => fileName.endsWith(l));

const generate = async function(tpl, p, data, config = { skipEjs: false, skipPrettier: false }) {
  let content;
  if (config.skipEjs) {
    content = await readFile(this.templatePath(tpl), 'utf8');
  } else {
    content = await renderFile(this.templatePath(tpl), data);
  }

  if (!config.skipPrettier && isPrettierSupport(p)) {
    content = prettier.format(content, prettierConfig);
  }

  await writeFile(p, content);
  this.log(`${chalk.green('Created: ')}${path.basename(p)}`);
};

/**
 * Generate file from config
 */
module.exports = async function() {
  await prepare(this.config.routerPath, this.config.subDirectoryPath, this.config.jsxPath);

  this.config._ = _; // add lodash support

  const g = generate.bind(this);
  const s = n => path.join(this.config.subDirectoryPath, n);
  const x = n => path.join(this.config.jsxPath, n);

  await Promise.all([
    g('me.json', s('me.json'), null, {
      skipEjs: true,
      skipPrettier: true
    }),
    g('server.ejs', s('server.js'), this.config),
    g('saga.ejs', s('saga.js'), this.config),
    g('types.ejs', s('types.js'), this.config),
    g('reducer.ejs', s('reducer.js'), this.config),
    g('action.ejs', s('action.js'), this.config),
    g('view.ejs', s('view.jsx'), this.config),
    g('filters.ejs', x('filters.jsx'), this.config),
    g('tableView.ejs', x('tableView.jsx'), this.config)
  ]);
};
