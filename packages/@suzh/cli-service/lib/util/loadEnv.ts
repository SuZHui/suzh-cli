import * as fs from 'fs';

/**
 * 加载环境配置文件
 *
 * @export
 * @param {string} [path='.env'] 配置文件所在路径
 */
export default function loadEnv(path: string = '.env') {
    parse(fs.readFileSync(path, 'utf-8'));
}

/**
 * 解析env资源
 * @param {string} src 需要解析的.env
 */
function parse(src: string) {
    const res = {};
    console.log(src);
}