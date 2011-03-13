SharingOptions={
    sites:"",
    init:function(){
        SharingOptions.sites=JSON.parse(localStorage.sharingStaticData);
        SharingOptions.show();
    },
    show:function(){
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
    },
    removeSite:function(site,i) {
        chrome.contextMenus.remove(SharingOptions.sites.websites[i].contextMenuId);
        SharingOptions.sites.websites[i].contextMenuId=-1;
        chrome.extension.getBackgroundPage().ShareLinksBG.setData(SharingOptions.sites);
        SharingOptions.show()
    }
}

$(function(){
    SharingOptions.init();
});