/**
 * 选项类
 */
const fs = require('fs-extra');
// 加载Run-ControlFiles
const { getRcPath } = require('./util/rcPath');
const rcPath = exports.rcPath = getRcPath('.suzhrc');

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
            // TODO: 打印错误日志
            process.exit(1);
        }
        // TODO: 验证配置选项
        return cachedOptions;
    } else {
        return {};
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

