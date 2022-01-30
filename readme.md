# Domain Config Fomatter

### How do you use it?

This is meant to be used in conjunction with greenlock express and the custom proxy server.

### What is a config file supposed to like?

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

Heres a more wordy example. Many here are utilizing the default target.
It's important to note that for subject e.a, the default port will be 80.
But for subject a.a the host will be docker_default and use port 5555.

```json
{
  "maintainerEmail": "required@email.com",
  "defaultTarget": "docker_default:999",
  "unknownHost": {
    "allow": "all",
    "whitelist": ["no.cert.but.i.accept"],
    "blacklist": ["just.in.case"],
    "target": {
      "hostname": "docker_unknown",
      "port": 777
    }
  },
  "sites": [
    {
      "subject": "a.a",
      "altnames": ["a.a.a", "*.a.a.a", "*.b.a.a"],
      "target": 5555,
    },
    {
      "subject": "b.a",
      "altnames": ["a.b.a", "*.a.b.a", "*.b.b.a"],
      "target": "docker_b:80",
    },
    {
      "subject": "c.a",
      "altnames": ["a.c.a", "*.a.c.a", "*.b.c.a"],
      "target": {
        "hostname": "docker_c",
        "port": 987
      }
    },
    {
      "subject": "e.a",
      "target": "docker_e"
    },
    {
      "subject": "d.a",
      "altnames": ["a.d.a", "*.a.d.a", "*.b.d.a"],
    },
    {
      "subject": "f.a",
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
- we add localhost and all the machines ip addresses to the blacklist
  - This is so you don't run into infinite loops

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
- It doesn't matter if the host is not up, we don't check here anyway

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
  unknownHostProxy?: AllowedUnkownHostConfig,
  sites: Array<AllowedSiteConfig>
}

type AllowedUnkownHostConfig = {
  allow: "none"
} | {
  allow: "ip" | "hosts" | "all",
  whitelist?: Array<string>,
  blacklist?: Array<string>,
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



### Possible issues

- The code doesn't know the containers aliases and may not know the hosts ip addresses
  - It's probably a good idea to blacklist all aliases and ip addresses that point to itself
  - I don't think most servers will loop back but who knows
