ShareLinksBG={
    init:function(){
        if(!localStorage.installed){
            localStorage.shortrightclick=0;
            localStorage.shortpopup=0;
            localStorage.installed=1;
        }
        ShareLinksBG.createMainContextMenu();
    },
    createMainContextMenu:function(){
        if(localStorage.shortrightclick=="1"){
            localStorage.shortrightclick=ShareLinksBG.createCopyshortContextMenu();
        }
        createProperties={
            "title":"share",
            "contexts":["all"]
        };
        localStorage.sharingParentID=chrome.contextMenus.create(createProperties);
    },
    copyurl:function(text){
        var input = document.getElementById('shorturl');
        input.value =text;
        input.select();
        document.execCommand('Copy');
    },
    getShortenerUrl:function(url,handler){
        $.ajax({
            url:"http://goo.gl/api/shorten?url=" +encodeURIComponent(url),
            type: "POST",
            success: function(shortUrl){
                handler(JSON.parse(shortUrl))
            },
            error:function(){
                handler("error")
            }
        });
    },
    createCopyshortContextMenu:function(){
        createProperties={
            "title":"Copy Shortener url",
            "contexts":["page"],
            "onclick":function(OnClickData,tab){
                ShareLinksBG.getShortenerUrl(tab.url,function(response){
                    ShareLinksBG.copyurl(response.short_url)
                })
            }
        };
        id=chrome.contextMenus.create(createProperties);
        return id;
    }
}
$(function(){
    ShareLinksBG.init();
});