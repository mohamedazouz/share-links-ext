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
            if(!OPTION.sites.websites[i].selected){
                out+="<tr><td>"
                out+="<button onclick='OPTION.addSite("+site+","+i+")'> Add " +OPTION.sites.websites[i].name+"</button>";
                out+="</td></tr>";
            }
        }
        out+="</table>"
        $("#website").html(out)
    },
    addSite:function(site,i){
        OPTION.sites.websites[i].selected=true;
        chrome.extension.getBackgroundPage().BG.loadData(OPTION.sites) //save changes
        chrome.extension.getBackgroundPage().BG.selectedWebsites.push(site);
        chrome.extension.getBackgroundPage().BG.createNewContextMenue(site,chrome.extension.getBackgroundPage().BG.contextMenueParentId)
    }
}

