// 加载前端各模块配置
exports.getPromptModules = () => {
    return [
        'babel',
        'typescript',
        'pwa',
        'router',
        'vuex',
        'cssPreprocessors',
        'linter',
        'unit',
        'e2e'
    ].map(file => file);
}
