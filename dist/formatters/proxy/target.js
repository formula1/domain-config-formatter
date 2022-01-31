"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatTarget = exports.formatDefaultTarget = void 0;
const url_1 = require("../../validators/url");
const DEFAULT_HOSTNAME = "localhost";
const DEFAULT_PORT = 8080;
function formatDefaultTarget(value) {
    return formatTarget(value, {
        hostname: DEFAULT_HOSTNAME,
        port: DEFAULT_PORT
    });
}
exports.formatDefaultTarget = formatDefaultTarget;
function formatTarget(value, defaultTarget) {
    var hostname = defaultTarget.hostname;
    var port = defaultTarget.port;
    switch (typeof value) {
        case "undefined": break;
        case "number": {
            port = value;
            break;
        }
        case "string": {
            // just providing host and port breaks url
            // providing a fake protocol breaks url
            // so providing an http protocol to be safe
            const u = new URL("http://" + value);
            hostname = u.hostname || defaultTarget.hostname;
            port = u.port !== "" ? u.port : 80;
            break;
        }
        case "object": {
            if (Array.isArray(value)) {
                throw new Error("an origin cannot be an array");
            }
            let v = formatUrlHost(value, defaultTarget);
            hostname = v.hostname;
            port = v.port;
            break;
        }
        default: {
            throw new Error("origin is expected to be a number, string or object");
        }
    }
    if (typeof port === "string") {
        port = Number.parseInt(port);
    }
    (0, url_1.testPort)(port);
    (0, url_1.testTargetHostname)(hostname);
    if (hostname === "localhost" && port === 80) {
        console.warn("setting a target to localhost:80 could cause an infinite loop");
    }
    if (hostname === "localhost" && port === 443) {
        console.warn("setting a target to localhost:443 could cause an infinite loop");
    }
    return {
        hostname, port
    };
}
exports.formatTarget = formatTarget;
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
//# sourceMappingURL=target.js.map