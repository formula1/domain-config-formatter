import { TypeValidAllow, UrlHost } from "./reused";
type AllowedUrlOrigin = number | string | Partial<UrlHost>;
export type AllowedConfig = {
  maintainerEmail: string,
  defaultTarget?: AllowedUrlOrigin
  unknownHost?: AllowedUnkownHostConfig,
  sites: Array<AllowedSiteConfig>
}

export type AllowedUnkownHostConfig = {
  allow: TypeValidAllow.NONE
} | {
  allow: TypeValidAllow,
  whitelist?: Array<string>,
  blacklist?: Array<string>,
  target?: AllowedUrlOrigin
}

export type AllowedSiteConfig = AllowedHostname & {
  altnames?: Array<AllowedHostname>,
}

export type AllowedHostname = string | AllowedHostnameObj

export type AllowedHostnameObj = {
  subject: string,
  target?: AllowedUrlOrigin
};
