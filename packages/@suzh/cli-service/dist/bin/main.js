#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var minimist = require("minimist");
var Service_1 = require("../lib/Service");
var service = new Service_1.Service(process.cwd());
// 获取从第三个命令行参数开始的数组, 第一个是node 第二个是suzh-cli-service
var rawArgv = process.argv.slice(2);
var args = minimist(rawArgv, {
    boolean: [
        'open',
        'https',
        'help',
    ]
});
// 获取根命令，（serve | build）
// args._ contains all the arguments that didn't have an option associated with them.
var command = args._[0];
service.run(command, args, rawArgv);
