ShareLinksBG={
    selectedText:"",
    pageurl:"",
    init:function(){
        ShareLinksBG.createMainContextMenu();
        ShareLinksBG.createContextMenu("share");
    },
    createMainContextMenu:function(){
        createProperties={
            "title":"text",
            "contexts":["selection"],
            "onclick":function(OnClickData,tab){
                ShareLinksBG.selectedText=OnClickData.selectionText
                console.log("selections:"+ShareLinksBG.selectedText)
            }
        };
        chrome.contextMenus.create(createProperties);
        createProperties={
            "title":"share",
            "contexts":["page"]
        };
        SharingStaticData.sharingParentID=chrome.contextMenus.create(createProperties);
        ShareLinksBG.setData(SharingStaticData)
        createProperties={
            "title":"Copy Shortener url",
            "contexts":["page"],
            "onclick":function(OnClickData,tab){
                ShareLinksBG.getShortenerUrl(tab.url)
            },
            "parentId":SharingStaticData.sharingParentID
        };
        chrome.contextMenus.create(createProperties);
    },
    setData:function(Data){
        localStorage.sharingStaticData=JSON.stringify(Data);
    },
    getdata:function(){
        return localStorage.sharingStaticData;
    },
    createContextMenu:function(name){
        createProperties={
            "title":name,
            "contexts":["all"],
            "onclick":function(OnClickData,tab){
                ShareLinksBG.pageurl=tab.url
                console.log("URL:"+ShareLinksBG.pageurl)
                alert(tab.url)
            },
            "parentId":SharingStaticData.sharingParentID
        };
        chrome.contextMenus.create(createProperties);
    },
    copyurl:function(text){
        var input = document.getElementById('shorturl');
        input.value =text;
        input.select();
        document.execCommand('Copy');
    },
    getShortenerUrl:function(url){
        var response;
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", "http://goo.gl/api/shorten?url=" +encodeURIComponent(url), false);

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
        ShareLinksBG.copyurl(response.message);
    },
    share:function(){
        alert("share......................")
    }
}
$(function(){
    ShareLinksBG.init();
});