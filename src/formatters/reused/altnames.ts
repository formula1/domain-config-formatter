

import {
  JSON_Unknown, AllowedHostnameObj
} from "../../types";

import { includes } from "../../util/array";
import {
  escapeRegExp
} from "../../util/string";

import { testWildOrDirectSubdomain } from "../../validators/url";

type AltnameValue = {
  subject: string,
  target?: JSON_Unknown
}

export function altnameItertator(
  subject: string,
  altnames: JSON_Unknown,
  callback: (v: AltnameValue)=>any
){
  if(typeof altnames === "undefined"){
    return;
  }
  if(!Array.isArray(altnames)){
    throw new Error(
      "The altnames property is expected to be an array of strings"
    );
  }

  const subjectRegexp = new RegExp("\." + escapeRegExp(subject) + "$");
  const found: Array<string> = [subject];
  altnames.forEach((unknown: JSON_Unknown)=>{
    var v: AltnameValue = {
      subject: ""
    };
    switch(typeof unknown){
      case "string": {
        v.subject = unknown;
        break
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
        v.subject = unknown.subject
        v.target = unknown.target
        break;
      }
      default: {
        throw new Error(
          "Each subdomain is expected to be a string or an object with subject"
          + "\nowned by subject:" + subject
        );
      }
    }
    v.subject = v.subject.toLowerCase();
    if(includes(found, v.subject)){
      console.warn(
        "subdomain " + v.subject + " seems to have a duplicate declaration.",
        "The duplicate will be ignored, but it may throw an error in the future."
      );
      return
    }
    if(!subjectRegexp.test(v.subject)){
      throw new Error(
        "subdomain " + v.subject + " is expected to extend the hostname" + subject
      )
    }
    testWildOrDirectSubdomain(v.subject);
    found.push(v.subject);
    callback(v);
  });
}
