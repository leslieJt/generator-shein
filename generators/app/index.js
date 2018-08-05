'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const path = require('path');
const JSON5 = require('json5');
const fs = require('fs');
const { promisify } = require('util');
const isValidate = require('./utils/validate');
const generate = require('./utils/generate');

const readFile = promisify(fs.readFile);

module.exports = class extends Generator {
  // eslint-disable-next-line no-useless-constructor
  constructor(args, opts) {
    super(args, opts);
  }

  async prompting() {
    // Have Yeoman greet the user.
    this.log(yosay(`Welcome to the impressive ${chalk.red('generator-shein')} generator!`));

    this.log(
      `${chalk.green(
        '?'
      )} 😎 当前目录是否为项目根目录?若是，则直接会车；若否，则请输入项目路径(绝对/相对地址)`
    );
    let { root } = await this.prompt([
      {
        type: 'input',
        name: 'root',
        message: '∫',
        default: this.contextRoot
      }
    ]);
    root = path.resolve(root);
    const componentPath = path.resolve(root, 'src/component');

    let { templatePath } = await this.prompt({
      type: 'input',
      name: 'templatePath',
      message: '😀 请输入您要生成功能的模版路径(绝对/相对地址)',
      default: './template.json5'
    });
    templatePath = path.resolve(root, templatePath);

    const validation = await isValidate(root, templatePath);

    if (validation.error) {
      throw new Error(`请输入有效的路径地址😡: ${JSON.stringify(validation.error)}`);
    }

    let { routerName } = await this.prompt({
      type: 'input',
      name: 'routerName',
      message: '🤔 请输入您要生成功能的路由名(支持嵌套)',
      required: true
    });
    if (!routerName) {
      throw new Error('请输入路由名!😡');
    }
    const routerPath = path.resolve(componentPath, routerName);

    let { subDirectory } = await this.prompt({
      type: 'input',
      name: 'subDirectory',
      message: '🙃 请输入您要生成的子文件夹名',
      default: 'list'
    });
    const subDirectoryPath = path.resolve(routerPath, subDirectory);
    const jsxPath = path.resolve(subDirectoryPath, 'jsx');

    this.config = {
      root,
      templatePath,
      routerName: routerName.replace(/^\w*\//, ''),
      routerPath,
      subDirectory,
      subDirectoryPath,
      jsxPath
    };
  }

  async writing() {
    this.config.template = JSON5.parse(await readFile(this.config.templatePath, 'utf8'));

    // Parse and generate
    await generate.call(this);
  }

  install() {
    // this.installDependencies();
  }

  end() {
    this.log(chalk.green('Everything is done, enjoy!'));
  }
};
