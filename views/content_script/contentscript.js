var site="";
var endalpha = 95;
var alpha = 0;
var container;
script={
    show:function(onclickedcontext){
        if(!container){
            container  = document.createElement('div');
            container.setAttribute("class", "container");
            container.setAttribute("id", "container");
        
            var logo  = document.createElement('div');
            logo.setAttribute("class", "logo f");

            var img  = document.createElement('img');
            img.setAttribute("src", chrome.extension.getURL("views/images/logo.png"));
            img.setAttribute("width",76);
            img.setAttribute("height",37);

            var link  = document.createElement('div');
            link.setAttribute("class", "link-cont f-r");
            link.setAttribute("id", "shareitem");

            var msg  = document.createElement('textarea');
            msg.setAttribute("class", "txt-area");
            msg.setAttribute("id", "msg");

            var button  = document.createElement('input');
            button.setAttribute("type", "submit");
            button.setAttribute("class", "send-btn f-r");
            button.setAttribute("value", "share");

            var desc  = document.createElement('div');
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
            }
            var close  = document.createElement('a');
            close.innerHTML="X";
            close.onclick=function(){
                script.fade(-1)
            }

            logo.appendChild(img);
            container.appendChild(close);
            container.appendChild(logo);
            container.appendChild(link);
            container.appendChild(msg);
            container.appendChild(button);
            container.appendChild(desc);
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