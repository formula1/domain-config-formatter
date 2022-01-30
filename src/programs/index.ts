import callsites from "callsites";
import { Command } from "commander";

import { FromFileCommand } from "./FromFile";
import { FromStdInCommand } from "./FromStdIn";

type FormatOptions = Partial<{
  pretty: boolean,
  echo: boolean,
  outFile: string,
}>

type FormatFileOptions = FormatOptions & Partial<{ replace: boolean }>;

export class MultiDomainConfigFormatterCommand extends Command {
  constructor(){
    super();
    this.version(process.env.npm_package_version || "?");

    this.addCommand(
      new FromFileCommand()
    ).addCommand(
      new FromStdInCommand()
    );
  }

}

const sites = callsites();
if(sites.length === 1 && sites[0].getFileName() === __filename){
  process.on("unhandledRejection", (e)=>{
    console.error("unhandledRejection:", e);
    throw e;
  })
  const program = new MultiDomainConfigFormatterCommand();
  program.parse(process.argv);
}
