#!/usr/bin/env node

import * as commander from 'commander';
import * as path from 'path';

// 导入package.json
import * as packageJson from '../package.json';
import { Creator } from '../lib/Creator';

const world = '🗺️';

commander
    .version(packageJson.version)
    .usage('<command> [options]');

commander
    .command('create <project-name>')
    .description('创建一个新项目')
    .action((name: string, cmd: commander.Command) => {
        console.log(cmd)
        // 生成项目的package.json
        const cwd = cmd.cwd || process.cwd();
        const targetDir = path.resolve(cwd, name || '.');
        const creator = new Creator(name, targetDir);
        creator.create();

        //TODO: 使用package.json下载依赖
        
    });

commander.parse(process.argv);
