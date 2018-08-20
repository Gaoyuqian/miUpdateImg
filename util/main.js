
/*
    添加所有node模块依赖
*/

const fs = require('fs')
const http = require('http')
const qs = require('querystring')
const path = require('path')
const _mime = require('mime')
const _mime2 = _interopRequireDefault(_mime)
const chalk = require('chalk')
function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }

module.exports = {
  fs, http, qs, path,_mime2,_mime,chalk
}
