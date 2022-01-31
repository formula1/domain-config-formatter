"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransformer = void 0;
const stream_1 = require("stream");
const StreamValues_1 = require("stream-json/streamers/StreamValues");
const index_1 = require("../index");
function createTransformer(options) {
    var itemNumber = 0;
    var item;
    const t = (0, StreamValues_1.streamValues)()
        .on("data", (newItem) => {
        itemNumber++;
        item = newItem;
    }).pipe(new FormatJSON())
        .pipe(new JSONStringifyStream(options));
    return {
        transform: t,
        get itemNumber() { return itemNumber; },
        get item() { return item; },
    };
}
exports.createTransformer = createTransformer;
class FormatJSON extends stream_1.Transform {
    constructor() {
        super({ objectMode: true });
    }
    _transform(json, _, cb) {
        try {
            this.push((0, index_1.formatJsonToConfig)(json));
            cb();
        }
        catch (e) {
            cb(e);
        }
    }
}
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
}
//# sourceMappingURL=transformer.js.map