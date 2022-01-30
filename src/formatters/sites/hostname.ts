import { JSON_Unknown } from "../../types";

import { testHostname } from "../../validators/url";

export const hostnameRegexp = /^((?!-)[A-Za-z0-9-]{1, 63}(?<!-)\\.)+[A-Za-z]{2, 6}$/;
export class HostNameFormatter {
  private foundHosts: Array<string> = []
  formatHostname(hostname: JSON_Unknown){
    return formatHostname(this.foundHosts, hostname)
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
