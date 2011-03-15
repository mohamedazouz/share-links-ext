SharingOptions={
    sites:"",
    init:function(){
        SharingOptions.sites=JSON.parse(localStorage.sharingStaticData);
        SharingOptions.show();
    },
    showanother:function(){
        out="<table>"
        for(i=0;i<SharingOptions.sites.websites.length;i++)
        {
            site=JSON.stringify(SharingOptions.sites.websites[i])
            out+="<tr><td>"
            if(SharingOptions.sites.websites[i].contextMenuId && SharingOptions.sites.websites[i].contextMenuId!=-1){
                out+="<button onclick='SharingOptions.removeSite("+site+","+i+")'> remove " +SharingOptions.sites.websites[i].name+"</button>";
            }else
            {
                out+="<button onclick='SharingOptions.addSite("+site+","+i+")'> Add " +SharingOptions.sites.websites[i].name+"</button>";
            }
            out+="</td></tr>";
        }
        out+="</table>"
        $("#website").html(out)
    },
    addSite:function(site,i){
        pId= parseInt(localStorage.sharingParentID);
        SharingOptions.sites.websites[i].contextMenuId=chrome.extension.getBackgroundPage().ShareLinksBG.createContextMenu(site.name,pId);
        chrome.extension.getBackgroundPage().ShareLinksBG.setData(SharingOptions.sites);
        SharingOptions.show();
        SharingOptions.open(SharingOptions.sites.websites[i].value);
    },
    removeSite:function(site,i) {
        chrome.contextMenus.remove(SharingOptions.sites.websites[i].contextMenuId);
        SharingOptions.sites.websites[i].contextMenuId=-1;
        chrome.extension.getBackgroundPage().ShareLinksBG.setData(SharingOptions.sites);
        SharingOptions.show()
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
            }else
            {
                //out+="<button onclick='SharingOptions.addSite("+site+","+i+")'> Add " +SharingOptions.sites.websites[i].name+"</button>";
                out+="<input name='' type='submit' class='add-button' value='add' onclick='SharingOptions.addSite("+site+","+i+")'/>"
            }
            out+="</div>";
            
        }
        out+="<div class='nl'></div>"
        $("#websites").html(out)
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
        chrome.extension.getBackgroundPage().ShareLinksBG.open(redirecturl,tokenurl);
    },
    save:function(){
        alert($("#rightclick").css());
        alert($("#popup").val());
    }
}

$(function(){
    SharingOptions.init();
});
