"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainConfigFormatterCommand = void 0;
const commander_1 = require("commander");
const AllowedToGreenlock_1 = require("./File/AllowedToGreenlock");
const AllowedToProxy_1 = require("./File/AllowedToProxy");
const AllowedToGreenlock_2 = require("./SIO/AllowedToGreenlock");
const AllowedToProxy_2 = require("./SIO/AllowedToProxy");
const ProxyToGreenlock_1 = require("./SIO/ProxyToGreenlock");
class DomainConfigFormatterCommand extends commander_1.Command {
    constructor() {
        super();
        this.version(process.env.npm_package_version || "?");
        this.addCommand(new AllowedToGreenlock_1.AllowedToGreenlock()).addCommand(new AllowedToGreenlock_2.AllowedToGreenlock()).addCommand(new AllowedToProxy_1.AllowedToProxy()).addCommand(new AllowedToProxy_2.AllowedToProxy()).addCommand(new ProxyToGreenlock_1.ProxyToGreenlock());
    }
}
exports.DomainConfigFormatterCommand = DomainConfigFormatterCommand;
if (typeof require !== "undefined") {
    const moduleParents = Object.values(require.cache)
        .filter((m) => m && m.children.includes(module));
    if (moduleParents.length === 0) {
        console.log("ok ok");
        const program = new DomainConfigFormatterCommand();
        console.log("created program");
        console.log("about to parse process.argv", process.argv);
        program.parse(process.argv);
        console.log("parsed argv:");
    }
    else {
        console.error("this module has parents");
    }
}
else {
    console.error("require is not defined");
}
//# sourceMappingURL=index.js.map