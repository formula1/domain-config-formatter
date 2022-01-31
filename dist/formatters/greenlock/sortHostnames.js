"use strict";
/*
  We should never have a wild card and an item with the same splits
  like *.hello.world and sub.hello.world should not exist
  as a result, we should expect each equivilent subdomain to be direct
  We should also never have duplicate subdomains
  can't just reverse the strings because then it would also reverse the names
  ab.hello.world becomes dlrow.olleh.ba
  and
  ba.hello.world becomes dlrow.olleh.ab
  and ba will come before ab which we don't want

  Perhaps it's better to have allo the wildcards on top
  Know what is dangerous and what is not


  The top level domain is always on top
  The wild cards are next with a hostname sort
  The direct are after with a hostname sort

  hostname sort
  - in reverse order we compare domain part
    - ca.ba.ab becomes ab.bc.ca
    - this is to ensure hostnames are still in a readable order
  - we then compare each part to the other part
    - when comparing a.o.z.n.m and z.o.a.n.m
      - m and m are equal - next
      - n and n are equal - next
      - z > a - return 1
    - Anything after a non zero diff doesn't matter
    - Equivelencies shouldn't happen but it returns 0 just in case
  - If all possible parts are matching, the shortest goes first
    - comparing a.a.a.a and a.a
      - a.a is shorter than a.a.a.a
  - Important to note
    - when comparing *.host.name and a.a.host.name
    - We want * to come first
    - fortunately "*".localeCompare("a") === -1
    - This is unlikely to change but its still a significant point


  expected array:
    host.name
    *.host.name
    *.a.host.name
    *.a.a.a.a.a.a.a.a.a.host.name
    *.z.a.a.host.name
    *.a.b.a.host.name
    *.b.a.host.name
    *.b.host.name
    *.bc.host.name
    *.deep.deep.deep.host.name
    *.z.host.name
    sub.a.host.name
    sub.ab.host.name
    b.ba.host.name
    a.bb.host.name
    first.deep.deep.host.name
    second.deep.deep.host.name
    third.deep.deep.host.name
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.factory_sortHostnames = void 0;
function factory_sortHostnames(getter) {
    // caching the splits se we don't have to the operation everytime
    // we seperate by ., reverse the items then remove the first two
    // we don't need the first two because they should be the same
    // We throw an error if they aren't
    const cachedSplits = {};
    return function sortHostnames(aV, bV) {
        const a = getter(aV);
        const b = getter(bV);
        if (!(a in cachedSplits)) {
            cachedSplits[a] = a.split(".").reverse().slice(2);
        }
        if (!(b in cachedSplits)) {
            cachedSplits[b] = b.split(".").reverse().slice(2);
        }
        debugger;
        const aSplit = cachedSplits[a];
        const bSplit = cachedSplits[b];
        const splitDiff = aSplit.length - bSplit.length;
        var minSplit = aSplit, maxSplit = bSplit;
        var ret = splitDiff;
        var reverse = 1;
        if (splitDiff > 0) {
            minSplit = bSplit, maxSplit = aSplit;
            reverse = -1;
        }
        if (minSplit.some((aPart, index) => {
            const bPart = maxSplit[index];
            const v = aPart.localeCompare(bPart);
            if (v === 0)
                return false;
            ret = v;
            return true;
        }))
            return reverse * ret;
        return ret;
    };
}
exports.factory_sortHostnames = factory_sortHostnames;
//# sourceMappingURL=sortHostnames.js.map