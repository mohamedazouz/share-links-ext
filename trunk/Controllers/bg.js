BG={
    currenttab:"",
    selectedWebsites:[],
    contextMenueParentId:0,
    shortenerContextId:0,
    init:function(){
        BG.loadData(Data);
        BG.changeSelectedTab();
        BG.createContextMenu();
    },
    createContextMenu:function(){
        createProperties={
            "title":"share"
        };
        BG.contextMenueParentId=chrome.contextMenus.create(createProperties);
        createProperties={
            "title":"Shortner"
        };
        var id=chrome.contextMenus.create(createProperties);
        title="Copy " + JSON.parse(localStorage.shortUrl).message
        createProperties={
            "title":title,
            "contexts":["all"],
            "onclick":function(OnClickData,tab){
                alert("hi")
                BG.copyurl(JSON.parse(localStorage.shortUrl).message);
            },
            "parentId":id
        };
        BG.shortenerContextId=chrome.contextMenus.create(createProperties);
    },
    share:function(site,tab){
        window.open(site.url+tab,"mywindow","width=500,height=400");
    },
    setup:function(){
        chrome.tabs.getSelected(null, function(tab) {
            BG.currenttab=tab;
        });
        window.open("option.html");
    },
    changeSelectedTab:function(){
        BG.setup();
        chrome.tabs.onSelectionChanged.addListener(function(){
            chrome.tabs.getSelected(null, function(tab) {
                BG.currenttab=tab;
                BG.getShortenerUrl();
                BG.updateShortenerContextMenu();
            });
        })
        chrome.tabs.onUpdated.addListener(function(){
            chrome.tabs.getSelected(null, function(tab) {
                BG.currenttab=tab;
                BG.getShortenerUrl();
                BG.updateShortenerContextMenu();
                
            });
        })
    },
    createNewContextMenue:function(site,parentId){
        createProperties={
            "title":site.name,
            "contexts":["all"],
            "onclick":function(OnClickData,tab){
                BG.share(site,tab.url);
            },
            "parentId":parentId
        };
        var contextMenuId=chrome.contextMenus.create(createProperties);
        return contextMenuId;
    },
    loadData:function(Data){
        localStorage.Data=JSON.stringify(Data)
    },
    removeSite:function(site){
        indx=-1;
        for(i=0;i<BG.selectedWebsites.length;i++)
        {
            if(site.name==BG.selectedWebsites[i].name){
                indx=i;
                break;
            }
        }
        if(indx!=-1){
            BG.selectedWebsites.splice(indx, 1);
        }
    },
    removeContextMenue:function(contextMenuId){
        chrome.contextMenus.remove(contextMenuId);
    },
    getShortenerUrl:function(){
        var response;
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", "http://goo.gl/api/shorten?url=" +encodeURIComponent(BG.currenttab.url), false);

        xmlhttp.onload = function()
        {
            var object = JSON.parse(xmlhttp.responseText);

            if(object["short_url"] == undefined)
                response = {
                    status: "error",
                    message: object["error_message"]
                };
            else
                response = {
                    status: "success",
                    message: object["short_url"]
                };
        }
        xmlhttp.send(null);
        localStorage.shortUrl=JSON.stringify(response)
    },
    copyurl:function(text){
        var input = document.getElementById('shorturl');
        input.value =text;
        input.select();
        document.execCommand('Copy');
    },
    updateShortenerContextMenu:function(){
        var updateProperties={
            "title":"Copy" + JSON.parse(localStorage.shortUrl).message,
            "contexts":["all"],
            "onclick":function(OnClickData,tab){
                BG.copyurl(JSON.parse(localStorage.shortUrl).message);
            }
        };
        chrome.contextMenus.update(BG.shortenerContextId,updateProperties)
    }
}
