import {
  JSON_Unknown,
  UnknownHostConfig,
  TypeValidAllow,
  UrlHost,
} from "../../types";

import { includes } from "../../util/array";

import { testWildOrDirectDomain, testIP } from "../../validators/url";

import { formatTarget } from "./target";

const BAD_HOSTS = ["localhost"];
const BAD_IPS = ["127.0.0.1"];

export function formatUnknownHost(
  value: JSON_Unknown,
  defaultTarget: UrlHost,
): UnknownHostConfig | void {
  if(!value){
    return
  }
  if(typeof value !== "object"){
    throw new Error("default proxy needs to be an object")
  }
  if(Array.isArray(value)){
    throw new Error("default proxy can't be an array")
  }
  const allow = value.allow;
  if(typeof allow !== "string"){
    throw new Error("The allow needs to be a string");
  }
  var ret;
  switch(allow){
    case TypeValidAllow.NONE: return;
    case TypeValidAllow.IP: {
      return {
        allow: allow,
        blacklist: formatRestricted(TypeValidAllow.IP, value.blacklist),
        whitelist: formatRestricted(TypeValidAllow.IP, value.whitelist),
        target: formatTarget(value.target, defaultTarget)
      };
    }
    case TypeValidAllow.HOSTS: {
      ret = {
        allow: allow,
        blacklist: formatRestricted(TypeValidAllow.HOSTS, value.blacklist),
        whitelist: formatRestricted(TypeValidAllow.HOSTS, value.whitelist),
        target: formatTarget(value.target, defaultTarget)
      };
      break
    }
    case TypeValidAllow.ALL: {
      ret = {
        allow: allow,
        blacklist: formatRestricted(TypeValidAllow.ALL, value.blacklist),
        whitelist: formatRestricted(TypeValidAllow.ALL, value.whitelist),
        target: formatTarget(value.target, defaultTarget)
      };
      break;
    }
    default: {
      throw new Error("invalid allow in the default proxy");
    }
  }
  if(ret.target.port === 443 || ret.target.port === 80){
    if(includes(BAD_HOSTS, ret.target.hostname)){
      throw new Error(
        "The unkown port is " + ret.target.port + " and the hostname directs to the server"
      )
    }
    if(includes(BAD_IPS, ret.target.hostname)){
      throw new Error(
        "The unkown port is " + ret.target.port + " and the hostname directs to the server"
      )
    }
    console.warn(
      "Setting the default port to 443 or 80 may result in an infinite loop",
      "If the default .",
      "just in case we've added localhost and 127.0.0.1 to the blacklist."
    );
    console.warn(
      "Any proxy server you use should probably respect the X-Forwarded-For when it comes to blacklists"
    )
    console.warn(
      "But really infinite loops don't need to be port 443 or 80 to happen.",
      "We're just trying to be safe."
    )
    ret.blacklist.push(...BAD_HOSTS);
    ret.blacklist.push(...BAD_IPS);
  }
  return ret;
}


function formatRestricted(
  allowedTypes: TypeValidAllow, value: JSON_Unknown
): Array<string>{
  if(!value) return [];
  if(allowedTypes === TypeValidAllow.NONE) return [];
  if(!Array.isArray(value)){
    throw new Error(
      "When setting the restricted values for allow, it must be an array"
    )
  }
  const found: Array<string> = [];
  value.forEach((item: JSON_Unknown)=>{
    if(typeof item !== "string"){
      throw new Error(
        "when setting restricted its expected to be an array of ips or hostnames"
      );
    }
    RestrictedTypeTesters[allowedTypes](item)
    if(includes(found, item)) return;
    found.push(item)
  });
  return found;
}

const RestrictedTypeTesters = {
  [TypeValidAllow.ALL]: (item: string)=>{
    // Todo
    try {
      return testWildOrDirectDomain(item);
    }catch(e){}
    try{
      return testIP(item);
    }catch(e){}
    throw new Error(
      "when allowing all with restrictions, need to provide an ip or direct domain name"
    )
  },
  [TypeValidAllow.IP]: (item: string)=>{
    testIP(item)
  },
  [TypeValidAllow.HOSTS]: (item: string)=>{
    testWildOrDirectDomain(item);
  }
}
