/*
 * @Date                : 2020-07-31 17:25:07
 * @FilePath            : /yapi/server/utils/batchHtml/defaultTheme.js
 */
const fs = require('fs');
const sysPath = require('path');
const css = fs.readFileSync(sysPath.join(__dirname, './defaultTheme.css'));


const js = fs.readFileSync(sysPath.join(__dirname, './defaultexec.js'));

module.exports = '<style>' + css + '</style>' + '<script>' + js + '</script>';

