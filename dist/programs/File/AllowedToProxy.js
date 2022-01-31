"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllowedToProxy = void 0;
const proxy_1 = require("../../formatters/proxy");
const FileCommand_1 = require("./FileCommand");
class AllowedToProxy extends FileCommand_1.FileCommand {
    constructor() {
        super("proxy", proxy_1.formatJsonToProxy);
    }
}
exports.AllowedToProxy = AllowedToProxy;
//# sourceMappingURL=AllowedToProxy.js.map