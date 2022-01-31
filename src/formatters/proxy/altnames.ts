import {
  JSON_Unknown,
  HostConfig,
  UrlHost,
  HostWildConfig,
  HostDirectConfig,
  ValidTarget
} from "../../types";

import { includes } from "../../util/array";

import { altnameItertator } from "../reused/altnames";
import { formatTarget } from "./target";

type SubjectWithTarget = {
  subject: string,
  target: ValidTarget
}

export function formatAltnames(subject: string, subdomains: JSON_Unknown, defaultTarget: UrlHost): HostConfig{
  if(typeof subdomains === "undefined"){
    return {
      top: subject,
      wild: {},
      direct: {}
    };
  }
  if(!Array.isArray(subdomains)){
    throw new Error(
      "The altnames property is expected to be an array of strings"
    );
  }

  const wildKeys: Array<string> = [];
  const wild: HostWildConfig = {};
  const direct: HostDirectConfig = {};

  altnameItertator(
    subject, subdomains, (o)=>{
      const v: SubjectWithTarget = {
        subject: o.subject,
        target: true,
      };
      if(typeof o.target !== "undefined"){
        v.target = formatTarget(o.target, defaultTarget)
      }
      if(/^\*/.test(v.subject)){
        wildKeys.push(v.subject);
        wild[v.subject] = v.target
        if(v.subject in direct){
          console.warn(
            "Seems that you have a wild card that also matches some direct subdomains.",
            "We will delete the direct subdomains but this may be removed in the future."
          )
          delete direct[v.subject];
        }
        return;
      }
      const wildCard = ["*"].concat(
        v.subject.split(".").slice(1)
      ).join(".")
      if(includes(wildKeys, wildCard)){
        console.warn(
          "Seems that you have a wild card that also matches some direct subdomains.",
          "We will delete the direct subdomains but this may be removed in the future."
        );
        return;
      }
      if(!(wildCard in direct)){
        direct[wildCard] = {};
      }
      direct[wildCard][v.subject] = v.target;
    }
  )
  return {
    top: subject,
    wild: wild,
    direct: direct,
  }
}
