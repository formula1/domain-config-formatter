import { UrlHost } from "./reused";


export type ProxyConfig = HostnamePart

export type SitesMap = {
  [key: string]: HostnamePart
}

export type HostnamePart = {
  hostnamePart: string,
} & Partial<{
  sites: SitesMap,
  target: UrlHost,
  target404: UrlHost
}>
