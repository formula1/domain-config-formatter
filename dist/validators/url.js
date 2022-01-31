"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testIP = exports.testPort = exports.MAX_PORT_NUMBER = exports.testWildOrDirectDomain = exports.testWildOrDirectSubdomain = exports.testTargetHostname = exports.testDirectDomain = exports.testSubdomain = exports.testHostname = exports.hostnameRegexp = void 0;
const net_1 = require("net");
exports.hostnameRegexp = /^((?!-)[A-Za-z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,6}$/;
function testHostname(hostname) {
    testDirectDomain(hostname);
    if (hostname.split(".").length !== 2) {
        throw new Error("subdomains are supported in their own property: " + hostname);
    }
}
exports.testHostname = testHostname;
function testSubdomain(subdomain) {
    testDirectDomain(subdomain);
    if (subdomain.split(".").length < 3) {
        throw new Error("subdomains are expected to have a length greater than 2:" + subdomain);
    }
}
exports.testSubdomain = testSubdomain;
function testDirectDomain(directdomain) {
    if (directdomain === "") {
        throw new Error("hostname cannot be empty");
    }
    if (!exports.hostnameRegexp.test(directdomain)) {
        throw new Error("the hostname is invalid: " + directdomain);
    }
}
exports.testDirectDomain = testDirectDomain;
const regexp_dockerHost = /^[a-z0-9]+([._\-a-z0-9]*)$/;
function testTargetHostname(hostname) {
    if (regexp_dockerHost.test(hostname)) {
        return;
    }
    if (exports.hostnameRegexp.test(hostname)) {
        return;
    }
    if ((0, net_1.isIP)(hostname)) {
        return;
    }
    throw new Error("Invalid hostname: " + hostname);
}
exports.testTargetHostname = testTargetHostname;
const wildCardRegExp = /^\*\.((?!-)[A-Za-z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,6}$/;
function testWildOrDirectSubdomain(subdomain) {
    if (subdomain === "") {
        throw new Error("subdomain cannot be empty");
    }
    if (subdomain.split(".").length < 3) {
        throw new Error("subdomains are expected to have a length greater than 2: " + subdomain);
    }
    if (exports.hostnameRegexp.test(subdomain))
        return;
    if (wildCardRegExp.test(subdomain))
        return;
    throw new Error("the subdomain is invalid: " + subdomain);
}
exports.testWildOrDirectSubdomain = testWildOrDirectSubdomain;
function testWildOrDirectDomain(domain) {
    if (domain === "") {
        throw new Error("hostname cannot be empty");
    }
    if (exports.hostnameRegexp.test(domain))
        return;
    if (wildCardRegExp.test(domain))
        return;
    throw new Error("hostmame is invalid: " + domain);
}
exports.testWildOrDirectDomain = testWildOrDirectDomain;
exports.MAX_PORT_NUMBER = Math.pow(2, 16) - 1;
function testPort(port) {
    if (port > exports.MAX_PORT_NUMBER) {
        throw new Error(`ports must be less or equal to max ${exports.MAX_PORT_NUMBER}: ${port}`);
    }
    if (port <= 0) {
        throw new Error(`ports must be greater than 0: ${port}`);
    }
}
exports.testPort = testPort;
function testIP(ip) {
    if ((0, net_1.isIP)(ip))
        return;
    throw new Error("invalid ip address: " + ip);
}
exports.testIP = testIP;
//# sourceMappingURL=url.js.map