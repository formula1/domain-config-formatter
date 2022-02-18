import { ProxyConfig } from "../../types/ProxyConfig.v2";
import { JSON_Unknown } from "../../types/JSON";

import { formatDefaultTarget } from "./target";
import { formatSites } from "./sites";
import { formatHostNameFactoryV2 } from "../reused/hostname";

export function formatJsonToProxy(value: JSON_Unknown): ProxyConfig {
  if(typeof value !== "object"){
    throw new Error("can only format objects")
  }
  if(Array.isArray(value)){
    throw new Error("cannot format an array, need parts like maintainerEmail")
  }
  const formatHostName = formatHostNameFactoryV2();
  const defaultTarget = formatDefaultTarget(value.defaultTarget);
  const obj = {
    hostnamePart: "*",
    defaultTarget: defaultTarget,
    sites: formatSites({}, value.sites, defaultTarget, [], formatHostName),
  }
  return obj;
}
