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
            "code":"chrome.extension.sendRequest({'trys': 'ok'}, script.getimage);"
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
                    }else{//facebook auth
                        window.localStorage.access_token=JSON.stringify(res);
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
    getFacebookUserInfo:function(access_token,handler){
        token=JSON.parse(access_token);
        FB.api('/me',{
            access_token:token.access_token
        }, function(response) {
            window.localStorage.userInfo=JSON.stringify(response);
            handler(response.name);
        //alert(window.localStorage.userInfo)
        })
        FB.api('/me/accounts',{
            access_token:token.access_token
        }, function(response) {
            window.localStorage.userPages=JSON.stringify(response.data);
            
        //alert(window.localStorage.userPages)
        })
    },
    getTwitterUserInfo:function(handler){
        handler(JSON.parse(localStorage.twitter_access_token).screen_name);
    },
    createContextMenu:function(name,parendId){
        createProperties={
            "title":name,
            "contexts":["all"],
            "onclick":function(OnClickData,tab){
                alert("Done!");
            /*ShareLinksBG.pageurl=tab.url
                console.log("URL:"+ShareLinksBG.pageurl)
                site=ShareLinksBG.getContextMenueInfo(OnClickData.menuItemId)

                site.url=tab.url;
                site.text=OnClickData.selectionText;
                site.pagetitle=tab.title;
                //dataURL
                site.favIconUrl=tab.favIconUrl;
                localStorage.onclickedcontext=JSON.stringify(site);
                chrome.tabs.executeScript(null,
                {
                    "code":"chrome.extension.sendRequest({'click': 'ok'}, script.show);"
                });*/
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
        dbDriver.insert(jsonData.url,jsonData.title ,new Date().toString(), jsonData.type)
        if(jsonData.type=="gmail"){
            window.open("https://mail.google.com/mail/?ui=2&view=cm&fs=1&tf=1&su="+encodeURIComponent(jsonData.des)+"&body="+encodeURIComponent(jsonData.url),'mypage',"width=500,height=400");
        }
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
}

chrome.extension.onRequest.addListener(onRequest);
