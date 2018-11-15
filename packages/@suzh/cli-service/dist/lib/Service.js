"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var debug = require("debug");
var path = require("path");
var fs = require("fs");
var chalk_1 = require("chalk");
var loadEnv_1 = require("./util/loadEnv");
var logger_1 = require("./util/logger");
/**
 * TODO: 加载.env环境配置文件
 * TODO: 加载suzh.config.js配置
 * TODO: 加载项目base配置文件
 * TODO: 加载webpack配置文件
 * TODO: 运行命令队列
 *
 * @export
 * @class Service
 */
var Service = /** @class */ (function () {
    /**
     * Creates an instance of Service.
     * @param {string} context 项目根路径
     * @memberof Service
     */
    function Service(context, options) {
        if (options === void 0) { options = {}; }
        this.context = context;
        var pkg = options.pkg;
        this.pkg = this.resolvePkg(pkg);
    }
    /**
     * 根据【MODE】初始化服务
     *
     * @private
     * @param {string} mode
     * @memberof Service
     */
    Service.prototype.init = function (mode) {
        if (mode === void 0) { mode = null; }
        if (mode) {
            // 如果mode存在, 先加载对应mode的.env
            this.loadEnv(mode);
        }
        this.loadEnv();
        // 加载用户配置文件
        this.loadUserOptions();
    };
    Service.prototype.run = function () {
        this.init('development');
        // TODO: 根据命令进行生成
    };
    /**
     * 加载环境文件
     * @todo 待完成
     * @private
     * @param {ServiceMode} mode
     * @memberof Service
     */
    Service.prototype.loadEnv = function (mode) {
        if (mode === void 0) { mode = null; }
        // 使用debug，设置debug的命名空间为suzh:env
        var logger = debug('suzh:env');
        // 设置基路径，解析的文件后缀为.env[.mode]
        // .env                # 在所有的环境中被载入
        // .env.local          # 在所有的环境中被载入，但会被 git 忽略
        // .env.[mode]         # 只在指定的模式中被载入
        // .env.[mode].local   # 只在指定的模式中被载入，但会被 git 忽略
        var basePath = path.resolve(this.context, ".env" + (mode ? "." + mode : ""));
        var localPath = basePath + ".local";
        var load = function (path) {
            try {
                var res = loadEnv_1.default();
                logger(path, res);
            }
            catch (err) {
                // 判断是否为 ENOENT 错误，（该错误表示文件不存在）
                // 其他错误 打印错误日志
                if (err && err.code !== 'ENOENT') {
                    logger_1.error(err);
                }
            }
        };
        // 加载本地环境配置
        // 加载全局公用配置
        load(localPath);
        load(basePath);
        if (mode) {
            // TODO: 对应模式的配置待开发
        }
    };
    /**
     * 解析package.json 或 用户自定义的配置文件
     *
     * @private
     * @param {*} inlinePkg
     * @param {string} [context=this.context]
     * @returns
     * @memberof Service
     */
    Service.prototype.resolvePkg = function (inlinePkg, context) {
        if (context === void 0) { context = this.context; }
        return __awaiter(this, void 0, void 0, function () {
            var pkg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!inlinePkg) return [3 /*break*/, 1];
                        // 如果自定义了pkg，则使用提供的pkg
                        return [2 /*return*/, inlinePkg];
                    case 1:
                        if (!fs.existsSync(path.join(context, 'package.json'))) return [3 /*break*/, 3];
                        return [4 /*yield*/, Promise.resolve().then(function () { return require('../package.json'); })];
                    case 2:
                        pkg = _a.sent();
                        return [2 /*return*/, pkg];
                    case 3: return [2 /*return*/, {}];
                }
            });
        });
    };
    /**
     * 加载用户配置文件 suzh.config.js
     * 大部分参照 webpack 配置
     * @private
     * @memberof Service
     */
    Service.prototype.loadUserOptions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var fileConfig, configPath, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        configPath = path.resolve(this.context, 'suzh.config.js');
                        if (!fs.existsSync(configPath)) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, Promise.resolve().then(function () { return require(configPath); })];
                    case 2:
                        // 如果存在配置文件， 尝试导入
                        fileConfig = _a.sent();
                        if (!fileConfig || typeof fileConfig !== 'object') {
                            // 验证config文件是否导出为object
                            // 如果不是 则返回null
                            logger_1.error("Error loading " + chalk_1.default.bold('suzh.config.js') + ": should export an object.");
                            fileConfig = null;
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        logger_1.error("Error loading " + chalk_1.default.bold('suzh.config.js') + ":");
                        throw e_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return Service;
}());
exports.Service = Service;
