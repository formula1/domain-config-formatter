"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllowedToGreenlock = void 0;
const stream_1 = require("stream");
const SIOCommand_1 = require("./SIOCommand");
const greenlock_1 = require("../../formatters/greenlock");
class AllowedToGreenlock extends SIOCommand_1.SIOCommand {
    constructor() {
        super("greenlock", new JSONToGreenlock());
    }
}
exports.AllowedToGreenlock = AllowedToGreenlock;
class JSONToGreenlock extends stream_1.Transform {
    constructor() {
        super({ objectMode: true });
    }
    _transform(json, _, cb) {
        try {
            this.push((0, greenlock_1.formatJsonToGreenlock)(json));
            cb();
        }
        catch (e) {
            cb(e);
        }
    }
}
//# sourceMappingURL=AllowedToGreenlock.js.map