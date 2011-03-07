SharingPopup={
    init:function(){
      
    },
    open:function(){
        chrome.extension.getBackgroundPage().ShareLinksBG.open();
        
    },
    get_access_token:function(){

        url="http://41.178.64.38:80/sharing_proxy/get_fb_token.php"

    }
}
$(function(){
    SharingPopup.init();
});
