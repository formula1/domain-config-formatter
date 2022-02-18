import { JSON_Unknown, JSON_Object, UrlHost } from "../../types";
import { ALLOWED_HOSTNAME_OBJ_KEYS } from "../../constants";
import { HostnamePart, SitesMap } from "../../types/ProxyConfig.v2";

import { formatHostNameFactoryV2 } from "../reused/hostname";
import { formatTarget } from "./target";

export function formatSites(
  previousSiteMap: SitesMap,
  value: JSON_Unknown,
  defaultTarget: UrlHost,
  target404: UrlHost,
  ancestralSubject: Array<string>,
  ancestorFHN: ReturnType<typeof formatHostNameFactoryV2>
){
  if(typeof value === "string"){
    return handleAltnameItem(
      previousSiteMap,
      value,
      defaultTarget,
      target404,
      ancestralSubject,
      ancestorFHN
    )
  }
  if(typeof value !== "object"){
    throw new Error(
      (ancestralSubject.length === 0 ? "sites" : "altnames")
      + " is invalid at " + ancestralSubject.join(".")
      + ", got " + JSON.stringify(value)
    );
  }
  if(!Array.isArray(value)){
    if(ALLOWED_HOSTNAME_OBJ_KEYS.some((key)=>{
      return key in value
    })){
      return handleAltnameItem(
        previousSiteMap,
        value,
        defaultTarget,
        target404,
        ancestralSubject,
        ancestorFHN
      )
    }
    return Object.keys(value).forEach((key)=>{
      const v = value[key]
      if(typeof v !== "object"){
        throw new Error(
          (ancestralSubject.length === 0 ? "sites" : "altnames")
          + " is invalid at " + ancestralSubject.join(".")
          + ", got " + JSON.stringify(value)
        );
      }
      if(Array.isArray(v)){
        const tempAncestor = key.split(".").concat(ancestralSubject);
        return v.forEach((site: JSON_Unknown)=>{
          handleAltnameItem(
            previousSiteMap,
            site,
            defaultTarget,
            target404,
            tempAncestor,
            ancestorFHN
          )
        });
      }
      v.subject = key
      handleAltnameItem(
        previousSiteMap,
        v,
        defaultTarget,
        target404,
        ancestralSubject,
        ancestorFHN
      )
    })
  }
  if(value.length === 0){
    throw new Error(
      "sites is expected to have at least 1 value of: " + ancestralSubject.join(".")
    );
  }

  value.forEach((site: JSON_Unknown)=>{
    handleAltnameItem(
      previousSiteMap,
      site,
      defaultTarget,
      target404,
      ancestralSubject,
      ancestorFHN
    )
  });
}

const AHOK_LEN = ALLOWED_HOSTNAME_OBJ_KEYS.length;

function handleAltnameItem(
  previousSiteMap: SitesMap,
  value: JSON_Unknown,
  defaultTarget: UrlHost,
  target404: UrlHost,
  ancestralSubject: Array<string>,
  ancestorFHN: ReturnType<typeof formatHostNameFactoryV2>
){
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
          "each site must not be an array in: " + ancestralSubject.join(".")
        );
      }
      const ks = Object.keys(value);
      if(ks.length > AHOK_LEN){
        throw new Error(
          "too many keys for a site in: " + ancestralSubject.join(".")
        )
      }
      if(ks.some((k)=>(
        !ALLOWED_HOSTNAME_OBJ_KEYS.includes(k)
      ))){
        throw new Error(
          "There shouldn't be any keys besides "
          + JSON.stringify(ALLOWED_HOSTNAME_OBJ_KEYS)
          + ": " + ancestralSubject.join(".")
        )
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
  const prevPart = getSubjectFromMap(splitSubject, previousSiteMap);
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
      prevPart, defaultTarget, target404, ancestorFHN
    )
  } else {
    handleNewPart(
      allowedAlt,
      splitSubject, ancestralSubject,
      previousSiteMap, defaultTarget, target404, ancestorFHN
    );
  }
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
  prevPart: HostnamePart, defaultTarget: UrlHost, target404: UrlHost, ancestorFHN: ReturnType<typeof formatHostNameFactoryV2>
){
  ["target", "defaultTarget", "target404", "altnames"]
  if(typeof prevPart.target !== "undefined"){
    throw new Error(
      "This alt has already been defined: " + (splitSubject).concat(ancestralSubject).join(".")
    );
  }
  if(typeof prevPart.target404 !== "undefined"){
    throw new Error(
      "This alt has already been defined: " + (splitSubject).concat(ancestralSubject).join(".")
    );
  }

  prevPart.target = formatTarget(allowedAlt.target, defaultTarget);

  if(allowedAlt.defaultTarget){
    defaultTarget = formatTarget(allowedAlt.defaultTarget, target404);
  }
  if(allowedAlt.target404){
    prevPart.target404 = formatTarget(allowedAlt.target404, target404);
  }
  if(allowedAlt.altnames){
    if(typeof prevPart.sites === "undefined"){
      prevPart.sites = {}
    }
    formatSites(
      prevPart.sites,
      allowedAlt.altnames,
      defaultTarget,
      prevPart.target404 ? prevPart.target404 : target404,
      splitSubject.concat(ancestralSubject),
      ancestorFHN.factory(splitSubject)
    );
  }

}

function handleNewPart(
  allowedAlt: JSON_Object,
  splitSubject: Array<string>, ancestralSubject: Array<string>,
  map: SitesMap, defaultTarget: UrlHost, target404: UrlHost, ancestorFHN: ReturnType<typeof formatHostNameFactoryV2>
){
  const lastPart = addSubjectToMap(splitSubject, map);

  lastPart.target = formatTarget(allowedAlt.target, defaultTarget);

  if(allowedAlt.defaultTarget){
    defaultTarget = formatTarget(allowedAlt.defaultTarget, target404);
  }
  if(allowedAlt.target404){
    lastPart.target404 = formatTarget(allowedAlt.target404, target404);
  }
  if(allowedAlt.altnames){
    if(typeof lastPart.sites === "undefined"){
      lastPart.sites = {}
    }
    formatSites(
      lastPart.sites,
      allowedAlt.altnames,
      defaultTarget,
      lastPart.target404 ? lastPart.target404 : target404,
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
