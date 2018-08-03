const prettier = require('prettier');
const renderFile = require('./render');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const prepare = require('./prepare');
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const chalk = require('chalk');

const prettierConfig = {
  parser: 'babylon',
  singleQuote: true,
  printWidth: 100
};

const prettierSupportLanguages = ['.js', '.css', '.json'];

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
  this.log(`${chalk.green('Created: ')}${tpl}`);
};

/**
 * Generate file from config
 */
module.exports = async function() {
  await prepare(this.config.routerPath, this.config.subDirectoryPath);

  await Promise.all([
    generate.call(this, 'server.ejs', path.join(this.config.routerPath, 'server.js'), this.config),
    generate.call(this, 'me.json', path.join(this.config.subDirectoryPath, 'me.json'), null, {
      skipEjs: true,
      skipPrettier: true
    }),
    generate.call(
      this,
      'saga.ejs',
      path.join(this.config.subDirectoryPath, 'saga.js'),
      this.config
    ),
    generate.call(
      this,
      'types.ejs',
      path.join(this.config.subDirectoryPath, 'types.js'),
      this.config
    ),
    generate.call(
      this,
      'reducer.ejs',
      path.join(this.config.subDirectoryPath, 'reducer.js'),
      this.config
    )
  ]);
};
