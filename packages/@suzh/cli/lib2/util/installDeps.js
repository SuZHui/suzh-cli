const EventEmitter = require('events');
const readline = require('readline');
const chalk = require('chalk');

const shouldUseTaobao = require('./shouldUseTaobao');
const registries = require('./registries');

// 淘宝源
const taobaoDistURL = 'https://npm.taobao.org/dist';

class InstallProgress extends EventEmitter {
    constructor() {
        super();

        this._progress = -1;
    }

    get progress() {
        return this._progress;
    }

    set progress(value) {
        this._progress = value;
        this.emit('progress', value);
    }

    get enabled() {
        return this._progress !== -1;
    }

    set enabled(value) {
        this.progress = value ? 0 : -1;
    }

    log(value) {
        this.emit('log', value);
    }
}

const progress = exports.progress = new InstallProgress();

// 到行开始的地方
function toStartOfLine(stream) {
    if (!chalk.supportsColor) {
        stream.write('\r');
        return;
    }
    readline.cursorTo(stream, 0);
}

/**
 * 渲染进度条
 * @param {number} curr 当前进度 
 * @param {number} total 总进度
 */
function renderProgressBar(curr, total) {
    // 比例
    const ratio = Math.min(Math.max(curr / total, 0), 1);
    const bar = ` ${curr}/${total}`;
    // 可用空间(控制台每行剩余空间)
    const availableSpace = Math.max(0, process.stderr.columns - bar.length - 3);
    // 宽度
    const width = Math.min(total, availableSpace);
    // 当前完成长度
    const completeLength = Math.round(width * ratio);
    // 用#填充进度条
    const complete = '#'.repeat(completeLength);
    // 用-填充未完成进度条
    const incomplete = '-'.repeat(width - completeLength);
    toStartOfLine(process.stderr);
    process.stderr.write(`[${complete}${incomplete}]${bar}`);
}

/**
 * 参数中加入仓库镜像地址及配置项
 * @param {string} command 命令
 * @param {string[]} args 参数
 * @param {string} cliRegistry 仓库地址
 */
function addRegistryToArgs(command, args, cliRegistry) {
    // string 当前仓库
    const altRegistry = (
        cliRegistry || (
            (await shouldUseTaobao(command))
                ? registries.taobao
                : null
        )
    );

    if (altRegistry) {
        args.push(`--registry=${altRegistry}`);
        if (altRegistry === registries.taobao) {
            args.push(`--disturl=${taobaoDistURL}`);
        }
    }
}

exports.installDeps = async function(targetDir, command, cliRegistry) {
    const args = [];
    if (command === 'npm') {
        args.push('install', '--loglevel', 'error');
    } else if (command === 'yarn') {
        // TODO: yarn install
    } else {
        throw new Error(`未知的包管理器: ${command}`);
    }

    await addRegistryToArgs(command, args, targetDir);
}
