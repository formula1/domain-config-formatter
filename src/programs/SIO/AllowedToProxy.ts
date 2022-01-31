import { Transform } from "stream";
import { JSON_Unknown } from "../../types/JSON";
import { formatJsonToProxy } from "../../formatters/proxy";
import { SIOCommand } from "./SIOCommand";

export class AllowedToProxy extends SIOCommand {
  constructor(){
    super("proxy", new JSONToProxy());
  }
}

class JSONToProxy extends Transform {
  constructor(){
    super({ objectMode: true })
  }
  _transform(json: JSON_Unknown, _: any, cb: (err?: any)=>any){
    try {
      this.push(formatJsonToProxy(json));
      cb();
    }catch(e){
      cb(e);
    }
  }
}
