const readline = require('readline');
const chalk = require('chalk');
const padStart = require('string.prototype.padstart');

exports.events = new EventEmitter();

function _log (type, tag, message) {
    // process.env.VUE_CLI_API_MODE &&
    if (message) {
        exports.events.emit('log', {
            message,
            type,
            tag
        })
    }
}

/**
 * 格式化
 * @param {string} label 
 * @param {string} msg 
 */
const format = (label, msg) => {
    return msg.split('\n').map((line, i) => {
      return i === 0
        ? `${label} ${line}`
        : padStart(line, chalk.reset(label).length)
    }).join('\n');
}

const chalkTag = msg => chalk.bgBlackBright.white.dim(` ${msg} `)

exports.clearConsole = title => {
    // 如果当前有打开终端（tty）
    if (process.stdout.isTTY) {
        const blank = '\n'.repeat(process.stdout.rows);
        console.log(blank);
        // 将光标移动至 出事位置 x: 0, y: 0
        readline.cursorTo(process.stdout, 0 , 0);
        readline.clearScreenDown(process.stdout);
        if (title) {
            console.log(title);
        }
    }
}

exports.error = (msg, tag = null) => {
    console.log(
        format(chalk.bgRed(' ERROR ') + (tag ? chalkTag(tag) : ''), chalk.red(msg))
    );
    _log('error', tag, msg);
    if (msg instanceof Error) {
        console.error(msg.stack);
        _log('error', tag, msg.stack);
    }
}