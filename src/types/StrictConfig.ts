import { TypeValidAllow, UrlHost } from "./reused";

export type BaseConfig = {
  maintainerEmail: string,
  defaultTarget: UrlHost
  unknownHost: UnknownHostConfig,
  sites: Array<SiteConfig>,
}

export type UnknownHostConfig = {
  allow: TypeValidAllow.NONE
} | {
  allow: TypeValidAllow,
  whitelist: Array<string>,
  blacklist: Array<string>,
  target?: UrlHost
};

export type SiteConfig = {
  subject: string,
  altnames: Array<string>,
  target?: UrlHost,
}
