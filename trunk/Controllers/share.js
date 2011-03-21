/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
//var background=chrome.extension.getBackgroundPage();
SharingShare={
    site:"",
    init:function(){
        site=JSON.parse(localStorage.onclickedcontext);
        out="</br><a href='' class='f-r'><img src='images/"+site.value+".png' width='31' height='32' alt='"+site.value+"' /></a>";
        out+="<a href='' class='"+site.value+" f'>"+site.name+"</a>";
        if(site.text){
            $("#msg").val(site.text);
        }
        
        $("#shareitem").html(out);
        out="<table>"
        out="<tr><td><b>Image : </b></td><td><img src='"+site.favIconUrl+"' /></td></tr>"
        out+="<tr><td><b>Title :</b></td><td>"+site.pagetitle+"</td></tr>";
        out+="<tr><td><b>Url  : </b></td><td>"+site.url+"</td></tr>";
        $("#desc").html(out);
    },
    share:function(){
        type=site.value;
        json={
            type:type
        }
        if(type=="twitter"){
            json.link=SharingStaticData.twitterUpdatestatus;
        }
        
        ShareLinksBG.share($("#msg").val(), site.url,json);
    }
}

$(function(){
    SharingShare.init();
});


