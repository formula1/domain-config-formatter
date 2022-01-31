"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = exports.JSONStringifyStream = exports.JSONParseStream = exports.BufferToString = void 0;
const stream_1 = require("stream");
class BufferToString extends stream_1.Transform {
    constructor() {
        super({ objectMode: true });
    }
    _transform(b, _, cb) {
        this.push(b.toString("utf-8"));
        cb();
    }
}
exports.BufferToString = BufferToString;
class JSONParseStream extends stream_1.Transform {
    constructor() {
        super({ objectMode: true });
        this.buffer = "";
    }
    _transform(b, _, cb) {
        this.buffer += b.toString("utf-8");
        cb();
    }
    _flush(cb) {
        try {
            this.push(JSON.parse(this.buffer));
            cb();
        }
        catch (e) {
            cb(e);
        }
    }
}
exports.JSONParseStream = JSONParseStream;
class JSONStringifyStream extends stream_1.Transform {
    constructor({ pretty }) {
        super({ objectMode: true });
        this.pretty = !!pretty;
    }
    _transform(json, _, cb) {
        try {
            if (this.pretty) {
                this.push(JSON.stringify(json, null, 2));
            }
            else {
                this.push(JSON.stringify(json));
            }
            cb();
        }
        catch (e) {
            cb(e);
        }
    }
    _flush(cb) {
        this.push("\n");
        cb();
    }
}
exports.JSONStringifyStream = JSONStringifyStream;
class Logger extends stream_1.Transform {
    constructor(prefix) {
        super();
        this.prefix = prefix;
    }
    _transform(v, _, cb) {
        console.log(this.prefix, v);
        this.push(v);
        cb();
    }
}
exports.Logger = Logger;
//# sourceMappingURL=json-transform.js.map