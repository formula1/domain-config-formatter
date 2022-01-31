"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatSites = void 0;
const hostname_1 = require("../reused/hostname");
const altnames_1 = require("./altnames");
const sortHostnames_1 = require("./sortHostnames");
function formatSites(value) {
    const formatHostName = (0, hostname_1.formatHostNameFactory)();
    if (typeof value === "string") {
        const subject = formatHostName(value);
        return [
            {
                subject: subject,
                altnames: [subject]
            }
        ];
    }
    if (!Array.isArray(value)) {
        throw new Error("the sites array must be an array");
    }
    if (value.length === 0) {
        throw new Error("sites is expected to have at least one value");
    }
    const sortHostnames = (0, sortHostnames_1.factory_sortHostnames)((h) => (h.subject));
    return value.map((value) => {
        switch (typeof value) {
            case "string": {
                const subject = formatHostName(value);
                return {
                    subject: subject,
                    altnames: [subject],
                };
            }
            case "object": {
                if (Array.isArray(value)) {
                    throw new Error("each site must not be an array");
                }
                const subject = formatHostName(value.subject);
                return {
                    subject: subject,
                    altnames: (0, altnames_1.formatAltnames)(subject, value.altnames),
                };
            }
            default: {
                throw new Error("each site must be a string or an object, got " + value);
            }
        }
    }).sort(sortHostnames);
}
exports.formatSites = formatSites;
//# sourceMappingURL=sites.js.map