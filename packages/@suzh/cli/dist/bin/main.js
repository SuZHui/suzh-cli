#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var commander = require("commander");
var path = require("path");
// 导入package.json
var packageJson = require("../package.json");
var Creator_1 = require("../lib/Creator");
var world = '🗺️';
commander
    .version(packageJson.version)
    .usage('<command> [options]');
commander
    .command('create <project-name>')
    .description('创建一个新项目')
    .action(function (name, cmd) {
    console.log(cmd);
    // 生成项目的package.json
    var cwd = cmd.cwd || process.cwd();
    var targetDir = path.resolve(cwd, name || '.');
    var creator = new Creator_1.Creator(name, targetDir);
    creator.create();
    //TODO: 使用package.json下载依赖
});
commander.parse(process.argv);
