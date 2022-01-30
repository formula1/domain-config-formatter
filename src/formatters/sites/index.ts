
import { JSON_Unknown, SiteConfig, UrlHost } from "../../types";
import { formatTarget } from "../url";
import { formatHostNameFactory } from "./hostname";
import { formatSubDomains } from "./subdomains";
import { factory_sortHostnames } from "./sortHostnames";

export function formatSites(
  value: JSON_Unknown, defaultTarget: UrlHost
): Array<SiteConfig> {
  if(!Array.isArray(value)){
    throw new Error("the sites array must be an array");
  }
  if(value.length === 0){
    throw new Error("sites is expected to have at least one value");
  }
  const sortHostnames = factory_sortHostnames((h:SiteConfig)=>(h.subject))
  const formatHostName = formatHostNameFactory();
  return value.map((value: JSON_Unknown)=>{
    if(typeof value !== "object"){
      throw new Error(
        "each site must be an object, got " + value
      );
    }
    if(Array.isArray(value)){
      throw new Error(
        "each site must not be an array"
      );
    }
    const subject = formatHostName(value.subject);
    return {
      subject: subject,
      altnames: formatSubDomains(subject, value.altnames),
      target: formatTarget(value.target, defaultTarget),
    };
  }).sort(sortHostnames);
}
