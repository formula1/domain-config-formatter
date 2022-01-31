import { Transform } from "stream";
import { JSON_Unknown } from "../../types/JSON";
import { SIOCommand } from "./SIOCommand";
import { formatJsonToGreenlock } from "../../formatters/greenlock";
import { formatJsonToProxy } from "../../formatters/proxy";
import { proxyToGreenlock } from "../../formatters"
import { deepEqual } from "../../util/json";

export class ProxyToGreenlock extends SIOCommand {
  constructor(){
    super("proxy-greenlock", new JSONToGreenlock());
  }
}


class JSONToGreenlock extends Transform {
  constructor(){
    super({ objectMode: true })
  }
  _transform(json: JSON_Unknown, _: any, cb: (err?: any)=>any){
    const greenlock = formatJsonToGreenlock(json);
    const proxy = formatJsonToProxy(json);
    const p_greenlock = proxyToGreenlock(proxy);

    try {
      this.push(deepEqual(greenlock, p_greenlock));
      cb();
    }catch(e){
      cb(e);
    }
  }
}
