var background=chrome.extension.getBackgroundPage();
SharingPopup={
    shortenerUrl:"",
    pageInfo:"",
    sites:"",
    init:function(){
        SharingPopup.getPageInfo(function(response){
            SharingPopup.showCopyShortenerUrl(response);
            $("#page-desc").html(response.title.substr(0, 50));
            $("#page-url").html(response.url.substr(0, 32));
        })
        SharingPopup.sites=JSON.parse(localStorage.sharingStaticData);
        background.ShareLinksBG.getPageImage();
        SharingPopup.show();
    },
    getPageInfo:function(callback){
        chrome.tabs.getSelected(null,function(tab){
            SharingPopup.pageInfo=tab;
            callback(tab)
        })
    },
    copy:function (){
        background.ShareLinksBG.copyurl(SharingPopup.shortenerUrl)
    },
    showCopyShortenerUrl:function(tab){
        background.ShareLinksBG.getShortenerUrl(tab.url,function(response){
            if(response!="error"){
                SharingPopup.shortenerUrl=response.short_url;
                $("#shortenerurl").html(response.short_url)
            }else
            {
                $("#shorturl").hide();
            }
        })
    },
    setPageImage:function(image){
        $("#page-pic").attr("src",image);
    },
    show:function(){
        out="";
        for(i=0;i<SharingPopup.sites.websites.length;i++)
        {
            site=JSON.stringify(SharingPopup.sites.websites[i])
            if(SharingPopup.sites.websites[i].contextMenuId && SharingPopup.sites.websites[i].contextMenuId!=-1){
                out+="<div class='gredient-box f'>";
                out+=" <p class='clickme'>";
                out+="<span class='bullet f'></span>";
                out+="<img src='images/"+SharingPopup.sites.websites[i].value+"-1.png' class='f social-logo' />"
                out+="<span class='f'>"+SharingPopup.sites.websites[i].name+"</span>";
                out+="<span class='f-r'>"+SharingPopup.sites.websites[i].userName+"</span>";
                out+="</p>";
                out+="<div class='fields'>";
                if(SharingPopup.sites.websites[i].value=="facebook"){
                    out+="<label class='f'>أرسل إلى</label>";
                    out+="<span class='input-shadow f'>";
                    out+="<select id='facebookPages' class='f'>";
                    userpages=JSON.parse(localStorage.userPages)
                    out+="<option value='me'>My Wall</option>";
                    for(j=0;j<userpages.length;j++){
                        out+="<option value='"+userpages[j].id+"'>"+userpages[j].name+"</option>";
                    }
                    out+="</select>"
                    out+="</span>";
                    out+="<input name='' type='text' class='f' />";
                }
                out+="<textarea id='"+SharingPopup.sites.websites[i].value+"' cols='' rows='' class='f'></textarea>";
                out+="<input type='submit' class='f-r' value='إرسال' onclick='SharingPopup.share(\""+SharingPopup.sites.websites[i].value+"\")'/>";
                out+="</div>";
                out+="</div>";
                out+="</div>";
            }
        }
        out+="<div class='nl'></div>"
        $("#websites").html(out)
    },
    share:function(type){
        json=SharingPopup.pageInfo;
        json.type=type
        json.msg=$("#"+type).val();
        json.img=$("#page-pic").attr("src")
        if(type=="facebook"){
            json.pageId=$("#facebookPages").val();
        }
        //alert(JSON.stringify(json))
        background.ShareLinksBG.share(json,function(response){
          console.log(response)
        })
    }

}
$(function(){
    SharingPopup.init();
});




               
                    
                    
