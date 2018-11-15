const EventEmitter = require('events');

const writeFileTree = require('./util/writeFileTree');
const PromptModuleAPI = require('./PromptModuleAPI');
const { installDeps } = require('./util/installDeps');

const {
    defaults,
    loadOptions
} = require('./options');

module.exports = class Creator extends EventEmitter {
    constructor(name, context, promptModules) {
        super();

        this.name = name;
        this.context = process.env.CLI_CONTEXT = context;
        this.resolveIntroPrompts();
        this.featurePrompt = [];
        this.injectedPrompts = [];

        const promptAPI = new PromptModuleAPI(this);
        promptModules.forEach(m => m(promptAPI));
    }

    /**
     * 获取预设选项
     */
    getPresets() {
        // 获取配置文件.suzhrc
        const savedOptions = loadOptions();
        return Object.assign({}, savedOptions.presets, defaults.presets)
    }

    /**
     * 解析 提示器内容
     *
     */
    resolveIntroPrompts () {
        const presets = this.getPresets();
        // TODO: 设置 预设Prompts
        // const presetChoices = Object.keys(presets).map(name => {
        //     console.log(name);
        // })
    }

    promptAndResolvePreset (answers = null) {
        // 设置preset
        const preset = {
            useConfigFiles: answers.useConfigFiles === 'files',
            plugins: {}
          }
          answers.features = answers.features || [];
    }

    resolvePreset(name, clone) {

    }

    async create(cliOptions = {}, preset = null) {
        const { name, context } = this

        const pkg = {
            name,
            version: '0.1.0',
            private: true,
            devDependencies: {}
        };

        // 创建package.json
        await writeFileTree(context, {
            'package.json': JSON.stringify(pkg, null, 2)
        });
        // TODO: 生成文件11.13END

        const packageManager = (
            cliOptions.packageMnager ||
            loadOptions().packageManager ||
            (hasYarn() ? 'yarn' : 'npm')
        );
    }


}