
import { JSON_Unknown } from "../types"

export function copy<T>(json: T & JSON_Unknown): T {
  return JSON.parse(JSON.stringify(json));
}
