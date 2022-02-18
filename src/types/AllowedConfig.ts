import { TypeValidAllow, UrlHost } from "./reused";
type AllowedUrlOrigin = number | string | Partial<UrlHost>;
export type AllowedConfig = {
  maintainerEmail: string,
  defaultTarget?: AllowedUrlOrigin
  unknownHost?: AllowedUnkownHostConfig,
  sites: string | Array<AllowedSiteConfig>
}

export type AllowedUnkownHostConfig = {
  allow: TypeValidAllow.NONE
} | {
  allow: TypeValidAllow,
  whitelist?: Array<string>,
  blacklist?: Array<string>,
  target?: AllowedUrlOrigin
}

export type AllowedSiteConfig = AllowedHostname

export type AllowedHostname = string | AllowedHostnameObj

export type AllowedHostnameObj = {
  subject: string,
} & Partial<{
  defaultTarget: AllowedUrlOrigin,
  target: AllowedUrlOrigin
  altnames: Array<AllowedHostname>
}>;

type AllowedUrlHost = {

}
