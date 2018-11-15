import * as fs from 'fs-extra';
import * as path from 'path';

// 文件类型
type Files = {
    [name: string]: string
}

/**
 * 删除已经移除的文件
 * @param {string} dir 
 * @param {Files} newFiles 
 * @param {Files} prevFiles 
 */
function deleteRemovedFiles(dir: string, newFiles: Files, prevFiles: Files = {}): Promise<void[]> {
    // 找到所有不再新文件列表中的文件
    const filesToDelete = Object.keys(prevFiles)
        .filter(filename => !newFiles[filename]);
    // 删除所有选中的文件
    return Promise.all(filesToDelete.map(filename => {
        return fs.unlink(path.join(dir, filename));
    }));
}

/**
 * 创建文档树
 */
export async function writeFileTree(dir: string, files: Files, prevFiles: Files = {}) {
    if (prevFiles) {
        // 如果存在已删除的文件
        // 先进行删除处理
        await deleteRemovedFiles(dir, files, prevFiles);
    }

    Object.keys(files).forEach(name => {
        const filePath = path.join(dir, name);
        // 如果目录结构不存在，则创建它，如果目录存在，则不进行创建
        fs.ensureDirSync(path.dirname(filePath));
        // 同步写入文件
        fs.writeFileSync(filePath, files[name]);
    })
}
