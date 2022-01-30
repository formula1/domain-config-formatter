import {
  JSON_Unknown,
  UnknownHostConfig,
  TypeValidAllow
} from "../types";

import { testWildOrDirectDomain } from "../validators/url";
import { testIP } from "../validators/ip";

import { formatHost } from "./url";

export function formatUnknownHost(value: JSON_Unknown, defaultTarget: UrlHost): UnknownHostConfig{
  if(!value){
    return {
      allow: TypeValidAllow.NONE
    }
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
  switch(allow){
    case TypeValidAllow.NONE: return { allow: allow };
    case TypeValidAllow.IP: {
      return {
        allow: allow,
        restricted: formatRestricted(TypeValidAllow.IP, value.restricted),
        target: formatHost(value.target, defaultTarget)
      };
    }
    case TypeValidAllow.HOSTS: {
      return {
        allow: allow,
        restricted: formatRestricted(TypeValidAllow.HOSTS, value.restricted),
        target: formatHost(value.target, defaultTarget)
      };
    }
    case TypeValidAllow.ALL: {
      return {
        allow: allow,
        restricted: formatRestricted(TypeValidAllow.ALL, value.restricted),
        target: formatHost(value.target, defaultTarget)
      };
    }
    default: {
      throw new Error("invalid allow in the default proxy");
    }
  }
}


function formatRestricted(
  allowedTypes: TypeValidAllow, value: JSON_Unknown
): Array<string>{
  if(!value) return [];
  if(!Array.isArray(value)){
    throw new Error(
      "When setting the restricted values for allow, it must be an array"
    )
  }
  if(allowedTypes === TypeValidAllow.NONE) return [];
  return value.map((item: JSON_Unknown)=>{
    if(typeof item !== "string"){
      throw new Error(
        "when setting restricted its expected to be an array of ips or hostnames"
      );
    }
    RestrictedTypeTesters[allowedTypes](item)
    return item;
  });
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
