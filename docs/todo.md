support for secure connections to targets
- right now everything is expected to be insecure, over port 80
- granted, the server can redirect but it might be better to give the option to support secure

support for arbitrary object mapping
- instead of just a string or just a single domain + target or an array
- support key to defaultTarget, target and altnames
  - this way the subject doesn't need to be specified
- in fact it may help avoiding duplicates

error handling isn't always descriptive of what went bad

targets and the proxyconfig2 *might* work fine
- but it's relatively unpredictable what might happen due to the way default targets work
- Either a mapping has a target or it has nested values that lead up to a target
- We cannot leverage default targets except from creating actual targets for a mapping
  - But we should make it more organized what will eventually lead up to a target and what will not
- It may not be *necessary* but its probably a good idea.
- For the time being I'm removing all defaultTargets from the proxy config.
  - Either they will go to an actual target or its a 404


- Recreate Proxy config like this
```javascript
const config = {
  temp: {
    a: {
      target: { hostname: "", port: 80 },
      sites: {
        b: {
          temp: {
            a: {
              temp: {
                b: {
                  temp: {
                    c: {
                      target: { hostname: "", port: 80}
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
```
We do this so that we know explicitly that there is a difference between one mapping and another. But again. No defaults. Either it has a target or it doesn't. Saving space in memory sounds great but I'd rather have a predictable system than something that might work in unexexpected/unpredictable ways.


The default target seems to be for 404s anyway. so maybe im getting a little crazy
Still

Renamed it to be target404
