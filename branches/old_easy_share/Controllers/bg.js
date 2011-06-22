ShareLinksBG={
    init:function(){
        ShareLinksBG.createMainContextMenu();
        if(!localStorage.sharingStaticData){
            ShareLinksBG.setData(SharingStaticData.sites)
        }else{
            ShareLinksBG.setup();
        }
        dbDriver.setup();
    },
    createMainContextMenu:function(){
        if(localStorage.shortrightclick=="0"){
            localStorage.shortrightclick=ShareLinksBG.createCopyshortContextMenu();
        }
        createProperties={
            "title":"Easy Share",
            "contexts":["all"]
        };
        localStorage.sharingParentID=chrome.contextMenus.create(createProperties);
    },
    copyurl:function(text){
        var input = document.getElementById('shorturl');
        input.value =text;
        input.select();
        document.execCommand('Copy');
    },
    getShortenerUrl:function(url,handler){
        $.ajax({
            url:"http://goo.gl/api/shorten?url=" +encodeURIComponent(url),
            type: "POST",
            success: function(shortUrl){
                handler(JSON.parse(shortUrl))
            },
            error:function(){
                handler("error")
            }
        });
    },
    createCopyshortContextMenu:function(){
        createProperties={
            "title":"Copy Shortener url",
            "contexts":["page"],
            "onclick":function(OnClickData,tab){
                ShareLinksBG.getShortenerUrl(tab.url,function(response){
                    ShareLinksBG.copyurl(response.short_url)
                })
            }
        };
        id=chrome.contextMenus.create(createProperties);
        return id;
    },
    getPageImage:function(callback){
        chrome.tabs.executeScript(null,
        {
            "code":"chrome.extension.sendRequest({'trys': 'ok'}, essyShareScript.getimage);"
        });
    },
    setData:function(Data){
        localStorage.sharingStaticData=JSON.stringify(Data);
    },
    setup:function(){
        pId= parseInt(localStorage.sharingParentID);
        sites=JSON.parse(localStorage.sharingStaticData);
        for(i=0;i<sites.websites.length;i++){
            if(sites.websites[i].contextMenuId && sites.websites[i].contextMenuId!=-1){
                sites.websites[i].contextMenuId=ShareLinksBG.createContextMenu(sites.websites[i].name,pId);
            }
        }
        ShareLinksBG.setData(sites);
    },
    open:function(redirectLink,tokenlink,handler){
        ShareLinksBG.Authenticate(0,tokenlink,function(data){
            handler(data);
        });
        chrome.tabs.create({
            url:redirectLink,
            selected:true
        });
    },
    Authenticate:function(count,link,handler){
        if(! count){
            count=0;
        }
        count=parseInt(count);
        if(count == 59){
            window.localStorage.logged=false;
            return;
        }
        //        url=link
        try{
            $.ajax({
                url:link,
                dataType:'json',
                success:function(res){
                    if(res.oauth_token){ //twitter auth
                        window.localStorage.twitter_access_token=JSON.stringify(res);
                    }else{
                        if(res.authToken){//gmail
                            window.localStorage.gmailAuthToken=JSON.stringify(res);
                        }else{//facebook auth
                            window.localStorage.access_token=JSON.stringify(res);
                        }
                    }
                    handler("done");
                },
                error:function(){
                    if(count < 60){
                        window.setTimeout(function(){
                            ShareLinksBG.Authenticate(count+1,link,handler);
                        }, 1000 * 2);
                    }
                }
            });
        }catch (e){
            window.setTimeout(function(){
                ShareLinksBG.Authenticate(count+1,link,handler);
            }, 1000 * 2);
        }

    },
    getFacebookUserInfo:function(access_token,callback){
        token=JSON.parse(access_token);
        FB.api('/me',{
            access_token:token.access_token
        }, function(response) {
            window.localStorage.userInfo=JSON.stringify(response);
            callback(response.name);
        //alert(window.localStorage.userInfo)
        })
        FB.api('/me/accounts',{
            access_token:token.access_token
        }, function(response) {
            window.localStorage.userPages=JSON.stringify(response.data);
            
        //alert(window.localStorage.userPages)
        })
    },
    getTwitterUserInfo:function(callback){
        callback(JSON.parse(localStorage.twitter_access_token).screen_name);
    },
    getGmailUserInfo:function(callback){
        //alert(JSON.parse(window.localStorage.gmailAuthToken).authToken)
        var url=SharingStaticData.gmailGetContactlistUrl;
        json={
            token:JSON.parse(window.localStorage.gmailAuthToken).authToken
        }
        $.ajax({
            url:url,
            dataType: "html",
            data:json,
            success:function(response){
                window.localStorage.gmailUserContact=response;
                callback(JSON.parse(response)[0].name)
            },
            error:function(data){
                console.log("error")
                callback("error")
            }
        })
    },
    createContextMenu:function(name,parendId){
        createProperties={
            "title":name,
            "contexts":["all"],
            "onclick":function(OnClickData,tab){
                json=tab;
                site=ShareLinksBG.getContextMenueInfo(OnClickData.menuItemId);
                json.userName=site.userName
                json.type=site.value
                json.name=site.name
                text=""
                if(OnClickData.selectionText){
                    text=OnClickData.selectionText;
                }
                json.msg=text;
                if(json.type=="facebook"){
                    json.userpages=JSON.parse(localStorage.userPages)
                }
                if(json.type=="gmail"){
                    json.contacts=JSON.parse(localStorage.gmailUserContact)
                }
                localStorage.onclickedcontext=JSON.stringify(json);
                
                chrome.tabs.executeScript(null,
                {
                    "code":"chrome.extension.sendRequest({'showPopup': 'true'}, essyShareScript.showPopUp);"
                });
            },
            "parentId":parendId
        };
        id=chrome.contextMenus.create(createProperties);
        return id;
    },
    getContextMenueInfo:function(id){
        sites=JSON.parse(localStorage.sharingStaticData);
        for(i=0;i<sites.websites.length;i++){
            if(sites.websites[i].contextMenuId==id){
                return sites.websites[i];
            }
        }
        return null;
    },
    share:function(jsonData,back){
        if(jsonData.type=="facebook"){
            token=JSON.parse(window.localStorage.access_token);
            FB.api("/"+jsonData.pageId+"/feed",'post',{
                access_token:token.access_token,
                message:jsonData.msg,
                link:jsonData.url,
                description:jsonData.title,
                picture:jsonData.img
            }, function(response) {
                  console.log(JSON.stringify(response));
                back(JSON.stringify(response) + "   " + jsonData.img)
            });
        }
        if(jsonData.type=="twitter"){
            token=JSON.parse(window.localStorage.twitter_access_token);
            var url=SharingStaticData.twitterUpdatestatus;
            json={
                oauth_token:token.oauth_token,
                oauth_token_secret:token.oauth_token_secret,
                status:jsonData.msg,
                link:jsonData.url
            }
            $.ajax({
                url:url,
                dataType: "html",
                data:json,
                success:function(data){
                    console.log("done")
                    back("done")
                },
                error:function(data){
                    console.log("error")
                    back("error")
                }
            })
        }
        
        if(jsonData.type=="gmail"){
            var url=SharingStaticData.gmailSendMessage;
            var msg = jsonData.msg  + "<br>"+ jsonData.url;
            to=jsonData.to;
            to=jsonData.to.substring(to.indexOf("<")+1,to.length-1);
            json={
                to:to,
                from:jsonData.from,
                su:jsonData.su,
                msg:msg
            }
            $.ajax({
                url:url,
                dataType: "html",
                data:json,
                success:function(data){
                    console.log("done")
                   // alert("jkasdkjhadkjaksdhkadkhasd "+data)
                    back(data)
                },
                error:function(data){
                    console.log("error")
                    back(data)
                }
            })
        }
        dbDriver.insert(jsonData.url,jsonData.title ,new Date().toString(), jsonData.type)
    }
}
$(function(){
    ShareLinksBG.init();
});

function onRequest(request, sender, callback) {
    if (request.trys == 'ok') {
        callback("");
    }
    if (request.getimage=="ok") {
        var x=chrome.extension.getViews({
            type:"popup"
        })
        x[0].SharingPopup.setPageImage(request.image);
    }
    if(request.showPopup=="true"){
        callback(JSON.parse(localStorage.onclickedcontext));
    }
    if (request.share == 'done') {
        ShareLinksBG.share(request,function(back){
            callback(back);
        });
    }
}

chrome.extension.onRequest.addListener(onRequest);
