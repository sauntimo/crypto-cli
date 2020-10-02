#!/usr/bin/env node
"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
var chalk_1 = __importDefault(require("chalk"));
var node_fetch_1 = __importDefault(require("node-fetch"));
var path_1 = __importDefault(require("path"));
// get API key from .env file into process.env
dotenv_1.default.config({ path: path_1.default.join(__dirname + '/../.env') });
var cmcBaseUrl = 'https://pro-api.coinmarketcap.com';
/**
 * Get a price of a cyptocurrency in a fiat currency
 * @param asset the symbol of a crypto currency
 * @param fiat the symbol of a fiat currency
 */
var fetchQuote = function (asset, fiat) { return __awaiter(void 0, void 0, void 0, function () {
    var endpoint, queryData, query, response, data, quote, change, localisedPrice;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                endpoint = '/v1/cryptocurrency/quotes/latest';
                queryData = {
                    symbol: asset,
                    convert: fiat,
                };
                query = '?' + new URLSearchParams(queryData).toString();
                return [4 /*yield*/, node_fetch_1.default(cmcBaseUrl + endpoint + query, {
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY,
                        },
                    })];
            case 1:
                response = _c.sent();
                return [4 /*yield*/, response.json()];
            case 2:
                data = _c.sent();
                if (((_a = data === null || data === void 0 ? void 0 : data.status) === null || _a === void 0 ? void 0 : _a.error_code) === 1001) {
                    throw new Error("Invalid API key.\n      Crypto-cli expects a .env file in its root with a valid CMC_API_KEY value. \n      Go to https://coinmarketcap.com/api/ to obtain an API key for free.\n      ");
                }
                // successful requests where bad input resulted in no data
                if (!response.ok && typeof ((_b = data === null || data === void 0 ? void 0 : data.status) === null || _b === void 0 ? void 0 : _b.error_code) === 'number') {
                    throw new Error(data.status.error_message);
                }
                if (!response.ok) {
                    throw new Error("Bad response from server: " + response.statusText);
                }
                quote = data.data[asset].quote[fiat];
                change = parseFloat(quote.percent_change_24h);
                localisedPrice = new Intl.NumberFormat('en-GB', {
                    style: 'currency',
                    currency: fiat
                }).format(quote.price);
                return [2 /*return*/, { localisedPrice: localisedPrice, change: change }];
        }
    });
}); };
/**
 * Get a crypto asset price and print it to the command line
 * @param asset the symbol of a crypto currency
 * @param fiat the symbol of a fiat currency
 */
var returnResult = function (asset, fiat) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, localisedPrice, change;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, fetchQuote(asset, fiat)];
            case 1:
                _a = _b.sent(), localisedPrice = _a.localisedPrice, change = _a.change;
                console.log(chalk_1.default.bgCyan.white.bold('Crypto-CLI'), chalk_1.default.blue("1 " + asset + " = " + localisedPrice), chalk_1.default.white("24hr change:"), chalk_1.default[change >= 0 ? 'green' : 'red']((change > 0 ? '+' : '') + change.toFixed(2) + '%'));
                return [2 /*return*/];
        }
    });
}); };
/**
 * Check that the correct number of arguments were specified and return them
 */
var parseArgs = function () {
    // missing required arguments
    if (process.argv.slice(2).length !== 2) {
        throw new Error("Incorrect number of arguments specified. Usage: crypto [asset] [fiat currency]");
    }
    return {
        asset: process.argv[2].toUpperCase(),
        fiat: process.argv[3].toUpperCase()
    };
};
/**
 * Wrapper function for async error handling
 */
var main = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, asset, fiat, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = parseArgs(), asset = _a.asset, fiat = _a.fiat;
                return [4 /*yield*/, returnResult(asset, fiat)];
            case 1:
                _b.sent();
                return [3 /*break*/, 3];
            case 2:
                err_1 = _b.sent();
                console.log(chalk_1.default.bgCyan.white.bold('Crypto-CLI'), chalk_1.default.red(err_1));
                process.exit(1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
main();
