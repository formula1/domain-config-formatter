import { JSON_Unknown, JSON_Object, UrlHost } from "../../types";
import { HostnamePart, SitesMap } from "../../types/ProxyConfig.v2";

import { formatHostNameFactoryV2 } from "../reused/hostname";
import { formatTarget } from "./target";

export function formatSites(
  previousSiteMap: SitesMap,
  value: JSON_Unknown,
  defaultTarget: UrlHost,
  ancestralSubject: Array<string>,
  ancestorFHN: ReturnType<typeof formatHostNameFactoryV2>
): SitesMap {
  if(typeof value === "string"){
    const subject = ancestorFHN.formatHostname(value);
    // we don't need a target for everything
    // a default target should be fine
    // we just need to make sure the hostname resolver successfully finds the subdomain
    // so that it does throw a 404
    addSubjectToMap(subject.split("."), previousSiteMap);
    return previousSiteMap;
  }
  if(!Array.isArray(value)){
    throw new Error(
      "sites is expected to be an array or a string of: " + ancestralSubject.join(".")
    );
  }
  if(value.length === 0){
    throw new Error(
      "sites is expected to have at least 1 value of: " + ancestralSubject.join(".")
    );
  }

  return value.reduce((map: SitesMap, value: JSON_Unknown)=>{
    var allowedAlt: JSON_Object;
    switch(typeof value){
      case "string": {
        allowedAlt = {
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
        allowedAlt = value
        break;
      }
      default: {
        throw new Error(
          "each site must be an object with subject or a string, got " + JSON.stringify(value)
        );
      }
    }
    const subject = ancestorFHN.formatHostname(allowedAlt.subject);
    const splitSubject = subject.split(".");
    // this will take care of setting up the domain name and etc
    const prevPart = getSubjectFromMap(splitSubject, map);
    if(prevPart){
      // We're better off just throwing if theres a duplicate
      // Even if they are exactly the same targets and default targets
      // Even if things are empty, it may result unexpected behaviour
      // if one altname is z.z.z.z and another z.z.z.z.z
      // and z.z.z.z.z comes before z.z.z.z
      console.warn(
        "Found a duplicate for: " + splitSubject.concat(ancestralSubject).join(".")
      );
      handleDuplicatePart(
        allowedAlt,
        splitSubject, ancestralSubject,
        prevPart, defaultTarget, ancestorFHN
      )
    } else {
      handleNewPart(
        allowedAlt,
        splitSubject, ancestralSubject,
        map, defaultTarget, ancestorFHN
      );
    }

    return map;
  }, {});
}

const SymMissing = "missing subject part";
function getSubjectFromMap(splitSubject: Array<string>, map: SitesMap): HostnamePart | void {
  try {
    return splitSubject.reverse().reduce((hostPart: HostnamePart, part: string)=>{
      if(!(part in hostPart)){
        throw SymMissing
      }
      // if we are at the last and we are trying to get the last part and its missing
      // then its a missing part
      // Can't have a defaultTarget or a target on something that is missing
      if(typeof hostPart.sites === "undefined"){
        throw SymMissing;
      }
      return hostPart.sites[part];
    }, { hostnamePart: "dummy", sites: map });
  }catch(e){
    if(e === SymMissing) return;
    throw e;
  }

}


function handleDuplicatePart(
  allowedAlt: JSON_Object,
  splitSubject: Array<string>, ancestralSubject: Array<string>,
  prevPart: HostnamePart, defaultTarget: UrlHost, ancestorFHN: ReturnType<typeof formatHostNameFactoryV2>
){
  if(typeof prevPart.target !== "undefined"){
    throw new Error(
      "This alt has already been defined: " + (splitSubject).concat(ancestralSubject).join(".")
    );
  }
  if(typeof prevPart.defaultTarget !== "undefined"){
    throw new Error(
      "This alt has already been defined: " + (splitSubject).concat(ancestralSubject).join(".")
    );
  }
  if(allowedAlt.target){
    prevPart.target = formatTarget(allowedAlt.target, defaultTarget);
  }
  if(allowedAlt.defaultTarget){
    prevPart.defaultTarget = formatTarget(allowedAlt.defaultTarget, defaultTarget);
  }
  if(allowedAlt.altnames){
    if(typeof prevPart.sites === "undefined"){
      prevPart.sites = {}
    }
    prevPart.sites = formatSites(
      prevPart.sites,
      allowedAlt.altnames,
      prevPart.defaultTarget ? prevPart.defaultTarget : defaultTarget,
      splitSubject.concat(ancestralSubject),
      ancestorFHN.factory(splitSubject)
    );
  }

}

function handleNewPart(
  allowedAlt: JSON_Object,
  splitSubject: Array<string>, ancestralSubject: Array<string>,
  map: SitesMap, defaultTarget: UrlHost, ancestorFHN: ReturnType<typeof formatHostNameFactoryV2>
){
  const lastPart = addSubjectToMap(splitSubject, map);
  if(allowedAlt.target){
    lastPart.target = formatTarget(allowedAlt.target, defaultTarget);
  }
  if(allowedAlt.defaultTarget){
    lastPart.defaultTarget = formatTarget(allowedAlt.defaultTarget, defaultTarget);
  }
  if(allowedAlt.altnames){
    if(typeof lastPart.sites === "undefined"){
      lastPart.sites = {}
    }
    lastPart.sites = formatSites(
      lastPart.sites,
      allowedAlt.altnames,
      lastPart.defaultTarget ? lastPart.defaultTarget : defaultTarget,
      splitSubject.concat(ancestralSubject),
      ancestorFHN.factory(splitSubject)
    );
  }
}



function addSubjectToMap(splitSubject: Array<string>, map: SitesMap): HostnamePart{
  return splitSubject.reverse().reduce((hostPart: HostnamePart, part: string)=>{
    if(typeof hostPart.sites === "undefined"){
      hostPart.sites = {};
    }
    if(!(part in hostPart.sites)){
      hostPart.sites[part] = {
        hostnamePart: part,
      }
    }
    return hostPart.sites[part]
  }, { hostnamePart: "dummy", sites: map });
}
