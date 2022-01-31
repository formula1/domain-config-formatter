import { Transform } from "stream";
import { JSON_Unknown } from "../../types/JSON";
import { SIOCommand } from "./SIOCommand";
import { formatJsonToGreenlock } from "../../formatters/greenlock";

export class AllowedToGreenlock extends SIOCommand {
  constructor(){
    super("greenlock", new JSONToGreenlock());
  }
}


class JSONToGreenlock extends Transform {
  constructor(){
    super({ objectMode: true })
  }
  _transform(json: JSON_Unknown, _: any, cb: (err?: any)=>any){
    try {
      this.push(formatJsonToGreenlock(json));
      cb();
    }catch(e){
      cb(e);
    }
  }
}
