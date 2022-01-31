import { JSON_Unknown, JSON_Object, HostMap, UrlHost, Site } from "../../types";

import { formatHostNameFactory } from "../reused/hostname";
import { formatAltnames } from "./altnames";
import { formatTarget } from "./target";


export function formatSites(value: JSON_Unknown, defaultTarget: UrlHost): HostMap {
  const formatHostName = formatHostNameFactory();
  if(typeof value === "string"){
    const subject = formatHostName(value);

    return {
      [subject]: {
        subject: subject,
        altnames: {
          top: subject,
          wild: {},
          direct: {}
        }
      }
    }
  }
  if(!Array.isArray(value)){
    throw new Error("sites is expected to be an array or a string");
  }
  if(value.length === 0){
    throw new Error("sites is expected to have at least 1 value");
  }

  return value.reduce((map: HostMap, value: JSON_Unknown)=>{
    var obj: JSON_Object;
    switch(typeof value){
      case "string": {
        obj = {
          subject: value
        };
        break;
      }
      case "object": {
        if(Array.isArray(value)){
          throw new Error(
            "each site must not be an array"
          );
        }
        obj = value
        break;
      }
      default: {
        throw new Error(
          "each site must be an object with subject or a string, got " + value
        );
      }
    }
    const subject = formatHostName(obj.subject);
    const newObj: Partial<Site> = {
      subject: subject,
    };
    newObj.subject = subject;
    if(obj.target){
      newObj.target = formatTarget(obj.target, defaultTarget);
    }
    newObj.altnames = formatAltnames(subject, obj.altnames, defaultTarget),
    map[subject] = newObj as Site;
    return map;
  }, {});
}
