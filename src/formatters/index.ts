import { AllowedConfig } from "../types/AllowedConfig"
import { ProxyConfig } from "../types";
import { GreenlockConfig, GreenlockSite } from "../types/greenlock";

export * from "./greenlock";
export * from "./proxy";

import { factory_sortHostnames } from "./greenlock/sortHostnames";

export function proxyToGreenlock(pConfig: ProxyConfig): GreenlockConfig{
  const hostNameSorter = factory_sortHostnames((site: GreenlockSite)=>(site.subject))
  const altnameSorter = factory_sortHostnames((altname: string)=>(altname))
  return {
    sites: Object.values(pConfig.sites).map((site)=>{
      return {
        subject: site.subject,
        altnames: [site.subject].concat(
          Object.keys(site.altnames.wild)
        ).concat(
          Object.values(site.altnames.direct).reduce((total, direct)=>{
            return total.concat(Object.keys(direct))
          }, [] as Array<string>)
        ).sort(altnameSorter)
      }
    }).sort(hostNameSorter)
  }
}

export function greenlockToProxy(gConfig: GreenlockConfig): ProxyConfig {
  console.log(gConfig);
  throw new Error(
    "There are some properties that will be missing like maintainerEmail."
    + "\nCould probably just make it for the sites part but I haven't done that"
  )
}


export function greenlockToAllowed(gConfig: GreenlockConfig): AllowedConfig {
  console.log(gConfig);
  throw new Error("This function hasn't been implemented yet");
}

export function proxyToAllowed(pConfig: GreenlockConfig): AllowedConfig {
  console.log(pConfig);
  throw new Error("This function hasn't been implemented yet");
}
