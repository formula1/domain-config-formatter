import { Command } from "commander";
import { Transform } from "stream";
import {
  JSONParseStream,
  JSONStringifyStream,
} from "../json-transform";

type Options = {
  pretty?: boolean
  stayAlive?: boolean,
}

export class SIOCommand extends Command {
  constructor(name: string, transform: Transform){
    super("sio-" + name);
    this.option(
      "-p, --pretty",
      "whether it should be pretty or not when printed"
    ).option(
      "-sa, --stay-alive",
      "whether or not the process should close when an error occured"
    ).action(async (options: Options)=>{
      // const options = formatOptions(optionsRaw);
      console.log(options);
      process.stdin.setEncoding('utf8');
      console.log("waiting for readable");
      console.log("stdin is readable")
      process.stdin
      .pipe(new JSONParseStream())
      .pipe(transform)
      .pipe(new JSONStringifyStream(options))
      .pipe(process.stdout)
      .on("error", (error: any)=>{
        if(options.stayAlive) return console.error(error);
        throw error;
      })
      console.log("pipes are setup");
      process.stdin.resume();
    });
  }
}
