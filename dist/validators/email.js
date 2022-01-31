"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testEmail = void 0;
const emailRegexp = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
function testEmail(email) {
    if (!emailRegexp.test(email)) {
        throw new Error("Invalid email: " + email);
    }
}
exports.testEmail = testEmail;
//# sourceMappingURL=email.js.map