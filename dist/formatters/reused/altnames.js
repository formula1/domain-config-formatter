"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.altnameItertator = void 0;
const array_1 = require("../../util/array");
const string_1 = require("../../util/string");
const url_1 = require("../../validators/url");
function altnameItertator(subject, altnames, callback) {
    if (typeof altnames === "undefined") {
        return;
    }
    if (!Array.isArray(altnames)) {
        throw new Error("The altnames property is expected to be an array of strings");
    }
    const subjectRegexp = new RegExp("\." + (0, string_1.escapeRegExp)(subject) + "$");
    const found = [subject];
    altnames.forEach((unknown) => {
        var v = {
            subject: ""
        };
        switch (typeof unknown) {
            case "string": {
                v.subject = unknown;
                break;
            }
            case "object": {
                if (Array.isArray(unknown)) {
                    throw new Error("altnames cannot be arrays for."
                        + "\nowned by subject:" + subject);
                }
                if (typeof unknown.subject !== "string") {
                    throw new Error("When specifying an altname as an object, it needs as subject"
                        + "\nowned by subject:" + subject);
                }
                v.subject = unknown.subject;
                v.target = unknown.target;
                break;
            }
            default: {
                throw new Error("Each subdomain is expected to be a string or an object with subject"
                    + "\nowned by subject:" + subject);
            }
        }
        v.subject = v.subject.toLowerCase();
        if ((0, array_1.includes)(found, v.subject)) {
            console.warn("subdomain " + v.subject + " seems to have a duplicate declaration.", "The duplicate will be ignored, but it may throw an error in the future.");
            return;
        }
        if (!subjectRegexp.test(v.subject)) {
            throw new Error("subdomain " + v.subject + " is expected to extend the hostname" + subject);
        }
        (0, url_1.testWildOrDirectSubdomain)(v.subject);
        found.push(v.subject);
        callback(v);
    });
}
exports.altnameItertator = altnameItertator;
//# sourceMappingURL=altnames.js.map