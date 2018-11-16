import * as debug from 'debug';
import * as path from 'path';
import * as fs from 'fs';
import chalk from 'chalk';
import * as minimist from 'minimist'
import loadEnv from './util/loadEnv';
import { error } from './util/logger';


/**
 * 启动的service模式
 */
type ServiceMode = 'development' | 'production';
type ServiceOptions = {
    pkg?: {
        [name: string]: string
    }
}

/**
 *  加载.env环境配置文件
 *  加载suzh.config.js配置
 *  加载项目base配置文件
 *  TODO: 加载webpack配置文件
 *  TODO: 运行命令队列
 *
 *  @export
 *  @class Service
 **/
export class Service {
    // package.json
    private pkg: {
        [name: string]: any,
        devDependencies?: {[name: string]: any},
        dependencies?: {[name: string]: any}
    };

    // 命令行数据
    private commands: {
        [arg: string]: any
    } = {};

    private plugins: any;

    /**
     * Creates an instance of Service.
     * @param {string} context 项目根路径
     * @memberof Service
     */
    constructor(
        private context: string,
        options: ServiceOptions = {}
    ) {
        const { pkg } = options;
        this.pkg = this.resolvePkg(pkg);

        this.plugins =this.resolvePlugins();
    }

    /**
     * 根据【MODE】初始化服务
     * 加载环境变量
     * 加载用户配置
     * 加载插件
     * @private
     * @param {string} mode
     * @memberof Service
     */
    private init(mode: ServiceMode | null = null) {
        if (mode) {
            // 如果mode存在, 先加载对应mode的.env
            this.loadEnv(mode);
        }
        this.loadEnv();

        // 加载用户配置文件
        this.loadUserOptions();
        
        // TODO: 执行plugins 列表动态加载的脚本,
        // TODO: 传入必要参数 包名， 全局项目配置项
        // TODO: 78line
        // this.plugins.forEach(() => {})
    }

    /**
     * 执行命令
     * @param command 命令
     * @param args 参数键值对
     * @param rawArgv 参数数组
     */
    public run(name: string, args: minimist.ParsedArgs, rawArgv: string[]) {
        console.log(name, args, rawArgv);
        // 设定初始
        const mode: ServiceMode = args.mode || (name === 'build' && args.watch ? 'development' : 'production');

        this.init(mode);

        args._ = args._ || [];
        let command = this.commands[name];
        if (!command && name) {
            error(`command "${name}" does not exist.`);
            process.exit(1);
        }
        // suzh-cli-service help [command]
        if (!command || args['help']) {
            command = this.commands['help'];
        } else {
            args._.shift();
            rawArgv.shift();
        }
        const { fn } = command;
        console.log(args, rawArgv, fn)
        return fn(args, rawArgv);
    }

    /**
     * 加载环境文件
     * @todo 待完成
     * @private
     * @param {ServiceMode} mode
     * @memberof Service
     */
    private loadEnv(mode: ServiceMode | null = null) {
        // 使用debug，设置debug的命名空间为suzh:env
        const logger = debug('suzh:env');
        // 设置基路径，解析的文件后缀为.env[.mode]
        // .env                # 在所有的环境中被载入
        // .env.local          # 在所有的环境中被载入，但会被 git 忽略
        // .env.[mode]         # 只在指定的模式中被载入
        // .env.[mode].local   # 只在指定的模式中被载入，但会被 git 忽略
        const basePath = path.resolve(this.context, `.env${mode ? `.${mode}` : ``}`);
        const localPath = `${basePath}.local`;

        const load = (path: string) => {
            try {
                const res = loadEnv();
                logger(path, res);
            } catch (err) {
                // 判断是否为 ENOENT 错误，（该错误表示文件不存在）
                // 其他错误 打印错误日志
                if (err && err.code !== 'ENOENT') {
                    error(err);
                }
            }
        }
        // 加载本地环境配置
        // 加载全局公用配置
        load(localPath);
        load(basePath);

        if (mode) {
            // TODO: 对应模式的配置待开发

        }
    }

    /**
     * 解析package.json 或 用户自定义的配置文件
     *
     * @private
     * @param {*} inlinePkg
     * @param {string} [context=this.context]
     * @returns
     * @memberof Service
     */
    private async resolvePkg(inlinePkg: any, context: string = this.context) {
        if (inlinePkg) {
            // 如果自定义了pkg，则使用提供的pkg
            return inlinePkg;
        } else if (fs.existsSync(path.join(context, 'package.json'))) {
            // 导入package.json
            const pkg = await import('../package.json');
            return pkg;
        } else {
            return {};
        }
    }

    /**
     * 加载用户配置文件 suzh.config.js
     * 大部分参照 webpack 配置
     * @private
     * @memberof Service
     */
    private async loadUserOptions() {
        let fileConfig;

        const configPath = path.resolve(this.context, 'suzh.config.js');
        if (fs.existsSync(configPath)) {
            try {
                // 如果存在配置文件， 尝试导入
                fileConfig = await import(configPath);
                if (!fileConfig || typeof fileConfig !== 'object') {
                    // 验证config文件是否导出为object
                    // 如果不是 则返回null
                    error(
                        `Error loading ${chalk.bold('suzh.config.js')}: should export an object.`
                    )
                    fileConfig = null;
                }
            } catch(e) {
                error(`Error loading ${chalk.bold('suzh.config.js')}:`);
                throw e;
            }
        }
    }

    /**
     * TODO: 解析插件（plugins）列表， 返回依赖数组对象
     *
     * @private
     * @memberof Service
     */
    private resolvePlugins() {
        // 通过ID加载plugins
        const idToPlugin = async (id: string) => ({
            id: id.replace(/^.\//, 'built-in:'),
            apply: await import(id)
        });

        let plugins;

        // 通过解析给定的字符串，最后生成数组对象 {id: string, apply: fn}[]
        const builtInPlugins = [

        ].map(idToPlugin);

        // TODO: 从commands文件夹 动态加载命令执行文件 [serve, build ...]
        // TODO: 154 line
        // if (inlinePlugins) {
        //     plugins = useBuildIn !== false
        //         ? builtInPlugins.concat(inlinePlugins)
        //         : inlinePlugins
        // } else {
        //     // 整合所有package.json中的依赖
        //     // 调用[isPlugin]获取依赖列表
        //     // 安装依赖
        //     const projectPlugins = Object.keys(this.pkg.devDependencies || {})
        //         .concat(Object.keys(this.pkg.dependencies || {}))
        //         // .filter()
        // }
    }
}