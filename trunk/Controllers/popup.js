SharingPopup={
    init:function(){
      
    },
    openfacebook:function(){
        chrome.extension.getBackgroundPage().ShareLinksBG.openfacebook();
        
    },
    get_access_token:function(){

        url="http://41.178.64.38:80/sharing_proxy/get_fb_token.php"

    },
    sharefacebook:function(){
        chrome.tabs.getSelected(null,function(tab){
            chrome.extension.getBackgroundPage().ShareLinksBG.sharefacebook($("#msg").val(), tab.url);
        })
    },
    opentwitter:function(){
        chrome.extension.getBackgroundPage().ShareLinksBG.opentwitter();
    },
    shareTwitter:function(){
        chrome.tabs.getSelected(null,function(tab){
            chrome.extension.getBackgroundPage().ShareLinksBG.shareTwitter($("#msg").val(), tab.url);
        })
    }
}
$(function(){
    SharingPopup.init();
});
