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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FromStdInCommand = void 0;
const commander_1 = require("commander");
const stream_1 = require("stream");
const proxy_1 = require("../formatters/proxy");
const json_transform_1 = require("./json-transform");
class FromStdInCommand extends commander_1.Command {
    constructor() {
        super("allowed-to-proxy");
        this.option("-p, -pretty", "whether it should be pretty or not when printed").option("-sa, --stay-alive", "whether or not the process should close when an error occured").action((optionsRaw) => __awaiter(this, void 0, void 0, function* () {
            process.stdin
                .pipe((0, json_transform_1.stringToJsonTransform)())
                .pipe(new JSONToProxy())
                .pipe(new json_transform_1.JSONStringifyStream(optionsRaw))
                .pipe(process.stdout)
                .on("error", (error) => {
                console.error(error);
                if (optionsRaw.stayAlive)
                    return;
                throw error;
            });
        }));
    }
}
exports.FromStdInCommand = FromStdInCommand;
class JSONToProxy extends stream_1.Transform {
    constructor() {
        super({ objectMode: true });
    }
    _transform(json, _, cb) {
        try {
            this.push((0, proxy_1.formatJsonToProxy)(json));
            cb();
        }
        catch (e) {
            cb(e);
        }
    }
}
//# sourceMappingURL=AllowedToProxy.js.map