
/*
    添加所有node模块依赖
*/

const fs = require('fs')
const http = require('http')
const qs = require('querystring')
const path = require('path')
const conf = require('./../miuiFile.json')
const chalk = require('chalk')
module.exports = {
    fs,http,qs,path,conf,chalk
}