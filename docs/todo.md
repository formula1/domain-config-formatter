support for secure connections to targets
- right now everything is expected to be insecure, over port 80
- granted, the server can redirect but it might be better to give the option to support secure

support for arbitrary object mapping
- instead of just a string or just a single domain + target or an array
- support key to defaultTarget, target and altnames
  - this way the subject doesn't need to be specified
- in fact it may help avoiding duplicates
