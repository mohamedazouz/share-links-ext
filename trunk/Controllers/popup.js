var background=chrome.extension.getBackgroundPage();
SharingPopup={
    init:function(){
        if(localStorage.shortpopup=="true"){
            chrome.tabs.getSelected(null,function(tab){
                background.ShareLinksBG.getShortenerUrl(tab.url,function(shorturl){
                    var msg="";
                    if(shorturl=="error"){
                        msg=shorturl;
                        $("#short").hide();
                    }else
                    {
                        msg=shorturl.short_url;
                    }
                    $("#shorturls").html(msg);
                })
            })
        }else
        {
            $("#copydiv").hide();
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

    $("#sharequickly").html(chrome.i18n.getMessage("sharequickly"));
    $("#setting").html(chrome.i18n.getMessage("shorternUrl"));
    $("#short").val(chrome.i18n.getMessage("short"));
    $("#setting").html(chrome.i18n.getMessage("setting"));
});
