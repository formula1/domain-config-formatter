# Domain Config Fomatter

### How do you use it?

This is meant to be used in conjunction with greenlock express and the custom proxy server.

### What is a config file supposed to like?

#### Bare minimum

```json
{
  "maintainerEmail": "required@email.com",
  "sites": "host.name"
}
```

### Old Bare Minimum

```json
{
  "maintainerEmail": "required@email.com",
  "sites": ["host.name"]
}
```

In this example we will convert the string site into a valid greenlock site with a subject and altnames and point all traffic from that site to `localhost:8080`

#### A more complex example

Many here are utilizing the default target.
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
    "z.z",
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

If you want to see an even more complex example, checkout `tests/examples/complex.json`


**Required**
- It's expected to be a valid json file
  - I may allow yaml in the future
- maintainerEmail - The email that will be notified about certificates
- At least one site
  - That site can be a string or be an object with at least a subject

**Buy default**
- All traffic from unknown hosts are blocked
- **WARNING** If unknownHost.allow !== none and there is no white list, everything not covered by the blacklist or the allowed types are allowed through and goes to the resolved target
- all traffic for sites, altnames and unknown hosts should default to `localhost:8080`
  - inorder to change this default, you can set the  `defaultTarget`
  - Each site can also override the default by setting its target
    - Each altsite can override it's subject's target with its own
    - If you'd like an alt site to point to another domain that you host you can just set it like "my.other.site".
      - Ideally the proxy server can see this and handle it internally without having to go through the dns and making an additional request
- no need to add the subject in the altnames, that is taken care of
  - You can just add wildcards and direct subdomains
- we add localhost and 127.0.0.1 to the blacklist
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
- It doesn't matter if the host is not up, this is just for handling configs

**Important**
- Each altname must have the subjects name at the end
  - Example - `host.name` with altnames `[a.host.name, b.host.name]`
  - Failure - `"host.name"` with altnames `[a.hos.name, b.host.nam]`
- You may want to resave the greenlock config after each update of the allowed config
  - It sorts the lists so they should be the exact same each update if only
 positions are changed
  - It removes duplicate altnames
  - It removes altnames covered by wildcards
    - `a.host.name` gets removed if `*.host.name` exists

**Other Notes**
- This module is pretty finicky so if something goes wrong it will throw an error
- One example is you can't have multiple of the same host name
  - Maybe in the future I will allow it and merge multiple
  - but what happens when they have different targets?
    - throw?


**Typescript for Allowed Config**
```typescript
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

export enum TypeValidAllow {
  NONE = "none",
  IP = "ip",
  HOSTS = "hosts",
  ALL = "all",
}

export type AllowedSiteConfig = AllowedHostname & {
  altnames?: Array<AllowedHostname>,
}

export type AllowedHostname = string | AllowedHostnameObj

export type AllowedHostnameObj = {
  subject: string,
  target?: AllowedUrlOrigin
};

type AllowedUrlOrigin = number | string | Partial<UrlHost>;

export type UrlHost = {
  hostname: string,
  port: number
}

```



### Possible issues

- The code doesn't know the containers aliases and may not know the hosts ip addresses
  - It's probably a good idea to blacklist all aliases and ip addresses that point to itself
  - I don't think most servers will loop back but who knows
- This code doesn't check the machine's ip addresses
  - The machine's ip addresses may change so
    - what is ok one moment can be bad
    - what is bad one moment can be ok
  - The proxy server you use should probably black list those ips
- The sites can compile into objects for use with a proxy server. Not sure if sorted list is faster though

### Known issues
- It deletes any direct subdomain that matches a wildcard domain
  - This will prevent certian usage such as
    - admin.dev.host.name => docker_admin
    - *.dev.host.name => docker_dev
  - It may get fixed in the future but for now we remove unnecessarty subdomains
