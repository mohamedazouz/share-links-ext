var background=chrome.extension.getBackgroundPage();
SharingPopup={
    init:function(){
        SharingPopup.showSite();
        if(localStorage.shortpopup=="true"){
            chrome.tabs.getSelected(null,function(tab){
                background.ShareLinksBG.getShortenerUrl(tab.url,function(shorturl){
                    if(shorturl=="error"){
                        $("#copydiv").hide();
                    }else
                    {
                        $("#shorturls").html(shorturl.short_url);
                    }
                    
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
    },
    openopen:function(type){
        chrome.tabs.getSelected(null,function(tab){
            var site={
                url:tab.url,
                pagetitle:tab.title,
                favIconUrl:tab.favIconUrl,
                type:type
            };
            localStorage.onclickedcontext=JSON.stringify(site);
            $("#hi-"+type).toggle();
        })
    },
    getinfo:function(){
        alert(localStorage.onclickedcontext);
    },
    showSite:function(){
        sites=JSON.parse(localStorage.sharingStaticData);
        out="<table>"
        for(i=0;i<sites.websites.length;i++)
        {
            site=JSON.stringify(sites.websites[i])
            
            if(sites.websites[i].contextMenuId && sites.websites[i].contextMenuId!=-1){
                out+="<tr><td>"
                out+="<a onclick='SharingPopup.openopen(\""+sites.websites[i].value+"\")'>"+sites.websites[i].name+"<a>";
                out+="<div id='hi-"+sites.websites[i].value+"' style='display: none'><a onclick='SharingPopup.getinfo()' href='#'>eshta ya m3lem</a></div>";
                out+="</td></tr>";
            }
            
        }
        out+="</table>"
        $("#easyShareArea").html(out)
    }

}
$(function(){
    SharingPopup.init();

    $("#sharequickly").html(chrome.i18n.getMessage("sharequickly"));
    $("#setting").html(chrome.i18n.getMessage("shorternUrl"));
    $("#short").val(chrome.i18n.getMessage("short"));
    $("#setting").html(chrome.i18n.getMessage("setting"));
});
/*
 *
 * <a onclick="SharingPopup.openopen()" name="facebook" id="sharesite">Facebook</a>
                        <div id="hi" style="display: none">
                            <a onclick="SharingPopup.getinfo()" href="#">eshta ya m3lem</a>
                        </div>
 **/