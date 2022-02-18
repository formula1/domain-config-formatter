import { TypeValidAllow, UrlHost } from "./reused";
import { ALTNAMES_MAP_KEY_IDENTIFIER } from "../constants";
type AllowedUrlOrigin = number | string | Partial<UrlHost>;
export type AllowedConfig = {
  maintainerEmail: string,
  unknownHost?: AllowedUnkownHostConfig,
  sites: AllowedHostname | MultiAllowedHostnames
} & TargetConfig

export type AllowedUnkownHostConfig = {
  allow: TypeValidAllow.NONE
} | {
  allow: TypeValidAllow,
  whitelist?: Array<string>,
  blacklist?: Array<string>,
  target?: AllowedUrlOrigin
}

export type AllowedSiteConfig = AllowedHostname

export type AllowedHostname = string | AllowedHostnameObjSubj

type AllowedHostnameMap = { [key: string]: AllowedHostname }

type MultiAllowedHostnames = (
  & AllowedHostnameMap
  & Array<AllowedHostname>
)

export type AllowedHostnameObjSubj = {
  subject: string,
} & AllowedHostnameObj

type AllowedHostnameObj = Partial<{
  target: AllowedUrlOrigin
  altnames: MultiAllowedHostnames
}> & TargetConfig;

type TargetConfig = Partial<{
  defaultTarget: AllowedUrlOrigin,
  target404: AllowedUrlOrigin
}>

type AllowedUrlHost = {

}
