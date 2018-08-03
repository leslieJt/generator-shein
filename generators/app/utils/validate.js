const fs = require('fs');
const { promisify } = require('util');

const exists = promisify(fs.exists);

// 验证路径信息是否正确
module.exports = async (...paths) => {
  const error = [];

  for (let p of paths) {
    // eslint-disable-next-line  no-await-in-loop
    if (!(await exists(p))) error.push(`${p} is not exists!`);
  }

  return error.length ? { error } : {};
};
