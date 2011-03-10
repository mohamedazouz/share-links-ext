ShareLinksBG={
    selectedText:"",
    pageurl:"",
    init:function(){
        ShareLinksBG.createMainContextMenu();
        ShareLinksBG.createContextMenu("share");
    },
    createMainContextMenu:function(){
        createProperties={
            "title":"text",
            "contexts":["selection"],
            "onclick":function(OnClickData,tab){
                ShareLinksBG.selectedText=OnClickData.selectionText
                console.log("selections:"+ShareLinksBG.selectedText)
            }
        };
        chrome.contextMenus.create(createProperties);
        createProperties={
            "title":"share",
            "contexts":["page"]
        };
        SharingStaticData.sharingParentID=chrome.contextMenus.create(createProperties);
        ShareLinksBG.setData(SharingStaticData)
        createProperties={
            "title":"Copy Shortener url",
            "contexts":["page"],
            "onclick":function(OnClickData,tab){
                ShareLinksBG.getShortenerUrl(tab.url)
            },
            "parentId":SharingStaticData.sharingParentID
        };
        chrome.contextMenus.create(createProperties);
    },
    setData:function(Data){
        localStorage.sharingStaticData=JSON.stringify(Data);
    },
    getdata:function(){
        return localStorage.sharingStaticData;
    },
    createContextMenu:function(name){
        createProperties={
            "title":name,
            "contexts":["all"],
            "onclick":function(OnClickData,tab){
                ShareLinksBG.pageurl=tab.url
                console.log("URL:"+ShareLinksBG.pageurl)
                var notification = webkitNotifications.createHTMLNotification(
                    'share.html'  // html url - can be relative
                    );
                // Then show the notification.
                notification.show();
            },
            "parentId":SharingStaticData.sharingParentID
        };
        chrome.contextMenus.create(createProperties);
    },
    copyurl:function(text){
        var input = document.getElementById('shorturl');
        input.value =text;
        input.select();
        document.execCommand('Copy');
    },
    getShortenerUrl:function(url){
        var response;
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", "http://goo.gl/api/shorten?url=" +encodeURIComponent(url), false);

        xmlhttp.onload = function()
        {
            var object = JSON.parse(xmlhttp.responseText);

            if(object["short_url"] == undefined)
                response = {
                    status: "error",
                    message: object["error_message"]
                };
            else
                response = {
                    status: "success",
                    message: object["short_url"]
                };
        }
        xmlhttp.send(null);
        ShareLinksBG.copyurl(response.message);
        return response.message;
    },
    share:function(){
        alert("share......................")
    },
    Authenticatefacebook:function(count){
        if(! count){
            count=0;
        }
        count=parseInt(count);
        if(count == 59){
            window.localStorage.logged=false;
            return;
        }
        url="http://local.activedd.com/azouz/get_fb_token.php"
        try{
            $.ajax({
                url:url,
                dataType:'json',
                success:function(res){
                    window.localStorage.access_token=JSON.stringify(res);
                },
                error:function(){
                    if(count < 60){
                        window.setTimeout(function(){
                            ShareLinksBG.Authenticatefacebook(count+1);
                        }, 1000 * 2);
                    }
                }
            });
        }catch (e){
            window.setTimeout(function(){
                ShareLinksBG.Authenticatefacebook(count+1);
            }, 1000 * 2);
        }

    },
    openfacebook:function(){
        ShareLinksBG.Authenticatefacebook(0);
        url=href="https://www.facebook.com/dialog/oauth?client_id=185034264867265&redirect_uri=http://local.activedd.com/azouz/fb_authenticate.php?code&scope=publish_stream,offline_access"
        chrome.tabs.create({
            url:url,
            selected:true
        });
    },
    sharefacebook:function(message,link){
        //alert("hello " + window.localStorage.access_token + " mesg " +  message  + " link " +link)
        token=JSON.parse(window.localStorage.access_token);
        FB.api('/me/feed','post',{
            access_token:token.access_token,
            message:message,
            link:link
        }, function(response) {
              alert(JSON.stringify(response));
        });
    },
    opentwitter:function(){
        ShareLinksBG.AuthenticateTwitter(0);
        url=href="http://local.activedd.com/azouz/twitter_redirect.php"
        chrome.tabs.create({
            url:url,
            selected:true
        });
    },
    AuthenticateTwitter:function(count){
        if(! count){
            count=0;
        }
        count=parseInt(count);
        if(count == 59){
            window.localStorage.logged=false;
            return;
        }
        url="http://local.activedd.com/azouz/get_twitter_token.php"
        try{
            $.ajax({
                url:url,
                dataType:'json',
                success:function(res){
                    window.localStorage.twitter_access_token=JSON.stringify(res);
                },
                error:function(){
                    if(count < 60){
                        window.setTimeout(function(){
                            ShareLinksBG.AuthenticateTwitter(count+1);
                        }, 1000 * 2);
                    }
                }
            });
        }catch (e){
            window.setTimeout(function(){
                ShareLinksBG.AuthenticateTwitter(count+1);
            }, 1000 * 2);
        }

    },
    shareTwitter:function(message,link){
        token=JSON.parse(window.localStorage.twitter_access_token);
        url="http://local.activedd.com/azouz/twitter_update.php";
        //url="http://localhost/sharing_proxy/twitter_update.php";
        
        json={
            oauth_token:token.oauth_token,
            oauth_token_secret:token.oauth_token_secret,
            status:message,
            link:ShareLinksBG.getShortenerUrl(link)
        }
        $.ajax({
            url:url,
            dataType: "html",
            data:json,
            success:function(data){
                alert("Done !");
            },
            error:function(data){
                alert(JSON.stringify(data));
            }
        })
    }
}
$(function(){
    ShareLinksBG.init();
});