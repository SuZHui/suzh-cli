#!/usr/bin/env node

const chalk = require('chalk');
const semver = require('semver');

const requiredVersion = require('../package.json').engines.node;

/**
 * Check node version before requiring/doing anything else
 * the user may be on a very old node version
 * @param {string} wanted 
 * @param {string} id
 */
function checkNodeVersion(wanted, id) {
    if (!semver.satisfies(process.version, wanted)) {
        console.log(chalk.red(
            `You are using Node ${process.version}, but this version of ${id} requires Node ${wanted}.\nPlease upgrade your Node version.`
        ));
        process.exit(1);
    }
}

checkNodeVersion(requiredVersion, "suzh-cli");

const program = require('commander');

// Show project version
program
    .version(require('../package').version)
    .usage('<command> [options]');

// Create project with <app-name>
program
    .command('create <app-name>')
    .description('创建一个新项目')
    .action((name, cmd) => {
        const options = cleanArgs(cmd);
        // TODOS: continue finish create function
        require('../lib/create')(name, options);
    });

program.parse(process.argv);

function camelize(str) {
    return str.replace(/-(\w)/g, (_, c) => c ? c.toUpperCase() : '');
}

// Commander passes the Command object itself as options,
// extract only actual options into a fresh object.
function cleanArgs(cmd) {
    const args = {};
    cmd.options.forEach(o => {
        const key = camelize(o.replace(/^--/, ''));
        if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
            args[key] = cmd[key];
        }
    });
    return args;
}

