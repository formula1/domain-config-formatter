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
exports.FromFileCommand = void 0;
const commander_1 = require("commander");
const util_1 = require("util");
const path_1 = require("path");
const fs_1 = require("fs");
const readFile = (0, util_1.promisify)(fs_1.readFile);
const writeFile = (0, util_1.promisify)(fs_1.writeFile);
const index_1 = require("../index");
/*

TODO: use file stream and transform instead of loading the entire file at once

*/
class FromFileCommand extends commander_1.Command {
    constructor() {
        super("file");
        this.argument("[location-of-the-file]", [
            "The location where the file is stored.",
            "Can be relative to the current working directory."
        ].join(" "), "./sites-config.json")
            .option("-p, -pretty", "whether it should be pretty or not when printed").option("-e, --echo", "After the json has been parsed, it will print it to the stdout").option("-o, --out-file <file>", "If you don't want it to overwrite the original config, then you can specify an out file").option("-r, --replace").action((path, optionsRaw) => {
            action(path, optionsRaw);
        });
    }
}
exports.FromFileCommand = FromFileCommand;
function action(path, optionsRaw) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = formatOptions(optionsRaw);
        path = (0, path_1.resolve)(process.cwd(), path);
        const strIn = yield readFile(path, "utf-8");
        const json = JSON.parse(strIn);
        const formattedJson = (0, index_1.formatJsonToConfig)(json);
        const strOut = (options.pretty ?
            JSON.stringify(formattedJson, null, 2) :
            JSON.stringify(formattedJson));
        if (options.echo) {
            yield (0, util_1.promisify)(process.stdout.write)(strOut);
        }
        if (options.outFile) {
            yield writeFile(options.outFile, strOut);
        }
        if (options.replace) {
            writeFile(path, strOut);
        }
    });
}
function formatOptions(options) {
    if (options.outFile) {
        options.outFile = (0, path_1.resolve)(process.cwd(), options.outFile);
        return options;
    }
    if (options.echo) {
        return options;
    }
    if (options.replace) {
        return options;
    }
    return {
        pretty: true,
        echo: true
    };
}
//# sourceMappingURL=FromFile.js.map