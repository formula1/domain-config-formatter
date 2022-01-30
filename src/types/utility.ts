
import { UrlHost } from "./reused";

export type HostConfig = {
  top: string,
  wild: Array<string>,
  direct: {
    [wildKey: string]: Array<string>
  }
}


export type HostMap = {
  [hostname: string]: {
    subject: string,
    subdomains: HostConfig,
    target: UrlHost
  }
}
