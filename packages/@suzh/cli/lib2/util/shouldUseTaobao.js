// A better child_process
const execa = require('execa');
const chalk = require('chalk');
const inquirer = require('inquirer');
const { loadOptions, saveOptions } = require('../options');
// 仓库列表
const registries = require('./registries');

// 移除多余斜线
function removeSlash(url) {
    return url.replace('/\/$/', '');
}

let checked, result;

// 是否启用淘宝镜像
module.exports = await function shouldUseTaobao (command = 'npm') {
    // 确认至执行一次
    if (checked) return result;
    checked = true;

    const saved = loadOptions().useTaobaoRegistry;
    if (typeof saved === 'boolean') {
        return (result = saved)
    }

    const save = val => {
        result = val;
        saveOptions({ useTaobaoRegistry: val });
        return val;
    };

    // 使用命令行获取当前仓库镜像地址
    const userCurrent = (await execa(command, ['config', 'get', 'registry'])).stdout;
    const defaultRegistry = registries[command];
    
    if (removeSlash(userCurrent) !== removeSlash(defaultRegistry)) {
        // 当前仓库地址和默认的仓库url进行比对
        // 当前仓库，用户进行过个人配置，不需要再进行配置
        return save(false);
    }

    // 配置首选项（boolean）
    const { useTaobaoRegistry } = await inquirer.prompt([
        {
            name: 'useTaobaoRegistry',
            type: 'confirm',
            message: chalk.yellow(
              ` 是否要切换至 ${command} 源仓库？`
            )
        }
    ]);
    return save(useTaobaoRegistry);
}