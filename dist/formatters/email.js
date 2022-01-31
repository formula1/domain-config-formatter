"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatEmail = void 0;
const email_1 = require("../validators/email");
function formatEmail(value) {
    if (typeof value !== "string") {
        throw new Error("email is necessary");
    }
    (0, email_1.testEmail)(value);
    return value;
}
exports.formatEmail = formatEmail;
//# sourceMappingURL=email.js.map