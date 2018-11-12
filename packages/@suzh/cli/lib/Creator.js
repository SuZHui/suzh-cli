const EventEmitter = require('events');

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
        // const presetChoices = Object.keys(presets).map(name => {
        //     console.log(name);
        // })
    }

    async create(cliOptions = {}, preset = null) {
        
    }


}