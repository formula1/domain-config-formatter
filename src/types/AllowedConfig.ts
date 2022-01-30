import { TypeValidAllow, UrlHost } from "./reused";
type AllowedUrlOrigin = number | string | Partial<UrlHost>;
export type AllowedBaseConfig = {
  maintainerEmail: string,
  defaultTarget?: AllowedUrlOrigin
  unknownHost?: AllowedUnkownHostConfig,
  sites: Array<AllowedSiteConfig>
}

type AllowedUnkownHostConfig = {
  allow: TypeValidAllow.NONE
} | {
  allow: TypeValidAllow,
  restricted?: Array<string>,
  target?: AllowedUrlOrigin
}


type AllowedSiteConfig = {
  subject: string,
  altnames?: Array<string>,
  target?: AllowedUrlOrigin,
}
