"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SIOCommand = void 0;
const commander_1 = require("commander");
const json_transform_1 = require("../json-transform");
class SIOCommand extends commander_1.Command {
    constructor(name, transform) {
        super("sio-" + name);
        this.option("-p, --pretty", "whether it should be pretty or not when printed").option("-sa, --stay-alive", "whether or not the process should close when an error occured").action((options) => __awaiter(this, void 0, void 0, function* () {
            // const options = formatOptions(optionsRaw);
            console.log(options);
            process.stdin.setEncoding('utf8');
            console.log("waiting for readable");
            console.log("stdin is readable");
            process.stdin
                .pipe(new json_transform_1.JSONParseStream())
                .pipe(transform)
                .pipe(new json_transform_1.JSONStringifyStream(options))
                .pipe(process.stdout)
                .on("error", (error) => {
                if (options.stayAlive)
                    return console.error(error);
                throw error;
            });
            console.log("pipes are setup");
            process.stdin.resume();
        }));
    }
}
exports.SIOCommand = SIOCommand;
//# sourceMappingURL=SIOCommand.js.map