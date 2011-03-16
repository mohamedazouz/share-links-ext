var background=chrome.extension.getBackgroundPage();
SharingPopup={
    init:function(){
        chrome.tabs.getSelected(null,function(tab){
            //please check here if the url is http or https before sharing.
            $("#shorturls").html(background.ShareLinksBG.getShortenerUrl(tab.url));
        })
        if(!localStorage.shortpopup ||localStorage.shortpopup=="false"){
            $("#short").hide();
        }
    },
    open:function(type){
        var redirecturl;
        var tokenurl;
        if(type=="facebook"){
            redirecturl=SharingStaticData.facebookRedirecturl;
            tokenurl=SharingStaticData.facebookAuthTokenurl;
        }
        if(type=="twitter"){
            redirecturl=SharingStaticData.twitterRedirecturl;
            tokenurl=SharingStaticData.twitterAuthTokenurl;
        }
        background.ShareLinksBG.open(redirecturl,tokenurl);
    },
    share:function(type){
        json={
            type:type
        }
        if(type=="twitter"){
            json.link=SharingStaticData.twitterUpdatestatus;
        }
        chrome.tabs.getSelected(null,function(tab){
            background.ShareLinksBG.share($("#msg").val(), tab.url,json);
        })
    },
    openOptionPage:function(){
        chrome.tabs.create({
            url:"views/option.html",
            selected:true
        })
    }
}
$(function(){
    SharingPopup.init();
});
