"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function formatUrlHost(value, defaultTarget) {
    var hostname = defaultTarget.hostname;
    var port = defaultTarget.port;
    switch (typeof value.hostname) {
        case "undefined": break;
        case "string": {
            hostname = value.hostname;
            break;
        }
        default: {
            throw new Error("origin's hostname must be not set or a string if it's in an object");
        }
    }
    switch (typeof value.port) {
        case "undefined": break;
        case "number": {
            port = value.port;
            break;
        }
        case "string": {
            port = value.port;
            break;
        }
        default: {
            throw new Error("origin's port must be not set, a number or a string if it's in an object");
        }
    }
    return { hostname, port };
}
//# sourceMappingURL=url.js.map