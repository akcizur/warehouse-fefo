export function nextId(prefix:string,existingIds:string[],digits=prefix==="MOV"?6:4):string {
  const marker=prefix+"-";
  const max=existingIds.reduce((current,value)=>{
    if(!value.startsWith(marker)) return current;
    const suffix=value.slice(marker.length);
    return /^\d+$/.test(suffix)?Math.max(current,Number(suffix)):current;
  },0);
  return prefix+"-"+String(max+1).padStart(digits,"0");
}

export function isValidExpiry(value:string):boolean {
  return /^(0[1-9]|1[0-2])\/\d{2}$/.test(value.trim());
}

export function expiry(value:string):number {
  const match=value.match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
  return match?new Date(2000+Number(match[2]),Number(match[1]),0).getTime():Number.MAX_SAFE_INTEGER;
}
