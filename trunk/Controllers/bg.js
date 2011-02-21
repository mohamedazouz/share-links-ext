BG={
    init:function(){
        dbDriver.setup();
        BG.createContextMenu();
    },
    createContextMenu:function(){
        createProperties={
            "title":"share"
        };
        var parent=chrome.contextMenus.create(createProperties);
        createProperties={
            "title":"Facebook",
            "contexts":["all"],
            "onclick":function(OnClickData,tab){
                window.open(Data.Facebook+tab.url);
                dbDriver.insert(tab.url)
            },
            "parentId":parent
        };
        chrome.contextMenus.create(createProperties);
        createProperties={
            "title":"Twitter",
            "contexts":["all"],
            "onclick":function(OnClickData,tab){
                window.open(Data.Twitter+tab.url);
                dbDriver.insert(tab.url)
            },
            "parentId":parent
        };
        chrome.contextMenus.create(createProperties);
        
    }
    
}
