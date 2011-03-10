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
        //ShareLinksBG.setData(SharingStaticData)
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
    share:function(message,link,jsonData){
        if(jsonData.type=="facebook"){
            token=JSON.parse(window.localStorage.access_token);
            FB.api('/me/feed','post',{
                access_token:token.access_token,
                message:message,
                link:link
            }, function(response) {
                  alert(JSON.stringify(response));
            });
        }
        if(jsonData.type=="twitter"){
            token=JSON.parse(window.localStorage.twitter_access_token);
            url=jsonData.link;
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

    },
    open:function(redirectLink,tokenlink){
        ShareLinksBG.Authenticate(0,tokenlink);
        chrome.tabs.create({
            url:redirectLink,
            selected:true
        });
    },
    Authenticate:function(count,link){
        if(! count){
            count=0;
        }
        count=parseInt(count);
        if(count == 59){
            window.localStorage.logged=false;
            return;
        }
        url=link
        try{
            $.ajax({
                url:url,
                dataType:'json',
                success:function(res){
                    if(res.oauth_token){ //twitter auth
                        window.localStorage.twitter_access_token=JSON.stringify(res);
                    }else{//facebook auth
                        window.localStorage.access_token=JSON.stringify(res);
                    }
                },
                error:function(){
                    if(count < 60){
                        window.setTimeout(function(){
                            ShareLinksBG.Authenticate(count+1,link);
                        }, 1000 * 2);
                    }
                }
            });
        }catch (e){
            window.setTimeout(function(){
                ShareLinksBG.Authenticate(count+1,link);
            }, 1000 * 2);
        }

    }
}
$(function(){
    ShareLinksBG.init();
});