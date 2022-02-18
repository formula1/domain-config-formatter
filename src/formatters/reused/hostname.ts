import { JSON_Unknown } from "../../types";

import { testHostname } from "../../validators/url";

import { testWildOrDirectSubdomain } from "../../validators/url";

export const hostnameRegexp = /^((?!-)[A-Za-z0-9-]{1, 63}(?<!-)\\.)+[A-Za-z]{2, 6}$/;
export class HostNameFormatter {
  private foundHosts: Array<string> = []
  formatHostname(hostname: JSON_Unknown){
    return formatHostname(this.foundHosts, hostname)
  }
}

export type HostnameFormatter = (v: JSON_Unknown)=>string

export function formatHostNameFactoryV2(
  ancesters: Array<string> = [], foundHosts: Array<string> = []
){
  return {
    formatHostname(hostname: JSON_Unknown){
      if(typeof hostname !== "string"){
        throw new Error("each site is expected to have a hostname");
      }
      hostname = hostname.toLowerCase();
      testHostname(hostname);
      const fullname = hostname.split(".").concat(ancesters).join(".");
      if(foundHosts.includes(fullname)){
        throw new Error(
          "seems like you have a duplicate config for " + fullname
        );
      }
      testWildOrDirectSubdomain(hostname);
      foundHosts.push(fullname);
      return hostname;
    },
    factory(newAncestors: Array<string>){
      return formatHostNameFactoryV2(newAncestors.concat(ancesters))
    }
  }
}

export function formatHostNameFactory(){
  const foundHosts: Array<string> = [];
  return function(hostname: JSON_Unknown){
    return formatHostname(foundHosts, hostname);
  }
}

export function formatHostname(foundHosts: Array<string>, hostname: JSON_Unknown): string {
  if(typeof hostname !== "string"){
    throw new Error("each site is expected to have a hostname");
  }
  testHostname(hostname);
  if(foundHosts.includes(hostname)){
    throw new Error(
      "seems like you have a duplicate config for " + hostname
    );
  }
  foundHosts.push(hostname);
  return hostname;
}
