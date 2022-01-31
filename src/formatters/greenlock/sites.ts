
import { JSON_Unknown } from "../../types";
import { GreenlockSite } from "../../types/greenlock";
import { formatHostNameFactory } from "../reused/hostname";
import { formatAltnames } from "./altnames";
import { factory_sortHostnames } from "./sortHostnames";


export function formatSites(
  value: JSON_Unknown
): Array<GreenlockSite> {
  if(!Array.isArray(value)){
    throw new Error("the sites array must be an array");
  }
  if(value.length === 0){
    throw new Error("sites is expected to have at least one value");
  }
  const sortHostnames = factory_sortHostnames((h:GreenlockSite)=>(h.subject))
  const formatHostName = formatHostNameFactory();
  return value.map((value: JSON_Unknown)=>{
    switch(typeof value){
      case "string": {
        const subject = formatHostName(value);
        return {
          subject: subject,
          altnames: [subject],
        };
      }
      case "object": {
        if(Array.isArray(value)){
          throw new Error(
            "each site must not be an array"
          );
        }
        const subject = formatHostName(value.subject);
        return {
          subject: subject,
          altnames: formatAltnames(subject, value.altnames),
        };
      }
      default: {
        throw new Error(
          "each site must be a string or an object, got " + value
        );
      }
    }
  }).sort(sortHostnames);
}
