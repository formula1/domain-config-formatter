import {
  JSON_Unknown
} from "../../types";

import { factory_sortHostnames } from "./sortHostnames";
import { altnameItertator } from "../reused/altnames";

export function formatAltnames(subject: string, altnames: JSON_Unknown): Array<string>{
  if(typeof altnames === "undefined"){
    return [subject];
  }
  if(!Array.isArray(altnames)){
    throw new Error(
      "The altnames property is expected to be an array of strings"
    );
  }

  const ret = [subject]
  altnameItertator(
    subject, altnames, (v)=>(ret.push(v.subject))
  )
  ret.sort(factory_sortHostnames((s)=>(s)))

  return ret;
}
