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
var fs = require("fs-extra");
var path = require("path");
/**
 * 删除已经移除的文件
 * @param {string} dir
 * @param {Files} newFiles
 * @param {Files} prevFiles
 */
function deleteRemovedFiles(dir, newFiles, prevFiles) {
    if (prevFiles === void 0) { prevFiles = {}; }
    // 找到所有不再新文件列表中的文件
    var filesToDelete = Object.keys(prevFiles)
        .filter(function (filename) { return !newFiles[filename]; });
    // 删除所有选中的文件
    return Promise.all(filesToDelete.map(function (filename) {
        return fs.unlink(path.join(dir, filename));
    }));
}
/**
 * 创建文档树
 */
function writeFileTree(dir, files, prevFiles) {
    if (prevFiles === void 0) { prevFiles = {}; }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!prevFiles) return [3 /*break*/, 2];
                    // 如果存在已删除的文件
                    // 先进行删除处理
                    return [4 /*yield*/, deleteRemovedFiles(dir, files, prevFiles)];
                case 1:
                    // 如果存在已删除的文件
                    // 先进行删除处理
                    _a.sent();
                    _a.label = 2;
                case 2:
                    Object.keys(files).forEach(function (name) {
                        var filePath = path.join(dir, name);
                        // 如果目录结构不存在，则创建它，如果目录存在，则不进行创建
                        fs.ensureDirSync(path.dirname(filePath));
                        // 同步写入文件
                        fs.writeFileSync(filePath, files[name]);
                    });
                    return [2 /*return*/];
            }
        });
    });
}
exports.writeFileTree = writeFileTree;
