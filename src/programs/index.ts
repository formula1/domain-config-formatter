import { Command } from "commander";

import { AllowedToGreenlock as FileGreenlock } from "./File/AllowedToGreenlock";
import { AllowedToProxy as FileProxy } from "./File/AllowedToProxy";
import { AllowedToGreenlock as SIOGreenlock } from "./SIO/AllowedToGreenlock";
import { AllowedToProxy as SIOProxy } from "./SIO/AllowedToProxy";
import { ProxyToGreenlock } from "./SIO/ProxyToGreenlock";

export class DomainConfigFormatterCommand extends Command {
  constructor(){
    super();
    this.version(process.env.npm_package_version || "?");

    this.addCommand(
      new FileGreenlock()
    ).addCommand(
      new SIOGreenlock()
    ).addCommand(
      new FileProxy()
    ).addCommand(
      new SIOProxy()
    ).addCommand(
      new ProxyToGreenlock()
    );
  }

}
if(typeof require !== "undefined"){
  const moduleParents = Object.values(require.cache)
  .filter((m) => m && m.children.includes(module));
  if(moduleParents.length === 0){
    console.log("ok ok");
    const program = new DomainConfigFormatterCommand();
    console.log("created program");
    console.log("about to parse process.argv", process.argv);
    program.parse(process.argv);
    console.log("parsed argv:");
  } else {
    console.error("this module has parents");
  }
} else {
  console.error("require is not defined");
}
