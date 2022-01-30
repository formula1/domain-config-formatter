import {
  JSON_Unknown, HostConfig
} from "../../types";

import {
  escapeRegExp
} from "../../util/string";
import { includes } from "../../util/array";

import { testWildOrDirectSubdomain } from "../../validators/url";
import { factory_sortHostnames } from "./sortHostnames";

export function formatSubDomains(subject: string, subdomains: JSON_Unknown){
  const hostConfig = unknownToHostConfig(subject, subdomains);
  return (
    [hostConfig.top]
    .concat(hostConfig.wild.sort(
      factory_sortHostnames((s)=>(s))
    ))
    .concat(
      Object.values(hostConfig.direct).reduce((total, directItems)=>{
        return total.concat(directItems);
      }, []).sort(factory_sortHostnames((s)=>(s)))
    )
  );
}




export function unknownToHostConfig(subject: string, subdomains: JSON_Unknown): HostConfig{
  if(typeof subdomains === "undefined"){
    console.warn(
      "subdomain's is expected top be set.",
      "Will default to just the hostname.",
      "This feature may be removed in a future release"
    )
    return {
      top: subject,
      wild: [],
      direct: {}
    };
  }
  if(!Array.isArray(subdomains)){
    throw new Error(
      "The altnames property is expected to be an array of strings"
    );
  }
  const subjectRegexp = new RegExp("\." + escapeRegExp(subject) + "$");
  const found: Array<string> = [subject];
  const wild: Array<string> = [];
  const direct: { [key: string]: Array<string> } = {};
  subdomains.forEach((subdomain: JSON_Unknown)=>{
    if(typeof subdomain !== "string"){
      throw new Error("Each subdomain is expected to be a string");
    }
    subdomain = subdomain.toLowerCase();
    if(includes(found, subdomain)){
      console.warn(
        "subdomain " + subdomain + " seems to have a duplicate declaration.",
        "The duplicate will be ignored, but it may throw an error in the future."
      );
      return
    }
    if(!subjectRegexp.test(subdomain)){
      throw new Error(
        "subdomain " + subdomain + " is expected to extend the hostname" + subject
      )
    }
    testWildOrDirectSubdomain(subdomain);
    found.push(subdomain);
    if(/^\*/.test(subdomain)){
      wild.push(subdomain);
      if(subdomain in direct){
        console.warn(
          "Seems that you have a wild card that also matches some direct subdomains.",
          "We will delete the direct subdomains but this may be removed in the future."
        )
        delete direct[subdomain];
      }
      return;
    }
    const wildCard = ["*"].concat(
      subdomain.split(".").slice(1)
    ).join(".")
    if(includes(wild, wildCard)){
      console.warn(
        "Seems that you have a wild card that also matches some direct subdomains.",
        "We will delete the direct subdomains but this may be removed in the future."
      );
      return;
    }
    if(!(wildCard in direct)){
      direct[wildCard] = [];
    }
    direct[wildCard].push(subdomain);
  })
  return {
    top: subject,
    wild: wild,
    direct: direct,
  }
}
