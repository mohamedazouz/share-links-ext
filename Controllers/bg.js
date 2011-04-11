ShareLinksBG={
    selectedText:"",
    pageurl:"",
    init:function(){
        localStorage.shortrightclick=false;
        ShareLinksBG.createMainContextMenu();
        if(!localStorage.sharingStaticData){
            ShareLinksBG.setData(SharingStaticData.sites)
        }else{
            ShareLinksBG.setup();
        }
        if(! window.localStorage.lang){
            window.localStorage.lang=ShareLinksBG.getNavigatorLang();
        }
    },
    getNavigatorLang:function(){
        var lang=window.navigator.language;
        if(lang.indexOf("ar")!= -1){
            return 'ar';
        }
        return 'en';
    },
    createMainContextMenu:function(){
        if(localStorage.shortrightclick!="false"){
            localStorage.shortrightclick=ShareLinksBG.createCopyshortContextMenu();
        }
        createProperties={
            "title":"share",
            "contexts":["all"]
        };
        localStorage.sharingParentID=chrome.contextMenus.create(createProperties);
    },
    createCopyshortContextMenu:function(){
        createProperties={
            "title":"Copy Shortener url",
            "contexts":["page"],
            "onclick":function(OnClickData,tab){
                ShareLinksBG.getShortenerUrl(tab.url,function(){})
            }
        };
        id=chrome.contextMenus.create(createProperties);
        return id;
    },
    setData:function(Data){
        localStorage.sharingStaticData=JSON.stringify(Data);
    },
    getdata:function(){
        return localStorage.sharingStaticData;
    },
    createContextMenu:function(name,parendId){
        createProperties={
            "title":name,
            "contexts":["all"],
            "onclick":function(OnClickData,tab){
                //  chrome.tabs.captureVisibleTab(null, {format:"jpeg"}, function(dataURL) {

                ShareLinksBG.pageurl=tab.url
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
                });
                 
            // });
            },
            "parentId":parendId
        };
        id=chrome.contextMenus.create(createProperties);
        return id;
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
                ShareLinksBG.copyurl(JSON.parse(shortUrl).short_url);
                handler(JSON.parse(shortUrl))
            },
            error:function(){
                handler("error")
            }
        }
        )
    },
    share:function(message,link,jsonData,back){
        if(jsonData.type=="facebook"){
            token=JSON.parse(window.localStorage.access_token);
            FB.api('/me/feed','post',{
                access_token:token.access_token,
                message:message,
                link:link,
                description:jsonData.des,
                picture:jsonData.img
            }, function(response) {
                  console.log(JSON.stringify(response));
                back(JSON.stringify(response))
            });
        }
        if(jsonData.type=="twitter"){
            token=JSON.parse(window.localStorage.twitter_access_token);
            var url=SharingStaticData.twitterUpdatestatus;
            json={
                oauth_token:token.oauth_token,
                oauth_token_secret:token.oauth_token_secret,
                status:message,
                link:link
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
            back("done redirect!");
            window.open("https://mail.google.com/mail/?ui=2&view=cm&fs=1&tf=1&to="+encodeURIComponent(jsonData.to)+"&su="+encodeURIComponent(jsonData.sub)+"&body="+encodeURIComponent(jsonData.msg+jsonData.url),'mypage',"width=500,height=400");
        }

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
    getContextMenueInfo:function(id){
        sites=JSON.parse(localStorage.sharingStaticData);
        for(i=0;i<sites.websites.length;i++){
            if(sites.websites[i].contextMenuId==id){
                return sites.websites[i];
            }
        }
        return null;
    }
}



function onRequest(request, sender, callback) {
    if (request.click == 'ok') {
        callback(localStorage.onclickedcontext);
    }
    if (request.share == 'done') {
        ShareLinksBG.share(request.msg,request.url,request,function(back){
            callback(back);
        });
        
    }
}

chrome.extension.onRequest.addListener(onRequest);
