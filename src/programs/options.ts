
type Options = { [key: string]: any };

export function formatOptions(opts: Options): Options {
  return Object.keys(opts).reduce((ret: Options, key)=>{
    ret[key.toLowerCase()] = opts[key];
    return ret;
  }, {});
}
