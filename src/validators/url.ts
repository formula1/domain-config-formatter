import { isIP } from "net";

export const hostnameRegexp = /^((?!-)[A-Za-z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,6}$/;

export function testHostname(hostname: string){
  testDirectDomain(hostname);
  if(hostname.split(".").length !== 2){
    throw new Error(
      "subdomains are supported in their own property: " + hostname
    );
  }
}

export function testSubdomain(subdomain: string){
  testDirectDomain(subdomain);
  if(subdomain.split(".").length < 3){
    throw new Error(
      "subdomains are expected to have a length greater than 2:" + subdomain
    );
  }
}

export function testDirectDomain(directdomain: string){
  if(directdomain === ""){
    throw new Error("hostname cannot be empty");
  }
  if(!hostnameRegexp.test(directdomain)){
    throw new Error(
      "the hostname is invalid: " + directdomain
    )
  }
}

const regexp_dockerHost = /^[a-z0-9]+([._\-a-z0-9]*)$/;
export function testTargetHostname(hostname: string){
  if(regexp_dockerHost.test(hostname)){
    return;
  }
  if(hostnameRegexp.test(hostname)){
    return;
  }
  if(isIP(hostname)){
    return;
  }
  throw new Error(
    "Invalid hostname: " + hostname
  )
}

const wildCardRegExp = /^\*\.((?!-)[A-Za-z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,6}$/;
export function testWildOrDirectSubdomain(subdomain: string){
  if(subdomain === ""){
    throw new Error("subdomain cannot be empty");
  }
  if(subdomain.split(".").length < 3){
    throw new Error(
      "subdomains are expected to have a length greater than 2: " + subdomain
    );
  }
  if(hostnameRegexp.test(subdomain)) return;
  if(wildCardRegExp.test(subdomain)) return;
  throw new Error(
    "the subdomain is invalid: " + subdomain
  );
}

export function testWildOrDirectDomain(domain: string){
  if(domain === ""){
    throw new Error("hostname cannot be empty");
  }
  if(hostnameRegexp.test(domain)) return;
  if(wildCardRegExp.test(domain)) return;
  throw new Error(
    "hostmame is invalid: " + domain
  );
}


export const MAX_PORT_NUMBER = Math.pow(2, 16) - 1;
export function testPort(port: number){
  if(port > MAX_PORT_NUMBER){
    throw new Error(
      `ports must be less or equal to max ${MAX_PORT_NUMBER}: ${port}`
    );
  }
  if(port <= 0){
    throw new Error(
      `ports must be greater than 0: ${port}`
    );
  }
}

export function testIP(ip: string){
  if(isIP(ip)) return;
  throw new Error(
    "invalid ip address: " + ip
  )
}
