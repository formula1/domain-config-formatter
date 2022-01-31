"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProxyToGreenlock = void 0;
const stream_1 = require("stream");
const SIOCommand_1 = require("./SIOCommand");
const greenlock_1 = require("../../formatters/greenlock");
const proxy_1 = require("../../formatters/proxy");
const formatters_1 = require("../../formatters");
const json_1 = require("../../util/json");
class ProxyToGreenlock extends SIOCommand_1.SIOCommand {
    constructor() {
        super("proxy-greenlock", new JSONToGreenlock());
    }
}
exports.ProxyToGreenlock = ProxyToGreenlock;
class JSONToGreenlock extends stream_1.Transform {
    constructor() {
        super({ objectMode: true });
    }
    _transform(json, _, cb) {
        const greenlock = (0, greenlock_1.formatJsonToGreenlock)(json);
        const proxy = (0, proxy_1.formatJsonToProxy)(json);
        const p_greenlock = (0, formatters_1.proxyToGreenlock)(proxy);
        try {
            this.push((0, json_1.deepEqual)(greenlock, p_greenlock));
            cb();
        }
        catch (e) {
            cb(e);
        }
    }
}
//# sourceMappingURL=ProxyToGreenlock.js.map