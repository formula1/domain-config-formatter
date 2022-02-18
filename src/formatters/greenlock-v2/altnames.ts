import {
  JSON_Unknown, AllowedHostnameObj
} from "../../types";

import { includes } from "../../util/array";
import { testWildOrDirectSubdomain } from "../../validators/url";

import { factory_sortHostnames } from "./sortHostnames";

export function formatAltnames(subject: string, altnames: JSON_Unknown, repeat: JSON_Unknown): Array<string>{
  if(typeof altnames === "undefined"){
    return [subject];
  }
  if(!Array.isArray(altnames)){
    throw new Error(
      "The altnames property is expected to be an array of strings"
    );
  }

  const ret = [subject]
  altnameItertator(
    subject, altnames, repeat, (v)=>(ret.push(v))
  )
  ret.sort(factory_sortHostnames((s)=>(s)))

  return ret;
}

export function altnameItertator(
  subject: string,
  subjectsAltnames: JSON_Unknown,
  repeat: JSON_Unknown,
  callback: (v: string)=>any
){
  if(typeof subjectsAltnames === "undefined"){
    return;
  }
  if(!Array.isArray(subjectsAltnames)){
    throw new Error(
      "The altnames property is expected to be an array of strings"
    );
  }

  const splitSubject = subject.split(".");

  const found: Array<string> = [];
  subjectsAltnames.forEach((unknown: JSON_Unknown)=>{
    var {
      altname, altnames, repeat
    } = getSubjectFromAlt(subject, unknown);
    altname = altname.toLowerCase();
    if(includes(found, altname)){
      console.warn(
        "altname " + altname + " from " + subject + " seems to have a duplicate declaration.",
        "The duplicate will be ignored, but it may throw an error in the future."
      );
      return
    }
    const fullSubdomain = altname.split(".").concat(splitSubject).join(".");
    testWildOrDirectSubdomain(fullSubdomain);
    if(Array.isArray(altnames)){
      altnameItertator(fullSubdomain, altnames, repeat, callback);
    }
    found.push(altname);
    callback(altname);
  });
  if(!Array.isArray(repeat)) return;
  found.length = 0;
  repeat.forEach((unknown: JSON_Unknown)=>{
    var {
      altname, repeat
    } = getSubjectFromAlt(subject, unknown);
    if(includes(found, altname)){
      console.warn(
        "repeat " + altname + " + " + subject + " seems to have a duplicate declaration.",
        "The duplicate will be ignored, but it may throw an error in the future."
      );
      return
    }
    const fullSubdomain = altname.split(".").concat(splitSubject).join(".");
    altnameItertator(fullSubdomain, subjectsAltnames, repeat, callback);
  })
}


function getSubjectFromAlt(subject: string, unknown: JSON_Unknown){
  switch(typeof unknown){
    case "string": {
      return {
        altname: unknown
      };
    }
    case "object": {
      if(Array.isArray(unknown)){
        throw new Error(
          "altnames cannot be arrays for."
          + "\nowned by subject:" + subject
        );
      }
      if(typeof unknown.subject !== "string"){
        throw new Error(
          "When specifying an altname as an object, it needs as subject"
          + "\nowned by subject:" + subject
        )
      }
      return {
        altname: unknown.subject,
        altnames: unknown.altnames,
        repeat: unknown.repeat,
      }
    }
    default: {
      throw new Error(
        "Each subdomain is expected to be a string or an object with subject"
        + "\nowned by subject:" + subject
      );
    }
  }
}
