script={
    getimage:function(){
        json={
            "getimage":"ok",
            "image":document.getElementsByTagName("img")[0].src
        }
        chrome.extension.sendRequest(json,function(){});
    }

}
