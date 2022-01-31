import { formatJsonToProxy } from "../../formatters/proxy";
import { FileCommand } from "./FileCommand";

export class AllowedToProxy extends FileCommand {
  constructor(){
    super("proxy", formatJsonToProxy);
  }
}
