var background=chrome.extension.getBackgroundPage();
SharingOptions={
    sites:"",
    init:function(){
        SharingOptions.sites=JSON.parse(localStorage.sharingStaticData);
        SharingOptions.show();
        SharingOptions.loadOptions();
    },
    showanother:function(){
        out="<table>"
        for(i=0;i<SharingOptions.sites.websites.length;i++)
        {
            site=JSON.stringify(SharingOptions.sites.websites[i])
            out+="<tr><td>"
            if(SharingOptions.sites.websites[i].contextMenuId && SharingOptions.sites.websites[i].contextMenuId!=-1){
                out+="<button onclick='SharingOptions.removeSite("+site+","+i+")'> remove " +SharingOptions.sites.websites[i].name+"</button>";
            }else{
                out+="<button onclick='SharingOptions.addSite("+site+","+i+")'> Add " +SharingOptions.sites.websites[i].name+"</button>";
            }
            out+="</td></tr>";
        }
        out+="</table>"
        $("#website").html(out)
    },
    addSite:function(site,i){
        SharingOptions.open(SharingOptions.sites.websites[i].value,function(data){
            alert(data)
            pId= parseInt(localStorage.sharingParentID);
            SharingOptions.sites.websites[i].contextMenuId=background.ShareLinksBG.createContextMenu(site.name,pId);
            background.ShareLinksBG.setData(SharingOptions.sites);
            SharingOptions.show();
        });
    },
    removeSite:function(site,i) {
        chrome.contextMenus.remove(SharingOptions.sites.websites[i].contextMenuId);
        SharingOptions.sites.websites[i].contextMenuId=-1;
        background.ShareLinksBG.setData(SharingOptions.sites);
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
            }else{
                //out+="<button onclick='SharingOptions.addSite("+site+","+i+")'> Add " +SharingOptions.sites.websites[i].name+"</button>";
                out+="<input name='' type='submit' class='add-button' value='add' onclick='SharingOptions.addSite("+site+","+i+")'/>"
            }
            out+="</div>";
        }
        out+="<div class='nl'></div>"
        $("#websites").html(out)
    },
    open:function(type,handler){
        var redirecturl;
        var tokenurl;
        if(type=="facebook"){
            redirecturl=SharingStaticData.facebookRedirecturl;
            tokenurl=SharingStaticData.facebookAuthTokenurl;
            background.ShareLinksBG.open(redirecturl,tokenurl,function(data){
                handler(data);
            });
        }
        if(type=="twitter"){
            redirecturl=SharingStaticData.twitterRedirecturl;
            tokenurl=SharingStaticData.twitterAuthTokenurl;
            background.ShareLinksBG.open(redirecturl,tokenurl,function(data){
                handler(data);
            });
        }
        if(type=="gmail"){
            handler("done");
        }

       
    },
    save:function(){
        if($("#popup").attr('checked')){
            alert("hi")
            localStorage.shortpopup=true;
        }else{
            localStorage.shortpopup=false;
        }
        if(localStorage.shortrightclick=="false"){
            if($("#rightclick").attr('checked')){
                localStorage.shortrightclick=background.ShareLinksBG.createCopyshortContextMenu();
            }else{
                chrome.contextMenus.remove(parseInt(localStorage.shortrightclick));
                localStorage.shortrightclick=false;
            }
        }
    },
    loadOptions:function(){
        if(localStorage.shortpopup=="true"){
            document.getElementById("popup").checked=true;
        }
        if(localStorage.shortrightclick!="false"){
            document.getElementById("rightclick").checked=true;

        }
    }
}

$(function(){
    SharingOptions.init();
});
