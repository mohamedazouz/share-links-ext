/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
SharingStaticData={
    sharingParentID:null,
    facebookRedirecturl:"https://www.facebook.com/dialog/oauth?client_id=148794918520679&redirect_uri=http://local.activedd.com/azouz/fb_authenticate.php?code&scope=publish_stream,offline_access,manage_pages",
    twitterRedirecturl:"http://local.activedd.com/azouz/twitter_redirect.php",
    gmailRedirectUrl:"http://41.130.147.16:8080/GmailContactProxy/proxy/login.htm",

    facebookAuthTokenurl:"http://local.activedd.com/azouz/get_fb_token.php",
    twitterAuthTokenurl:"http://local.activedd.com/azouz/get_twitter_token.php",
    gmailAuthTokenurl:"http://calendar.activedd.com/authsub/fetchtoken.htm",

    twitterUpdatestatus:"http://local.activedd.com/azouz/twitter_update.php",
    gmailSendMessage:"http://41.130.147.16:8080/GmailContactProxy/proxy/send.htm",

    gmailGetContactlistUrl:"http://41.130.147.16:8080/GmailContactProxy/proxy/getcontacts.htm",
    
    sites:{
        websites:[
        {
            'name':'Facebook',
            'value':'facebook'
        },{
            'name':'Twitter',
            'value':"twitter"
        },{
            'name':'Gmail',
            'value':"gmail"
        }]
    }

}


