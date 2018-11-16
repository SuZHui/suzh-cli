"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PluginAPI = /** @class */ (function () {
    /**
     *Creates an instance of PluginAPI.
     * @param {string} id 依赖包名
     * @param {Service} service Service 实例
     * @memberof PluginAPI
     */
    function PluginAPI(id, service) {
        this.id = id;
        this.service = service;
    }
    return PluginAPI;
}());
exports.PluginAPI = PluginAPI;
