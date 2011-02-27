ShareLinksBG={
    selectedText:"",
    pageurl:"",
    init:function(){
      ShareLinksBG.createContextMenu();
    },
    createContextMenu:function(){
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
            "contexts":["page"],
            "onclick":function(OnClickData,tab){
                ShareLinksBG.pageurl=tab.url
                console.log("URL:"+ShareLinksBG.pageurl)
            }
        };
        chrome.contextMenus.create(createProperties);
    }
}
$(function(){
    ShareLinksBG.init();
});