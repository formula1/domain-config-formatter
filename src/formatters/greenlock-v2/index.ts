
import { JSON_Unknown } from "../../types/JSON";
import { GreenlockConfig } from "../../types/greenlock";
import { formatSites } from "./sites";

export function formatJsonToGreenlock(json: JSON_Unknown): GreenlockConfig{
  if(typeof json !== "object"){
    throw new Error("the config must be an object")
  }
  if(Array.isArray(json)){
    throw new Error("the config cannot be an array")
  }

  return {
    sites: formatSites(json.sites)
  }
}
