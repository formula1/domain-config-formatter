
export type GreenlockSite = {
  subject: string,
  altnames: Array<string>
}

export type GreenlockConfig = {
  sites: Array<GreenlockSite>
}
