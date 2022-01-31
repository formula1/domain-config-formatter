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
exports.FromStdInCommand = void 0;
const commander_1 = require("commander");
const transformer_1 = require("./transformer");
class FromStdInCommand extends commander_1.Command {
    constructor() {
        super("stdin");
        this.option("-p, -pretty", "whether it should be pretty or not when printed").option("-sa, --stay-alive", "whether or not the process should close when an error occured").action((optionsRaw) => __awaiter(this, void 0, void 0, function* () {
            const tObj = (0, transformer_1.createTransformer)(optionsRaw);
            process.stdin
                .pipe(tObj.transform)
                .pipe(process.stdout)
                .on("error", (error) => {
                console.error("error in the pipeline around item", tObj.itemNumber);
                console.error(tObj.item);
                console.error(error);
                if (optionsRaw.stayAlive)
                    return;
                throw error;
            });
        }));
    }
}
exports.FromStdInCommand = FromStdInCommand;
//# sourceMappingURL=FromStdIn.js.map