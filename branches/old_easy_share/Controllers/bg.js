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
        ShareLinksBG.createCopyshortContextMenu();
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
            return;
        }
        //        url=link
        try{
            $.ajax({
                url:link,
                dataType:'json',
                success:function(res){
                    if(res.status==404){
                        window.setTimeout(function(){
                            ShareLinksBG.Authenticate(count+1,link,handler);
                        }, 1000 * 2);
                    }else{
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
                    }
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
            var token="";
            var id="";
            if(jsonData.pageId=="me"){
                token=JSON.parse(window.localStorage.access_token).access_token;
                id="me";
            }else
            {
                token=jsonData.pageId.split("=")[1];
                id=jsonData.pageId.split("=")[0];
            }
            FB.api("/"+id+"/feed",'post',{
                access_token:token,
                message:jsonData.msg,
                link:jsonData.url,
                description:jsonData.title,
                picture:jsonData.img
            }, function(response) {
                if(response.error){
                    ShareLinksBG.showSucessMessage(jsonData.type,"لقد تجاوزت عدد المشاركات المسموح بها من الفيس بوك");
                    x=jsonData.type;
                    setTimeout("ShareLinksBG.showSucessMessage(x,\"\")",2*1000);
                }else
                {
                    ShareLinksBG.showSucessMessage(jsonData.type,"تم بنجاح");
                    x=jsonData.type;
                    setTimeout("ShareLinksBG.showSucessMessage(x,\"\")",2*1000);
                }
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
                    ShareLinksBG.showSucessMessage(jsonData.type,"تم بنجاح");
                    x=jsonData.type;
                    setTimeout("ShareLinksBG.showSucessMessage(x,\"\")",2*1000);
                    back("done")
                },
                error:function(data){
                    console.log("error")
                    ShareLinksBG.showSucessMessage(jsonData.type,"لقد تم إضافة هذه المشاركة من قبل");
                    x=jsonData.type;
                    setTimeout("ShareLinksBG.showSucessMessage(x,\"\")",2*1000);
                    back("error")
                }
            })
        }
        
        if(jsonData.type=="gmail"){
            var url=SharingStaticData.gmailSendMessage;
            to=jsonData.to;
            var messaageText="";
            messaageText="Hello, this email sent you from \n\n"
            messaageText+=jsonData.userName+" <"+jsonData.from +"> would like to share the following link with you\n\n"
            messaageText+=jsonData.title + "\n";
            messaageText+=jsonData.url + "\n";
            messaageText+="He wrote you the following messages\"" +jsonData.msg+"\" \n\n\n\n";
            messaageText+="\nBy Easy-Share Chrome Extension"
            json={
                to:to,
                su:"[Easy-Share Chrome Extension] "+jsonData.su,
                msg:messaageText
            }
            $.ajax({
                url:url,
                dataType: "html",
                data:json,
                success:function(data){
                    console.log("done")
                    // alert("jkasdkjhadkjaksdhkadkhasd "+data)
                    ShareLinksBG.showSucessMessage(jsonData.type,"تم بنجاح");
                    x=jsonData.type;
                    setTimeout("ShareLinksBG.showSucessMessage(x,\"\")",2*1000);
                    back(data)
                },
                error:function(data){
                    console.log("error")
                    ShareLinksBG.showSucessMessage(jsonData.type,"خطأ عاود مرة اخرة المحاولة");
                    x=jsonData.type;
                    setTimeout("ShareLinksBG.showSucessMessage(x,\"\")",2*1000);
                    back(data)
                }
            })
        }
        dbDriver.insert(jsonData.url,jsonData.title ,new Date().toString(), jsonData.type)
    },
    showSucessMessage:function(type,message){
        var x=chrome.extension.getViews({
            type:"popup"
        })
        if(x.length>0){
            x[0].SharingPopup.showSucess(type,message);
        }
    },
    showValidatingMessage:function(type){
        var x=chrome.extension.getViews({
            type:"popup"
        })
        x[0].SharingPopup.showValidatingMessage(type)
    //alert(JSON.stringify(x));
    //setTimeout("x[0].SharingPopup.showValidatingMessage(type)",2*1000);
        
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
