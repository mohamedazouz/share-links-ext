var background=chrome.extension.getBackgroundPage();
SharingOptions={
    sites:"",
    init:function(){
        $("#loader").hide();
        SharingOptions.sites=JSON.parse(localStorage.sharingStaticData);
        SharingOptions.show();
    // SharingOptions.loadOptions();
    },
    show:function(){
        out="";
        for(i=0;i<SharingOptions.sites.websites.length;i++)
        {
            site=JSON.stringify(SharingOptions.sites.websites[i])
            out+="<div class='service f'>";
            out+="<div class='service-logo'>";
            out+="<img src='images/option-"+SharingOptions.sites.websites[i].value+".png' width='43' height='58' />";
            out+="</div>";
            out+="<div class='services-texts "+SharingOptions.sites.websites[i].value+"'>"+SharingOptions.sites.websites[i].name+"</div>";
            if(SharingOptions.sites.websites[i].contextMenuId && SharingOptions.sites.websites[i].contextMenuId!=-1){
                //out+="<button onclick='SharingOptions.removeSite("+site+","+i+")'> remove " +SharingOptions.sites.websites[i].name+"</button>";
                out+="<input name='' type='submit' class='add-button' value='remove' onclick='SharingOptions.removeSite("+site+","+i+")'/>"
            }else{
                //out+="<button onclick='SharingOptions.addSite("+site+","+i+")'> Add " +SharingOptions.sites.websites[i].name+"</button>";
                out+="<input name='' type='submit' class='add-button' value='add' onclick='SharingOptions.addSite("+site+","+i+")'/>"
                
            }
            username=''
            if(SharingOptions.sites.websites[i].userName){
                username=SharingOptions.sites.websites[i].userName
            }
            out+="<div style='text-align: center;' id='username'>"+username+"</div>";
            out+="</div>";
        }
        out+="<div class='nl'></div>"
        $("#websites").html(out)
    },
    addSite:function(site,i){
        $("#loader").show();
        SharingOptions.open(SharingOptions.sites.websites[i].value,function(data){
            $("#loader").hide();
            pId= parseInt(localStorage.sharingParentID);
            SharingOptions.sites.websites[i].contextMenuId=background.ShareLinksBG.createContextMenu(site.name,pId);
            SharingOptions.sites.websites[i].userName=data;
            background.ShareLinksBG.setData(SharingOptions.sites);
            SharingOptions.show();
        });
    },
    removeSite:function(site,i) {
        SharingOptions.sites.websites[i].userName=null
        chrome.contextMenus.remove(SharingOptions.sites.websites[i].contextMenuId);
        SharingOptions.sites.websites[i].contextMenuId=-1;
        background.ShareLinksBG.setData(SharingOptions.sites);
        SharingOptions.show()
    },
    open:function(type,handler){
        var redirecturl;
        var tokenurl;
        if(type=="facebook"){
            redirecturl=SharingStaticData.facebookRedirecturl;
            tokenurl=SharingStaticData.facebookAuthTokenurl;
            background.ShareLinksBG.open(redirecturl,tokenurl,function(data){
                background.ShareLinksBG.getFacebookUserInfo(window.localStorage.access_token,function(response){
                    handler(response);
                });
            });
        }
        if(type=="twitter"){
            redirecturl=SharingStaticData.twitterRedirecturl;
            tokenurl=SharingStaticData.twitterAuthTokenurl;
            background.ShareLinksBG.open(redirecturl,tokenurl,function(data){
                background.ShareLinksBG.getTwitterUserInfo(function(response){
                    handler(response);
                })
                
            });
        }
        if(type=="gmail"){
            redirecturl=SharingStaticData.gmailRedirectUrl;
            tokenurl=SharingStaticData.gmailAuthTokenurl;
            background.ShareLinksBG.open(redirecturl,tokenurl,function(data){
                background.ShareLinksBG.getGmailUserInfo(function(response){
                    handler(response);
                })
            });
        }       
    },
    save:function(){
        if($("#popup").attr('checked')){
            localStorage.shortpopup=1;
        }else{
            localStorage.shortpopup=0;
        }
        if($("#rightclick").attr('checked')){
            localStorage.shortrightclick=background.ShareLinksBG.createCopyshortContextMenu();
        }else{
            chrome.contextMenus.remove(parseInt(localStorage.shortrightclick));
            localStorage.shortrightclick=0;
        }
    },
    loadOptions:function(){
        if(localStorage.shortpopup=="1"){
            document.getElementById("popup").checked=true;
        }
        if(localStorage.shortrightclick!="0"){
            document.getElementById("rightclick").checked=true;
        }
    }
}

$(function(){
    SharingOptions.init();
});
