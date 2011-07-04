var background=chrome.extension.getBackgroundPage();
SharingPopup={
    shortenerUrl:"",
    pageInfo:"",
    sites:"",
    init:function(){
        SharingPopup.getPageInfo(function(response){
            SharingPopup.showCopyShortenerUrl(response,function(callback){
                $("#page-desc").html(response.title.substr(0, 50));
                $("#page-url").html(response.url.substr(0, 32));
                if(callback==1){
                    SharingPopup.sites=JSON.parse(localStorage.sharingStaticData);
                    background.ShareLinksBG.getPageImage();
                    SharingPopup.show();
                }else
                {
                    out="<b>الصفحة غير قابلة للمشاركة لانها صفحة داخليه</b>"
                    $("#websites").html(out)
                }
            });
        })
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
    showCopyShortenerUrl:function(tab,callback){
        background.ShareLinksBG.getShortenerUrl(tab.url,function(response){
            if(response!="error"){
                SharingPopup.shortenerUrl=response.short_url;
                $("#shortenerurl").html(response.short_url)
                callback(1);
            }else
            {
                $("#shorturl").hide();
                callback(0);
            }
        })
    },
    setPageImage:function(image){
        $("#page-pic").attr("src",image);
    },
    clickMe:function(type){
        $("#clickme-"+type).parent().children('.fields').slideToggle('slow');
    },
    show:function(){
        out="";
        for(i=0;i<SharingPopup.sites.websites.length;i++)
        {
            site=JSON.stringify(SharingPopup.sites.websites[i])
            if(SharingPopup.sites.websites[i].contextMenuId && SharingPopup.sites.websites[i].contextMenuId!=-1){
                out+="<div class='gredient-box f'>";
                out+=" <p class='clickme' id='clickme-"+SharingPopup.sites.websites[i].value+"' onclick='SharingPopup.clickMe(\""+SharingPopup.sites.websites[i].value+"\")'>";
                out+="<span class='bullet f'></span>";
                out+="<img src='images/"+SharingPopup.sites.websites[i].value+"-1.png' class='f social-logo' />"
                out+="<span class='f'>"+SharingPopup.sites.websites[i].name+"</span>";
                out+="<span class='f-r'>"+SharingPopup.sites.websites[i].userName+"</span>";
                out+="</p>";
                out+="<div class='fields'>";
                if(SharingPopup.sites.websites[i].value=="facebook"){
                    out+="<label class='f'>إلى</label>";
                    out+="<span class='input-shadow f'>";
                    out+="<select id='facebookPages' class='f'>";
                    userpages=JSON.parse(localStorage.userPages)
                    out+="<option value='me'>صفحتى</option>";
                    for(j=0;j<userpages.length;j++){
                        out+="<option value='"+userpages[j].id+"'>"+userpages[j].name+"</option>";
                    }
                    out+="</select>"
                    out+="</span>";
                }
                if(SharingPopup.sites.websites[i].value=="gmail"){
                    out+="<label class='f'>إلى</label>";
                    out+="<input  type='text' class='f gmail-text' id='to'/>";
                    contacts=JSON.parse(localStorage.gmailUserContact)
                    out+="<input type='hidden' id='from' value='"+contacts[0].email+"'> ";
                    out+="<input type='hidden' id='name-gmail' value='"+SharingPopup.sites.websites[i].userName+"'> ";
                    out+="<label class='f'>الموضوع</label>";
                    out+="<input  type='text' class='f gmail-text' id='su'/>"
                }
                out+="<textarea id='"+SharingPopup.sites.websites[i].value+"' cols='' rows='' class='f'></textarea>";
                out+="<label class='f' id='show-"+SharingPopup.sites.websites[i].value+"'></label>";
                out+="<input type='submit' class='f-r' value='إرسال' onclick='SharingPopup.share(\""+SharingPopup.sites.websites[i].value+"\")'/>";
                out+="</div>";
                out+="</div>";
                out+="</div>";
            }
        }
        if(out==""){
            out+="<b>لا توجد خدمات مختارة من فضلك إذهب الي الاعدادات لاختيار الخدمات المفضلة</b>"
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
        if(type=="gmail"){
            json.to=$("#to").val();
            json.su=$("#su").val();
            json.from=$("#from").val();
            json.userName=$("#name-gmail").val();
        }
        //alert(JSON.stringify(json))
        $("#show-"+type).html("تم بنجاح");
        //background.ShareLinksBG.showValidatingMessage(type)
        background.ShareLinksBG.share(json,function(response){
            out="";
            if(response=="error"){
                out="خطأ عاود مرة اخرة المحاولة"
            }
            console.log(response);
            $("#show-"+type).html(out);
            
        })
    },
    showValidatingMessage:function(type){
        setTimeout("$('#show-'+type).hide();",1000);
         
    }

}
$(function(){
    SharingPopup.init();
});




               
                    
                    
