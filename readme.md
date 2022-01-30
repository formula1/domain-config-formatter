# Domain Config Fomatter

### How do you use it?

This is meant to be used in conjugtion with greenlock express and the custom proxy server.

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

**Important**
- Each altname must have the subjects name at the end
  - Example - `host.name` with altnames `[a.host.name, b.host.name]`
  - Failure - `"host.name"` with an altname `[a.hos.name, b.host.nam]`
- You may want to save the format it after each update
  - We sort the lists so they should be the exact same each update if only positions are changed

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
