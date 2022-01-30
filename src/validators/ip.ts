
import { isIP } from "net";

export function testIP(ip: string){
  if(isIP(ip)) return;
  throw new Error(
    "invalid ip address: " + ip
  )
}
