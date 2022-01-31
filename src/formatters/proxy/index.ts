import { JSON_Unknown, ProxyConfig } from "../../types";

import { formatEmail } from "./email";
import { formatUnknownHost } from "./unknownHost"
import { formatDefaultTarget } from "./target";
import { formatSites } from "./sites";

export function formatJsonToProxy(value: JSON_Unknown): ProxyConfig {
  if(typeof value !== "object"){
    throw new Error("can only format objects")
  }
  if(Array.isArray(value)){
    throw new Error("cannot format an array, need parts like maintainerEmail")
  }

  const defaultTarget = formatDefaultTarget(value.defaultTarget);
  const obj: ProxyConfig = {
    maintainerEmail: formatEmail(value.maintainerEmail),
    defaultTarget: defaultTarget,
    sites: formatSites(value.sites, defaultTarget),
  }
  const unknownHost = formatUnknownHost(value.unknownHost, defaultTarget)
  if(unknownHost){
    obj.unknownHost = unknownHost;
  }
  return obj;
}
