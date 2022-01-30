import { Transform } from "stream";
import { JSON_Unknown } from "../types/JSON";
import { streamValues } from "stream-json/streamers/StreamValues";
import { formatJsonToConfig } from "../index";



export function createTransformer(options: { pretty?: boolean }){
  var itemNumber = 0;
  var item: JSON_Unknown;
  const t = streamValues()
  .on("data", (newItem: JSON_Unknown)=>{
    itemNumber++;
    item = newItem;
  }).pipe(new FormatJSON())
  .pipe(new JSONStringifyStream(options))

  return {
    transform: t,
    get itemNumber(){ return itemNumber; },
    get item(){ return item; },
  };
}

class FormatJSON extends Transform {
  constructor(){
    super({ objectMode: true })
  }
  _transform(json: JSON_Unknown, _: any, cb: (err?: any)=>any){
    try {
      this.push(formatJsonToConfig(json));
      cb();
    }catch(e){
      cb(e);
    }
  }
}

class JSONStringifyStream extends Transform {
  private pretty: boolean;
  constructor({ pretty }: { pretty?: boolean }){
    super({ objectMode: true });
    this.pretty = !!pretty;
  }
  _transform(json: JSON_Unknown, _: any, cb: (err?: any)=>any){
    try {
      if(this.pretty){
        this.push(
          JSON.stringify(json, null, 2)
        );
      } else {
        this.push(
          JSON.stringify(json)
        );
      }
      cb();
    }catch(e){
      cb(e);
    }

  }
}
