const prettier = require('prettier');
const renderFile = require('./render');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const prepare = require('./prepare');
const writeFile = promisify(fs.writeFile);
const chalk = require('chalk');

const prettierConfig = {
  parser: 'babylon',
  singleQuote: true,
  printWidth: 100
};

const prettierSupportLanguages = ['.js', '.css', '.json'];

const isPrettierSupport = fileName => prettierSupportLanguages.find(l => fileName.endsWith(l));

const generate = async function(tpl, p, config) {
  let content = await renderFile(this.templatePath(tpl), config);

  if (isPrettierSupport(tpl)) {
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

  await generate.call(
    this,
    'server.js',
    path.join(this.config.routerPath, 'server.js'),
    this.config
  );
};
