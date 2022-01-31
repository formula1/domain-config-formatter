import { TypeValidAllow, UrlHost } from "./reused";

export type ProxyConfig = {
  maintainerEmail: string,
  defaultTarget: UrlHost
  unknownHost: UnknownHostConfig,
  sites: HostMap,
}

export type UnknownHostConfig = {
  allow: TypeValidAllow.NONE
} | {
  allow: TypeValidAllow,
  whitelist: Array<string>,
  blacklist: Array<string>,
  target?: UrlHost
};

export type HostMap = {
  [hostname: string]: Site
}

export type Site = {
  subject: string,
  target?: UrlHost
  altnames: HostConfig,
}

export type HostConfig = {
  top: string,
  wild: AltnameConfig,
  direct: HostDirectConfig
}

export type HostDirectConfig = {
  [wildKey: string]: AltnameConfig
}

export type AltnameConfig = {
  [subject: string]: ValidTarget
}

export type HostWildConfig = AltnameConfig

export type ValidTarget = true | UrlHost
