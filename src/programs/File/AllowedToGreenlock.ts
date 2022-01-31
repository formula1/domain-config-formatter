import { formatJsonToGreenlock } from "../../formatters/greenlock";
import { FileCommand } from "./FileCommand";

export class AllowedToGreenlock extends FileCommand {
  constructor(){
    super("greenlock", formatJsonToGreenlock);
  }
}
