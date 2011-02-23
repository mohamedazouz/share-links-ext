/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
OPTION={
    sites:"",
    init:function(){
        OPTION.sites=JSON.parse(localStorage.Data)
        OPTION.show();
    },
    show:function(){
        out="<table>"
        for(i=0;i<OPTION.sites.websites.length;i++)
        {
            site=JSON.stringify(OPTION.sites.websites[i])
            out+="<tr><td>"
            if(OPTION.sites.websites[i].contextMenuId!=-1){
                out+="<button onclick='OPTION.removeSite("+site+","+i+")'> remove " +OPTION.sites.websites[i].name+"</button>";
            }else
            {
                out+="<button onclick='OPTION.addSite("+site+","+i+")'> Add " +OPTION.sites.websites[i].name+"</button>";
            }
            out+="</td></tr>";
        }
        out+="</table>"
        $("#website").html(out)
    },
    addSite:function(site,i){
        chrome.extension.getBackgroundPage().BG.selectedWebsites.push(site);
        OPTION.sites.websites[i].contextMenuId=chrome.extension.getBackgroundPage().BG.createNewContextMenue(site,chrome.extension.getBackgroundPage().BG.contextMenueParentId)
        chrome.extension.getBackgroundPage().BG.loadData(OPTION.sites) //save changes
        OPTION.show()
    },
    removeSite:function(site,i) {
        chrome.extension.getBackgroundPage().BG.removeSite(site)
        chrome.extension.getBackgroundPage().BG.removeContextMenue(OPTION.sites.websites[i].contextMenuId);
        OPTION.sites.websites[i].contextMenuId=-1;
        chrome.extension.getBackgroundPage().BG.loadData(OPTION.sites) //save changes
        OPTION.show()
    }
}

