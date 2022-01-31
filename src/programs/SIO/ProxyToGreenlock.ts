import { Transform } from "stream";
import { JSON_Unknown } from "../../types/JSON";
import { SIOCommand } from "./SIOCommand";
import { formatJsonToGreenlock } from "../../formatters/greenlock";
import { formatJsonToProxy } from "../../formatters/proxy";
import { proxyToGreenlock } from "../../formatters"
import { includes } from "../../util/array";

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



function deepEqual(a: JSON_Unknown,b: JSON_Unknown): boolean{
  if(typeof a !== "object") return a === b;
  if(typeof b !== "object") return false;
  if(a === null) return a === b;
  if(Array.isArray(a) && Array.isArray(b)){
    if(a.length !== b.length) return false;
    return !a.some((item)=>{
      return !includes(b as Array<JSON_Unknown>, item, deepEqual);
    })
  }
  if(Array.isArray(a) || Array.isArray(b)){
    return false;
  }
  const akeys = Object.keys(a);
  const bkeys = Object.keys(b);
  if(akeys.length !== bkeys.length) return false;
  return !akeys.some((key)=>{
    if(!(key in b)) return true;
    return !deepEqual(a[key], b[key]);
  })
}
