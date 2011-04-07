/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
SharingStaticData={
    sharingParentID:null,
    facebookRedirecturl:"https://www.facebook.com/dialog/oauth?client_id=185034264867265&redirect_uri=http://local.activedd.com/azouz/fb_authenticate.php?code&scope=publish_stream,offline_access",
    twitterRedirecturl:"http://local.activedd.com/azouz/twitter_redirect.php",
    facebookAuthTokenurl:"http://local.activedd.com/azouz/get_fb_token.php",
    twitterAuthTokenurl:"http://local.activedd.com/azouz/get_twitter_token.php",
    twitterUpdatestatus:"http://local.activedd.com/azouz/twitter_update.php",
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
        }/*,{
            'name':'GoogleBookmarks',
            'value':"google"   
        },{
            'name':'Linkedin',
            'value':"linked"
        },{
            'name':'YahooMail',
            'value':"yahoo"
        }*/]
    }

}


