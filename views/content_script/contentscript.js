script={
    getimage:function(){
        var image="";
        for(i=0;i<document.images.length;i++){
            image=document.images[i].src;
            if(image.substr(image.length-3, image.length) == "jpg"){
                break;
            }
        }
        json={
            "getimage":"ok",
            "image":image
        }
        chrome.extension.sendRequest(json,function(){});
    }

}
