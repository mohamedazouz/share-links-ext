essyShareScript={
    container:"",
    alpha :0,
    endalpha : 95,
    getimage:function(){
        var image="";
        var link=window.location.href.split("/")[2];
        if(link.indexOf("youtube.com")!=-1){
            metaCollection =document.getElementsByTagName('meta');
            for (i=0;i<metaCollection.length;i++) {
                content=metaCollection[i].content;
                if(content.substr(content.length-3, content.length) == "jpg"){
                    image=content;
                }
            }
        }
        if(image==""){
            for(i=0;i<document.images.length;i++){
                image=document.images[i].src;
                if((image.substr(image.length-3, image.length) == "jpg" ||image.substr(image.length-3, image.length) == "png")&& image.indexOf("fbcdn.net")==-1){//The images associated with this domain "fbcdn.net" isn't always optimized for stream stories
                    break;
                }
            }
        }

        json={
            "getimage":"ok",
            "image":image
        }
        chrome.extension.sendRequest(json,function(){});
    },
    getimages:function(id){
        var image="";
        for(i=0;i<document.images.length;i++){
            image=document.images[i].src;
            if((image.substr(image.length-3, image.length) == "jpg"||image.substr(image.length-3, image.length) == "png")&& image.indexOf("fbcdn.net")==-1){
                return document.images[i].src;
            }
        }
    },
    showPopUp:function(onclickedcontext){
        if(!essyShareScript.container){
            essyShareScript.container =document.createElement('div');
            var overlay= document.createElement('div');
            overlay.setAttribute("style", "background: #000; opacity:.7;position: absolute; top: 0;left: 0;width: 100%;z-index: 100000; height:"+window.innerHeight+"px;");

            
            var containers  = document.createElement('div');
            containers.setAttribute("class", "share-gredient-box share-f");
            containers.setAttribute("id", "share-container-id");
            containers.setAttribute("style", "direction:rtl;position: absolute;top: 50%;left: 39%;z-index: 2000000;");

            //close
            var close  = document.createElement('div');
            close.setAttribute("class", "share-close-button");
            close.innerHTML="X";
            close.onclick=function(){
                essyShareScript.fade(-1)
            }

            var innerHtml="";

            //Header
            var header=document.createElement('p');
            innerHtml="<span class='share-bullet share-f'></span>";
            innerHtml+="<img src='"+chrome.extension.getURL("views/images/"+onclickedcontext.type+"-1.png")+"' class='share-f share-social-logo' />";
            innerHtml+="<span class='share-f'>"+onclickedcontext.name+"</span>";
            innerHtml+="<span class='share-f-r'>"+onclickedcontext.userName+"</span>";
            header.innerHTML=innerHtml;

            //form
            var form=document.createElement('p');
            form.setAttribute("class","share-fields");
            innerHtml="";
            if(onclickedcontext.type=="facebook"){
                onclickedcontext.img=essyShareScript.getimages();
                innerHtml="<label class='share-f'>إلى</label>";
                innerHtml+="<span class='input-shadow share-f'>";
            
                innerHtml+="<select name='' class='share-f'  id='facebookPages'>";
                userpages=onclickedcontext.userpages;
                innerHtml+="<option value='me'>صفحتى</option>";
                for(j=0;j<userpages.length;j++){
                    innerHtml+="<option value='"+userpages[j].id+"'>"+userpages[j].name+"</option>";
                }
                innerHtml+="</select>"
                innerHtml+="</span>";
            }
            if(onclickedcontext.type=="gmail"){
                innerHtml+="<label class='share-f'>إلى</label>";
                contacts=onclickedcontext.contacts;
                innerHtml+="<input type='text' id='to'> ";
                /*innerHtml+="<select id='to' class='share-f'>";
                for(j=1;j<contacts.length;j++){
                    var name=contacts[j].name;
                    if(name==""){
                        name=contacts[j].email;
                    }
                    for(k=0;k<contacts[j].email.length;k++){
                        innerHtml+="<option value='"+contacts[j].email[k]+"'>";
                        innerHtml+=name+" < " +contacts[j].email[k] + " >";
                        innerHtml+="</option>";
                    }
                }
                innerHtml+="</select>"*/
                innerHtml+="<label class='share-f'>الموضوع</label>";
                innerHtml+="<input  type='text' class='share-f gmail-text' id='su'/>"
                innerHtml+="<input type='hidden' id='from' value='"+contacts[0].email+"'> ";
            }
            innerHtml+="<textarea id='"+onclickedcontext.value+"' cols='' rows='' class='share-f'></textarea>";
            innerHtml+="</div>";
            form.innerHTML=innerHtml;

            //button submit to share
            var button  = document.createElement('input');
            button.setAttribute("type", "submit");
            button.setAttribute("class", "share-f-r");
            button.setAttribute("value", "إرسال");

            button.onclick=function(){
                if(onclickedcontext.type=="facebook"){
                    onclickedcontext.pageId=document.getElementById('facebookPages').value;
                }
                if(onclickedcontext.type=="gmail"){
                    onclickedcontext.to=document.getElementById('to').value;
                    onclickedcontext.su=document.getElementById('su').value;
                    onclickedcontext.from=document.getElementById('from').value;
                }
                onclickedcontext.msg=document.getElementById(onclickedcontext.value).value;
                essyShareScript.sendrequest(onclickedcontext);
            }
                
            containers.appendChild(close);
            containers.appendChild(header);
            containers.appendChild(form);
            containers.appendChild(button);
            essyShareScript.container.appendChild(overlay);
            essyShareScript.container.appendChild(containers);
            document.body.appendChild(essyShareScript.container);
        }
    },
    sendrequest:function(json){
        json.share="done";
        chrome.extension.sendRequest(json, sucess);
        function sucess(back){
            essyShareScript.fade(-1);
            //  alert(back)
        }
    },
    fade:function(d){

        var a = essyShareScript.alpha;
        if((a != essyShareScript.endalpha && d == 1) || (a != 0 && d == -1)){
            var i = speed;
            if(essyShareScript.endalpha - a < speed && d == 1){
                i = essyShareScript.endalpha - a;
            }else if(essyShareScript.alpha < speed && d == -1){
                i = a;
            }
            essyShareScript.alpha = a + (i * d);
            essyShareScript.container.style.opacity = essyShareScript.alpha * .01;
            essyShareScript.container.style.filter = 'alpha(opacity=' + essyShareScript.alpha + ')';
        }else{
            if(d == -1){
                essyShareScript.container.style.display = 'none'
            }
        
        }
        essyShareScript.container=null;
    }
}
    