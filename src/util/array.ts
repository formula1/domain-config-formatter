

export function includes<T>(a: Array<T>, v: T): boolean{
  for(var i = 0, l = a.length; i < l; i++){
    if(a[i] === v) return true;
  }
  return false;
}
