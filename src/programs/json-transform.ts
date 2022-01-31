import { Transform } from "stream";
import { JSON_Unknown } from "../types/JSON";

export class BufferToString extends Transform {
  constructor(){
    super({ objectMode: true });
  }
  _transform(b: Buffer, _: any, cb: (err?: any)=>any){
    this.push(b.toString("utf-8"));
    cb();
  }
}

export class JSONParseStream extends Transform {
  private buffer = "";
  constructor(){
    super({ objectMode: true });
  }
  _transform(b: Buffer, _: any, cb: (err?: any)=>any){
    this.buffer += b.toString("utf-8")
    cb();
  }
  _flush(cb: (err?: any)=>any){
    try {
      this.push(
        JSON.parse(this.buffer)
      )
      cb();
    }catch(e){
      cb(e);
    }
  }

}

export class JSONStringifyStream extends Transform {
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
  _flush(cb: (err?: any)=>any){
    this.push("\n")
    cb();
  }
}


export class Logger extends Transform {
  prefix: string;
  constructor(prefix: string){
    super();
    this.prefix = prefix;
  }
  _transform(v: any, _: any, cb: (err?: any)=>any){
    console.log(this.prefix, v);
    this.push(v);
    cb();
  }
}
