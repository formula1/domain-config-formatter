export enum TypeValidAllow {
  NONE = "none",
  IP = "ip",
  HOSTS = "hosts",
  ALL = "all",
}

export type UrlHost = {
  hostname: string,
  port: number,

  // This will probably be important
  secure?: boolean,
}
