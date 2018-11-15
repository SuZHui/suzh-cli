/**
 * 选项类
 */
const fs = require('fs-extra');
const cloneDeep = require('lodash.clonedeep');

const { error } = require('./util/logger');
const { createSchema, validate } = require('./util/validate');
// 加载Run-ControlFiles
const { getRcPath } = require('./util/rcPath');
const rcPath = exports.rcPath = getRcPath('.suzhrc');

/**
 * 验证preset的约束
 */
const presetSchema = createSchema(joi => joi.object().keys({
    bare: joi.boolean(),
    useConfigFiles: joi.boolean(),
    router: joi.boolean(),
    routerHistoryMode: joi.boolean(),
    vuex: joi.boolean(),
    cssPreprocessor: joi.string().only(['sass', 'less', 'stylus']),
    plugins: joi.object().required(),
    configs: joi.object()
}))

/**
 * 验证option的约束
 */
const schema = createSchema(joi => joi.object().keys({
    packageManager: joi.string().only(['yarn', 'npm']),
    useTaobaoRegistry: joi.boolean(),
    presets: joi.object().pattern(/^/, presetSchema)
}))

/**
 * 加载选项
 */
let cachedOptions;

 exports.loadOptions = () => {
    if (cachedOptions) {
        return cachedOptions;
    }
    if (fs.existsSync(rcPath)) {
        try {
            cachedOptions = JSON.parse(fs.readFileSync(rcPath, 'utf-8'));
            console.log(cachedOptions);
        } catch (e) {
            error(
                `Error loading saved preferences: ` +
                `~/.suzhrc may be corrupted or have syntax errors. ` +
                `Please fix/delete it and re-run [suzh] in manual mode.\n` +
                `(${e.message})`,
            )
            process.exit(1);
        }
        validate(cachedOptions, schema, () => {
            error(
                `~/.suzhrc may be outdated. ` +
                `Please delete it and re-run [suzh] in manual mode.`
            );
        });
        return cachedOptions;
    } else {
        return {};
    }
 }

 exports.saveOptions = toSave => {
     const options = Object.assign(cloneDeep(exports.loadOptions()), toSave)
     for (const key in options) {
         if (!(key in exports.defaults)) {
             delete options[key];
         }
     }
     cachedOptions = options;
     try {
        fs.writeFileSync(rcPath, JSON.stringify(options, null, 2));
     } catch (e) {
        error(
            `Error saving preferences: ` +
            `make sure you have write access to ${rcPath}.\n` +
            `(${e.message})`
        )
     }
 }

 // 设置默认配置
 exports.defaultPreset = {
    // router: false,
    // vuex: false,
    // useConfigFiles: false,
    // cssPreprocessor: undefined,
    // plugins: {
    //   '@vue/cli-plugin-babel': {},
    //   '@vue/cli-plugin-eslint': {
    //     config: 'base',
    //     lintOn: ['save']
    //   }
    // }
  }

 exports.defaults = {
    packageManager: undefined,
    useTaobaoRegistry: undefined,
    presets: {
      'default': exports.defaultPreset
    }
  }

