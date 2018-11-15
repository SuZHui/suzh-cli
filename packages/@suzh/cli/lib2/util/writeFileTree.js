const fs = require('fs-extra');
const path = require('path');

/**
 * 删除已经移除的文件
 * @param {string} directory 
 * @param {string[]} newFiles 
 * @param {object} previousFiles 
 */
function deleteRemovedFiles(directory, newFiles, previousFiles) {
    // 找到所有不再新文件列表中的文件
    const filesToDelete = Object.keys(previousFiles)
        .filter(filename => !newFiles[filename]);

    // 删除所有选中的文件
    return Promise.all(filesToDelete.map(filename => {
        return fs.unlink(path.join(directory, filename));
    }));
}

module.exports = async function writeFileTree(dir, files, prevFiles) {
    if (prevFiles) {
        await deleteRemovedFiles(dir, files, prevFiles);
    } 
    Object.keys(files).forEach(name => {
        const filePath = path.join(dir, name);
        // 如果目录结构不存在，则创建它，如果目录存在，则不进行创建
        fs.ensureDirSync(path.dirname(filePath));
        // 写入文件
        fs.writeFileSync(filePath, files[name]);
    });
}
