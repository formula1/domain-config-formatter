# Domain Config Fomatter

### How do you use it?

This is meant to be used in conjunction with greenlock express and the custom proxy server.

### What does a config file supposed to like?

Heres a minimilist example. We fill in the rest

```json
{
  "maintainerEmail": "required@email.com",
  "sites": [
    {
      "subject": "host.name",
    }
  ]
}
```
**Required**
- maintainerEmail - The email that will be notified about certificates
- At least one site
  - Each site must have at least subject

**Buy default**
- All traffic from unknown hosts are blocked
- all traffic for sites and unknown hosts will point to `localhost:8080`
  - inorder to change this default, you can set the  `defaultTarget`
- no need to add the subject in the altnames, that is taken care of
  - You can just add wildcards and direct subdomains

**Setting a Target**
- You can specify it as a number
 - `99` => `localhost:99`
- You can specify it as a string
  - `"host.name:99"` => `host.name:99`
- you can specify it as an object
  - `{ hostname: "hello.world", port: 5000 }` => `hello.world:5000`
  - `{ hostname: "hello.world" }` => `hello.world:8080`
  - `{ port: 5000 }` => `localhost:5000`
  - `{}` => `localhost:8080`

**Important**
- Each altname must have the subjects name at the end
  - Example - `host.name` with altnames `[a.host.name, b.host.name]`
  - Failure - `"host.name"` with an altname `[a.hos.name, b.host.nam]`
- You may want to save the format it after each update
  - It sorts the lists so they should be the exact same each update if only positions are changed
  - It removes duplicate altnames
  - It removes altnames covered by wildcards
    - `a.host.name` gets removed if `*.host.name` exists

**Other Notes**
- This module is pretty finicky so if something goes wrong it will throw an error
- One example is you can't have multiple of the same host name
  - Maybe in the future I will allow it and merge multiple
  - but what happens when they have different targets?
    - throw?

```typescript
type AllowedBaseConfig = {
  maintainerEmail: string,
  defaultTarget?: AllowedUrlOrigin
  unknownHostProxy?: AllowedUnkownHostProxyConfig,
  sites: Array<AllowedSiteConfig>
}

type AllowedUnkownHostProxyConfig = {
  allow: "none"
} | {
  allow: "ip" | "hosts" | "all",
  restricted?: Array<string>,
  target?: AllowedUrlOrigin
}

type AllowedSiteConfig = {
  subject: string,
  altnames?: Array<string>,
  target?: AllowedUrlOrigin,
}

type AllowedUrlOrigin = number | string | Partial<{
  hostname: string,
  port: number
}>;



```
