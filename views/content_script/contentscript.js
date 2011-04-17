var site="";
var endalpha = 95;
var alpha = 0;
var container;
script={
    show:function(onclickedcontext){
        if(!container){
            site=JSON.parse(onclickedcontext);
            //extension container ui
            container  = document.createElement('div');
            container.setAttribute("class", "share-container f");
            container.setAttribute("id", "container");
            container.setAttribute("style", "background:url("+chrome.extension.getURL("views/images/link_popup1.png")+") no-repeat;top: 57px;right: 10px;position: absolute;z-index: 200;");

            //exte logo div
            var logo  = document.createElement('div');
            logo.setAttribute("class", "share-logo f");

            //ext logo image
            var img  = document.createElement('img');
            img.setAttribute("src", chrome.extension.getURL("views/images/logo.png"));
            img.setAttribute("width",76);
            img.setAttribute("height",37);
            logo.appendChild(img);

            //shared item
            var link  = document.createElement('div');
            link.setAttribute("class", "link-cont f-r");
            link.setAttribute("id", "shareitem");

            //close container
            var close  = document.createElement('a');
            close.setAttribute("class", "share-close");
            close.innerHTML="X";
            close.onclick=function(){
                script.fade(-1)
            }
            //share button
            var button  = document.createElement('input');
            button.setAttribute("type", "submit");
            button.setAttribute("class", "send-btn f-r");
            button.setAttribute("value", "share");


            container.appendChild(close);
            container.appendChild(logo);
            container.appendChild(link);
            

            


            out="</br><a href='' class='f-r'><img src='"+ chrome.extension.getURL("views/images/"+site.value+".png")+"' width='31' height='32' alt='"+site.value+"' /></a>";
            out+="<a href='' class='"+site.value+" f'>"+site.name+"</a>";
            if(site.text){
                msg.value=site.text;
            }
            link.innerHTML=out;
            var JsonData;
            if(site.value=="gmail"){
                // message to
                /* var messageFieldTO  = document.createElement('input');
                messageFieldTO.setAttribute("class", "messageField");
                messageFieldTO.setAttribute("type", "text");


                //message subject
                var messageFieldSubject  = document.createElement('input');
                messageFieldSubject.setAttribute("class", "messageField");
                messageFieldSubject.setAttribute("type", "text");

                //commment msg
                var msg  = document.createElement('textarea');
                msg.setAttribute("class", "message-area");
                
                
                container.appendChild(messageFieldTO)
                container.appendChild(messageFieldSubject);
                container.appendChild(msg);

                button.onclick=function(){
                    type=site.value;
                    json={
                        'share': 'done',
                        type:type,
                        msg:msg.value,
                        url:site.url,
                        to:messageFieldTO.value,
                        sub:messageFieldSubject.value
                    }
                    chrome.extension.sendRequest(json, sucess);
                    function sucess(back){
                        alert(back)
                        script.fade(-1)
                    }
                }*/
                var messageFieldTO  = document.createElement('iframe');
                messageFieldTO.setAttribute("src", "https://mail.google.com/mail/?ui=2&view=cm&fs=1&tf=1&body="+encodeURIComponent(site.url));
                messageFieldTO.setAttribute("width",300);
                messageFieldTO.setAttribute("height",200);
                container.appendChild(messageFieldTO)
                //document.body.appendChild(messageFieldTO)
                //window.open("https://mail.google.com/mail/?ui=2&view=cm&fs=1&tf=1&to="+encodeURIComponent(jsonData.to)+"&su="+encodeURIComponent(jsonData.sub)+"&body="+encodeURIComponent(jsonData.msg+jsonData.url),'mypage',"width=500,height=400");
                

            }else{
                //commment msg
                var msg  = document.createElement('textarea');
                msg.setAttribute("class", "txt-area");
                msg.setAttribute("id", "msg");

              
                var shareTitle=document.createElement('p');
                shareTitle.setAttribute("class", "share-title");
                shareTitle.innerHTML=site.pagetitle;


                var shareTxt=document.createElement('div');
                shareTxt.setAttribute("class", "share-txt f-r");
                shareTxt.innerHTML=site.url;
                var close_shareTxt  = document.createElement('a');
                close_shareTxt.setAttribute("class", "share-close");
                close_shareTxt.innerHTML="X";
                shareTxt.appendChild(close_shareTxt);
                close_shareTxt.onclick=function(){
                    container.removeChild(shareTxt);
                }

            

            
                var shareImage=document.createElement('div');
                shareImage.setAttribute("class", "share-image");
                var shareImage_img  = document.createElement('img');
                shareImage_img.setAttribute("src", site.favIconUrl);
                shareImage_img.setAttribute("width",110);
                shareImage_img.setAttribute("height",78);
                shareImage.appendChild(shareImage_img);
                var shareImage_close  = document.createElement('a');
                shareImage_close.setAttribute("class", "share-close");
                shareImage_close.innerHTML="X";
                shareImage.appendChild(shareImage_close);
                shareImage_close.onclick=function(){
                    container.removeChild(shareImage);
                }


                container.appendChild(msg);
                container.appendChild(shareTitle);
                container.appendChild(shareTxt);
                container.appendChild(shareImage);

                
                button.onclick=function(){
                    type=site.value;
                    json={
                        'share': 'done',
                        type:type,
                        msg:msg.value,
                        url:site.url,
                        img:shareImage_img.src,
                        des:site.pagetitle

                    }
                    chrome.extension.sendRequest(json, sucess);
                    function sucess(back){
                        alert(back)
                        script.fade(-1)
                    }
                }
            }
            container.appendChild(button);
            
            document.body.appendChild(container);
        }
    },
    fade:function(d){

        var a = alpha;
        if((a != endalpha && d == 1) || (a != 0 && d == -1)){
            var i = speed;
            if(endalpha - a < speed && d == 1){
                i = endalpha - a;
            }else if(alpha < speed && d == -1){
                i = a;
            }
            alpha = a + (i * d);
            container.style.opacity = alpha * .01;
            container.style.filter = 'alpha(opacity=' + alpha + ')';
        }else{
            if(d == -1){
                container.style.display = 'none'
            }
        
        }
        container=null;
    }

}



/*var desc  = document.createElement('div');
            desc.setAttribute("id", "desc");

            site=JSON.parse(onclickedcontext);
            out="</br><a href='' class='f-r'><img src='"+ chrome.extension.getURL("views/images/"+site.value+".png")+"' width='31' height='32' alt='"+site.value+"' /></a>";
            out+="<a href='' class='"+site.value+" f'>"+site.name+"</a>";
            if(site.text){
                msg.value=site.text;
            }
            link.innerHTML=out;

            out="<table>"
            out="<tr><td><b>Image : </b></td><td><img src='"+site.favIconUrl+"' /></td></tr>"
            out+="<tr><td><b>Title :</b></td><td>"+site.pagetitle+"</td></tr>";
            out+="<tr><td><b>Url  : </b></td><td>"+site.url+"</td></tr>";

            desc.innerHTML=out;

            button.onclick=function(){
                type=site.value;
                json={
                    'share': 'done',
                    type:type,
                    msg:msg.value,
                    url:site.url
                }
                chrome.extension.sendRequest(json, sucess);
                function sucess(back){
                    alert(back)
                    script.fade(-1)
                }
            }*/