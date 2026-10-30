import{useEffect,useState}from"react";import QRCode from"qrcode";
type Props={value:string};
export default function PackQr({value}:Props){const[src,setSrc]=useState("");useEffect(()=>{let active=true;setSrc("");QRCode.toDataURL(value,{errorCorrectionLevel:"M",margin:1,width:320,color:{dark:"#000000",light:"#ffffff"}}).then(url=>{if(active)setSrc(url)}).catch(()=>{if(active)setSrc("")});return()=>{active=false}},[value]);return src?<img src={src} alt={`QR kód balení ${value}`}/>:<div className="qr-loading" aria-label="Generuji QR kód"/>}
