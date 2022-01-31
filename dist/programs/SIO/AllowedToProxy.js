"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllowedToProxy = void 0;
const stream_1 = require("stream");
const proxy_1 = require("../../formatters/proxy");
const SIOCommand_1 = require("./SIOCommand");
class AllowedToProxy extends SIOCommand_1.SIOCommand {
    constructor() {
        super("proxy", new JSONToProxy());
    }
}
exports.AllowedToProxy = AllowedToProxy;
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