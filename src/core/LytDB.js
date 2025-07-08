"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LytDB = void 0;
var exporter_1 = require("../export/exporter");
var LytDB = /** @class */ (function () {
    function LytDB(options) {
        if (options === void 0) { options = {}; }
        this.options = options;
        this.state = {
            tables: {},
            schemas: {},
        };
        this.exporter = new exporter_1.Base64Exporter();
    }
    LytDB.prototype.initPersistence = function (storage) {
        return __awaiter(this, void 0, void 0, function () {
            var savedState;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.storageAdapter = storage;
                        if (!this.options.persist) return [3 /*break*/, 2];
                        return [4 /*yield*/, storage.load()];
                    case 1:
                        savedState = _a.sent();
                        if (savedState) {
                            this.state = savedState;
                        }
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    LytDB.prototype.save = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.storageAdapter) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.storageAdapter.save(this.state)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    LytDB.prototype.clearStorage = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.storageAdapter) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.storageAdapter.clear()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    LytDB.prototype.createTable = function (schema) {
        if (this.state.schemas[schema.name]) {
            throw new Error("Table ".concat(schema.name, " already exists"));
        }
        this.state.schemas[schema.name] = schema;
        this.state.tables[schema.name] = [];
    };
    LytDB.prototype.listTables = function () {
        return Object.keys(this.state.tables);
    };
    LytDB.prototype.insert = function (table, item) {
        if (!this.state.tables[table]) {
            throw new Error("Table ".concat(table, " does not exist"));
        }
        //Create a shallow copy to prevent external modifications
        var itemToInsert = __assign({}, item);
        this.state.tables[table].push(itemToInsert);
        return itemToInsert;
    };
    LytDB.prototype.findOne = function (table, predicate) {
        var items = this.getAllItems(table);
        return items.find(predicate) || null;
    };
    LytDB.prototype.findAll = function (table, predicate) {
        var items = this.getAllItems(table);
        return predicate ? items.filter(predicate) : __spreadArray([], items, true);
    };
    LytDB.prototype.update = function (table, predicate, update) {
        var items = this.getAllItems(table);
        var updateCount = 0;
        for (var i = 0; i < items.length; i++) {
            if (predicate(items[i])) {
                items[i] = __assign(__assign({}, items[i]), update);
                updateCount++;
            }
        }
        return updateCount;
    };
    LytDB.prototype.delete = function (table, predicate) {
        if (!this.state.tables[table]) {
            throw new Error("Table ".concat(table, " does not exist"));
        }
        var originalLength = this.state.tables[table].length;
        this.state.tables[table] = this.state.tables[table].filter(function (item) { return !predicate(item); });
        return originalLength - this.state.tables[table].length;
    };
    LytDB.prototype.getAllItems = function (table) {
        if (!this.state.tables[table]) {
            throw new Error("Table ".concat(table, " does no exist"));
        }
        return this.state.tables[table];
    };
    LytDB.prototype.exportToBlob = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.exporter.exportToBlob(this.state)];
            });
        });
    };
    LytDB.prototype.importFromBlob = function (blob_1) {
        return __awaiter(this, arguments, void 0, function (blob, options) {
            var importedState, _i, _a, _b, tableName, items;
            var _c;
            if (options === void 0) { options = {}; }
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.exporter.importFromBlob(blob)];
                    case 1:
                        importedState = _d.sent();
                        if (options.merge) {
                            for (_i = 0, _a = Object.entries(importedState.tables); _i < _a.length; _i++) {
                                _b = _a[_i], tableName = _b[0], items = _b[1];
                                if (this.state.tables[tableName]) {
                                    (_c = this.state.tables[tableName]).push.apply(_c, items);
                                }
                                else {
                                    this.state.tables[tableName] = __spreadArray([], items, true);
                                }
                            }
                        }
                        this.state = importedState;
                        return [2 /*return*/];
                }
            });
        });
    };
    return LytDB;
}());
exports.LytDB = LytDB;
