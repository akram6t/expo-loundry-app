import { BASE_URL, sampleIcon } from "./Constant";

export  function ImageItentifier(url){
    if(url == null){
        return sampleIcon;
    }
    if(url.includes('https://' || url.includes('http://'))){
        return url;
    }else{
        return BASE_URL + url;
    }
}