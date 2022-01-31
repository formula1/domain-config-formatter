"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testIP = void 0;
const net_1 = require("net");
function testIP(ip) {
    if ((0, net_1.isIP)(ip))
        return;
    throw new Error("invalid ip address: " + ip);
}
exports.testIP = testIP;
//# sourceMappingURL=ip.js.map