"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatSites = void 0;
const hostname_1 = require("../reused/hostname");
const altnames_1 = require("./altnames");
const target_1 = require("./target");
function formatSites(value, defaultTarget) {
    const formatHostName = (0, hostname_1.formatHostNameFactory)();
    if (typeof value === "string") {
        const subject = formatHostName(value);
        return {
            [subject]: {
                subject: subject,
                altnames: {
                    top: subject,
                    wild: {},
                    direct: {}
                }
            }
        };
    }
    if (!Array.isArray(value)) {
        throw new Error("sites is expected to be an array or a string");
    }
    if (value.length === 0) {
        throw new Error("sites is expected to have at least 1 value");
    }
    return value.reduce((map, value) => {
        var obj;
        switch (typeof value) {
            case "string": {
                obj = {
                    subject: value
                };
                break;
            }
            case "object": {
                if (Array.isArray(value)) {
                    throw new Error("each site must not be an array");
                }
                obj = value;
                break;
            }
            default: {
                throw new Error("each site must be an object with subject or a string, got " + value);
            }
        }
        const subject = formatHostName(obj.subject);
        const newObj = {
            subject: subject,
        };
        newObj.subject = subject;
        if (obj.target) {
            newObj.target = (0, target_1.formatTarget)(obj.target, defaultTarget);
        }
        newObj.altnames = (0, altnames_1.formatAltnames)(subject, obj.altnames, defaultTarget),
            map[subject] = newObj;
        return map;
    }, {});
}
exports.formatSites = formatSites;
//# sourceMappingURL=sites.js.map