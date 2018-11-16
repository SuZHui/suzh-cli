import { Service } from "./Service";

export class PluginAPI {
    /**
     *Creates an instance of PluginAPI.
     * @param {string} id 依赖包名
     * @param {Service} service Service 实例
     * @memberof PluginAPI
     */
    constructor(
        private id: string,
        private service: Service
    ) {}

    
}