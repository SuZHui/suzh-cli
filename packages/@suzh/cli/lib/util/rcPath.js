const path = require('path');
const os = require('os');
const fs = require('fs-extra');

const migrateWindowsConfigPath = file => {
    if (process.platform !== 'win32') {
        return;
    }
    const appData = process.env.APPDATA;
    if (appData) {
        // 设置rc所在的文件夹
        const rcDir = path.join(appData, 'suzh');
        // rc文件所在路径
        const rcFile = path.join(rcDir, file);
        const properRcFile = path.join(os.homedir(), file);
        if (fs.existsSync(rcFile)) {
            // 如果appdata路径下的rc配置文件存在
            try {
                if (fs.existsSync(properRcFile)) {
                    // 如果用户个人主页下的rc配置文件存在
                    // 将appdata目录下的配置文件删除
                    fs.removeSync(rcFile);
                } else {
                    // 如果用户个人主页下的rc配置文件不存在
                    // 将appdata目录下的配置文件覆盖之
                    fs.moveSync(rcFile, properRcFile);
                }
            } catch(e) {}
        }
    }
}

exports.getRcPath = file => {
    migrateWindowsConfigPath(file);
    return (
        // process.env.VUE_CLI_CONFIG_PATH ||
        // xdgConfigPath(file) ||
        path.join(os.homedir(), file)
    );
}