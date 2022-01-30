import { Command } from "commander";

import { createTransformer } from "./transformer";

type FormatOptions = Partial<{
  pretty: boolean,
  stayAlive: boolean
}>


export class FromStdInCommand extends Command {
  constructor(){
    super("stdin");
    this.option(
      "-p, -pretty",
      "whether it should be pretty or not when printed"
    ).option(
      "-sa, --stay-alive",
      "whether or not the process should close when an error occured"
    ).action(async (optionsRaw: FormatOptions)=>{
      const tObj = createTransformer(optionsRaw);
      process.stdin
      .pipe(tObj.transform)
      .pipe(process.stdout)
      .on("error", (error)=>{
        console.error("error in the pipeline around item", tObj.itemNumber);
        console.error(tObj.item);
        console.error(error)
        if(optionsRaw.stayAlive) return;
        throw error;
      })
    });
  }
}
