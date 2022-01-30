
import { isIP } from "net";

import {
  JSON_Unknown, JSON_Object,
  UrlHost
} from "../types";

import {
  testPort, testTargetHostname
} from "../validators/url"

const DEFAULT_HOSTNAME = "localhost";
const DEFAULT_PORT = 8080;

export function formatDefaultTarget(value: JSON_Unknown){
  return formatTarget(value, {
    hostname: DEFAULT_HOSTNAME,
    port: DEFAULT_PORT
  })
}

export function formatTarget(value: JSON_Unknown, defaultTarget: UrlHost): UrlHost{
  var hostname: string = defaultTarget.hostname;
  var port: number | string = defaultTarget.port;
  switch(typeof value){
    case "number": {
      port = value;
      break
    }
    case "string": {
      const u = new URL(value);
      hostname = u.hostname || defaultTarget.hostname;
      port = u.port !== "" ? u.port : defaultTarget.port;
      break;
    }
    case "object": {
      if(Array.isArray(value)){
        throw new Error("an origin cannot be an array")
      }
      let v = formatUrlHost(value, defaultTarget);
      hostname = v.hostname;
      port = v.port;
      break;
    }
    default: {
      throw new Error("origin is expected to be a number, string or object");
    }
  }
  if(typeof port === "string"){
    port = Number.parseInt(port);
  }
  testPort(port, hostname);
  testTargetHostname(hostname);
  return {
    hostname, port
  };
}

function formatUrlHost(
  value: JSON_Object, defaultTarget: UrlHost
): {
  hostname: string,
  port: number | string
}{
  var hostname: string = defaultTarget.hostname;
  var port: string | number = defaultTarget.port;
  switch(typeof value.hostname){
    case "undefined": break;
    case "string": {
      hostname = value.hostname;
      break;
    }
    default: {
      throw new Error(
        "origin's hostname must be not set or a string if it's in an object"
      )
    }
  }
  switch(typeof value.port){
    case "undefined": break;
    case "number": {
      port = value.port;
      break;
    }
    case "string": {
      port = value.port;
      break;
    }
    default: {
      throw new Error(
        "origin's port must be not set, a number or a string if it's in an object"
      )
    }
  }
  return {hostname, port};
}
