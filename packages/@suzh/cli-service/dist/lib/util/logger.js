"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = require("chalk");
// import readline from 'readline';
var chalkTag = function (msg) { return chalk_1.default.bgBlackBright.white.dim(" " + msg + " "); };
// 格式化输出
var format = function (label, msg) {
    return msg
        .split('\n')
        .map(function (line, i) {
        return i === 0
            ? label + " " + line
            : line.padStart(chalk_1.default.reset(label).length);
    })
        .join('\n');
};
/**
 * 打印错误
 * @param msg string
 * @param tag string
 */
function error(msg, tag) {
    if (tag === void 0) { tag = null; }
    console.log(format(chalk_1.default.bgRed(' ERROR ') + (tag ? chalkTag(tag) : ''), chalk_1.default.red(msg)));
}
exports.error = error;
