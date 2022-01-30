import { JSON_Unknown, BaseConfig, HostMap } from "../types";

import { formatEmail } from "./email";
import { formatUnknownHost } from "./unknownHost"
import { formatSites } from "./sites";
import { formatHostNameFactory } from "./sites/hostname";
import { unknownToHostConfig } from "./sites/subdomains";
import { formatTarget, formatDefaultTarget } from "./url";

export function formatJsonToConfig(value: JSON_Unknown): BaseConfig {
  if(typeof value !== "object"){
    throw new Error("can only format objects")
  }
  if(Array.isArray(value)){
    throw new Error("cannot format an array, need parts like maintainerEmail")
  }

  const defaultTarget = formatDefaultTarget(value.defaultTarget);

  return {
    maintainerEmail: formatEmail(value.maintainerEmail),
    defaultTarget: defaultTarget,
    unknownHost: formatUnknownHost(value.defaultProxy, defaultTarget),
    sites: formatSites(value.sites, defaultTarget),
  }
}

export function formatToHostMap(value: JSON_Unknown): HostMap {
  if(typeof value !== "object"){
    throw new Error("expecting config to be an object");
  }
  if(Array.isArray(value)){
    throw new Error(
      "config should not be an array"
    );
  }
  if(!Array.isArray(value.sites)){
    throw new Error("sites is expected to be an array");
  }
  if(value.sites.length === 0){
    throw new Error("sites is expected to have at least 1 value");
  }

  const defaultTarget = formatDefaultTarget(value.defaultTarget);

  const formatHostName = formatHostNameFactory();
  return value.sites.reduce((map: HostMap, value: JSON_Unknown)=>{
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
    map[subject] = {
      subject: subject,
      subdomains: unknownToHostConfig(subject, value.altnames),
      target: formatTarget(value.target, defaultTarget),
    };
    return map;
  }, {});
}
