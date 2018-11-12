const path = require('path');
const fs = require('fs-extra');
// 验证名称是否是正确的npm包格式
const validateProjectName = require('validate-npm-package-name');
// 步骤停顿库
const inquirer = require('inquirer');
const chalk = require('chalk');

const { getPromptModules } = require('./util/createTools');
const Creator = require('./Creator');

async function create(projectName, options) {
    const cwd = options.cwd || process.cwd();
    const inCurrent = projectName === '.';
    // path.relative方法接受两个参数，这两个参数都应该是绝对路径。
    // 该方法返回第二个路径相对于第一个路径的那个相对路径。
    const name = inCurrent ? path.relative('../', cwd) : projectName;
    const targetDir = path.resolve(cwd, projectName || '.');

    // boolean 是否是合法的npm项目名称
    const result = validateProjectName(name);
    if (!result.validForNewPackages) {
        // 如果不是合法的npm包名
        console.error(chalk.red(`无效的项目名称: "${name}"`));
        result.errors && result.errors.forEach(err => {
            console.error(chalk.red(err));
        });
        // TODO: 退出程序 待开发
        // exit(1);
        process.exit(1);
    }

    // 目标文件夹(cwd + 项目名称)是否存在
    // 如果存在 清除文件 重新生成
    // 如果不存在 新建项目
    if (fs.existsSync(targetDir)) {
        // 如果用户输入的项目名称是当前路径(.)
        // confirm 确认下一步操作 [覆盖， 合并, 取消]
        if (inCurrent) {
            const { ok } = await inquirer.prompt([
                {
                    name: 'ok',
                    type: 'confirm',
                    message: '在当前文件夹创建项目?'
                }
            ]);
            if (!ok) {
                return;
            }
        } else {
            const { action } = await inquirer.prompt([
                {
                    name: 'action',
                    type: 'list',
                    message:  `当前目录 ${chalk.cyan(targetDir)} 已经存在. 选择一个操作：`,
                    choices: [
                        { name: '覆盖', value: 'overwrite' },
                        { name: '合并', value: 'merge' },
                        { name: '取消', value: false }
                    ]
                }
            ]);

            if (!action) {
                return;
            } else if (action === 'overwrite') {
                // 覆盖原文件夹的操作
                console.log(`\n正在删除文件夹 ${chalk.cyan(targetDir)}...`);
                await fs.remove(targetDir);          
            }
        }
    }

    const creator = new Creator(name, targetDir, getPromptModules());
    // await creator.create(options);
}

module.exports = (...args) => {
    return create(...args);
}