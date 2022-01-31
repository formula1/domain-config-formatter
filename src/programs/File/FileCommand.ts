import { Command } from "commander";
import { JSON_Unknown } from "../../types/JSON"
import { promisify } from "util";
import { resolve as pathResolve } from "path";
import {
  readFile as readFileCB,
  writeFile as writeFileCB,
} from "fs";

const readFile = promisify(readFileCB);
const writeFile = promisify(writeFileCB);

type FormatOptions = Partial<{
  pretty: boolean,
  echo: boolean,
  outFile: string,
  replace: boolean
}>

/*

TODO: use file stream and transform instead of loading the entire file at once

*/

type Runner = (v: JSON_Unknown)=>JSON_Unknown;

export class FileCommand extends Command {
  constructor(name: string, fn: Runner){
    super("file-" + name);
    this.argument(
      "[location-of-the-file]",
      [
        "The location where the file is stored.",
        "Can be relative to the current working directory."
      ].join(" "),
      "./sites-config.json"
    )
    .option(
      "-p, --pretty",
      "whether it should be pretty or not when printed"
    ).option(
      "-e, --echo",
      "After the json has been parsed, it will print it to the stdout"
    ).option(
      "-o, --out-file <file>",
      "If you don't want it to overwrite the original config, then you can specify an out file"
    ).option(
      "-r, --replace",

    ).action((path, optionsRaw: FormatOptions)=>{
      action(path, optionsRaw, fn);
    })
  }
}



async function action(path: string, optionsRaw: FormatOptions, fn: Runner){
  const options = formatOptions(optionsRaw);
  path = pathResolve(process.cwd(), path);
  const strIn = await readFile(path, "utf-8");
  const json = JSON.parse(strIn);
  const formattedJson = fn(json);
  const strOut = (
    options.pretty ?
    JSON.stringify(formattedJson, null, 2) :
    JSON.stringify(formattedJson)
  );
  if(options.echo){
    process.stdout.write(strOut);
    process.stdout.write("\n");
  }
  if(options.outFile){
    await writeFile(options.outFile, strOut);
  }
  if(options.replace){
    writeFile(path, strOut);
  }
}

function formatOptions(options: FormatOptions): FormatOptions {
  if(options.outFile){
    options.outFile = pathResolve(process.cwd(), options.outFile);
    return options;
  }
  if(options.echo){
    return options;
  }
  if(options.replace){
    return options;
  }
  return {
    pretty: true,
    echo: true
  }
}
