import { isIP } from "net";

export const hostnameRegexp = /^((?!-)[A-Za-z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,6}$/;

export function testHostname(hostname: string){
  testDirectDomain(hostname);
  if(hostname.split(".").length !== 2){
    throw new Error(
      "subdomains are supported in their own property"
    );
  }
}

export function testSubdomain(subdomain: string){
  testDirectDomain(subdomain);
  if(subdomain.split(".").length < 3){
    throw new Error(
      "subdomains are expected to have a length greater than 2"
    );
  }
}

export function testDirectDomain(directdomain: string){
  if(directdomain === ""){
    throw new Error("subdomain cannot be empty");
  }
  if(!hostnameRegexp.test(directdomain)){
    throw new Error(
      "the subdomain " + directdomain + " is invalid"
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

const wildCardRegExp = /^\*\.((?!-)[A-Za-z0-9-]{1, 63}(?<!-)\\.)+[A-Za-z]{2, 6}/;
export function testWildOrDirectSubdomain(subdomain: string){
  if(subdomain === ""){
    throw new Error("subdomain cannot be empty");
  }
  if(subdomain.split(".").length < 3){
    throw new Error(
      "subdomains are expected to have a length greater than 2"
    );
  }
  if(hostnameRegexp.test(subdomain)) return;
  if(wildCardRegExp.test(subdomain)) return;
  throw new Error(
    "the subdomain " + subdomain + " is invalid"
  );
}

export function testWildOrDirectDomain(domain: string){
  if(domain === ""){
    throw new Error("subdomain cannot be empty");
  }
  if(hostnameRegexp.test(domain)) return;
  if(wildCardRegExp.test(domain)) return;
  throw new Error(
    "the domain " + domain + " is invalid"
  );
}


export const MAX_PORT_NUMBER = Math.pow(2, 16) - 1;
export function testPort(port: number, where: string){
  if(port > MAX_PORT_NUMBER){
    throw new Error(
      `the port from ${where} must be a number from 0 to ${MAX_PORT_NUMBER}`
    );
  }
  if(port < 0){
    throw new Error(
      `the port from ${where} must be a number from 0 to ${MAX_PORT_NUMBER}`
    );
  }
}

export function testIP(ip: string){
  if(isIP(ip)) return;
  throw new Error(
    "invalid ip address: " + ip
  )
}
