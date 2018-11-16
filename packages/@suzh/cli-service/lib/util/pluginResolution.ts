const pluginRE = /^(@vue\/|vue-|@[\w-]+\/vue-)cli-plugin-/;

/**
 * 给定依赖名称
 * 检测是否为vue的依赖插件
 * @export
 * @param {string} id
 * @returns
 */
export function isPlugin(id: string) {
    return pluginRE.test(id);
}