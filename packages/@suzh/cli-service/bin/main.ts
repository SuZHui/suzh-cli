#!/usr/bin/env node

import * as minimist from 'minimist';
import { Service } from "../lib/Service";

const service = new Service(process.cwd());

// 获取从第三个命令行参数开始的数组, 第一个是node 第二个是suzh-cli-service
const rawArgv: string[] = process.argv.slice(2);

const args: minimist.ParsedArgs = minimist(rawArgv, {
    boolean: [
        'open', // 开发模式，打开浏览器
        'https', // 开发模式，使用https
        'help', // 命令行, 帮助
    ]
});
// 获取根命令，（serve | build）
// args._ contains all the arguments that didn't have an option associated with them.
const command = args._[0];

service.run(command, args, rawArgv);