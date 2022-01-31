"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllowedToGreenlock = void 0;
const greenlock_1 = require("../../formatters/greenlock");
const FileCommand_1 = require("./FileCommand");
class AllowedToGreenlock extends FileCommand_1.FileCommand {
    constructor() {
        super("greenlock", greenlock_1.formatJsonToGreenlock);
    }
}
exports.AllowedToGreenlock = AllowedToGreenlock;
//# sourceMappingURL=AllowedToGreenlock.js.map