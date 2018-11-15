"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
/**
 * 加载环境配置文件
 *
 * @export
 * @param {string} [path='.env'] 配置文件所在路径
 */
function loadEnv(path) {
    if (path === void 0) { path = '.env'; }
    parse(fs.readFileSync(path, 'utf-8'));
}
exports.default = loadEnv;
/**
 * 解析env资源
 * @param {string} src 需要解析的.env
 */
function parse(src) {
    var res = {};
    console.log(src);
}
