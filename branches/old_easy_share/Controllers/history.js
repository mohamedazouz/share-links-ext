SharingHistory={
    init:function(){
        dbDriver.setup();
        SharingHistory.show();
    },
    show:function(){
        out="<div class='tit'>مشاركات سابقة</div>";
        dbDriver.selectAll(function(response){
            for(i=0;i<response.length;i++)
            {
                out+="<label class='f'>";
                out+="<input type='checkbox' value='"+response.item(i).id+"' class='f' name='historyItem'/>";
                out+="<img src='images/"+response.item(i).type+".png' class='f'/>";
                out+="<a class='f'>"+response.item(i).title+"</a><br />";
                out+="<a class='f history-box-link' href='"+response.item(i).link+"' target='blank'>"+response.item(i).link+"</a>";
                out+="</label>";
                
            }
            $("#history").html(out);
        })
    },
    deleteSelected:function(){
        if($("input:checked").length==0){
            alert("من فضلك قم باختيار احد المشاركات");
            return;
        }
        var confirmMessage=confirm( "مشاركة ؟ "+ $("input:checked").length + " هل انت متأكد من إجراء حذف ");
        if(confirmMessage){
            $("input:checked").each(function(index){
                dbDriver.deleteSelected($(this).val(),function(response){
                    SharingHistory.show();
                //
                })
            })
        }
    },
    deleteAll:function(){
        var confirmMessage=confirm("هل انت متأكد من إجراء الحذف؟");
        if(confirmMessage){
            dbDriver.deleteAll(function(response){
                SharingHistory.show();
            })
        }
    },
    search:function(){
        if($("#keyword").val()!=""){
            dbDriver.search($("#keyword").val(), function(response){
                SharingHistory.showSearch(response);
            })
        }
    },
    showSearch:function(response){
        out="<div class='tit'>البحث</div>";
        if(response.length==0){
            out+="لا يوجد نتائج لبحثك فى المشاركات السابقة";
        }
        for(i=0;i<response.length;i++)
        {
            out+="<label class='f'>";
            out+="<input type='checkbox' value='"+response.item(i).id+"' class='f' name='historyItem'/>";
            out+="<img src='images/"+response.item(i).type+".png' class='f'/>";
            out+="<a class='f'>"+response.item(i).title+"</a><br />";
            out+="<a class='f history-box-link' href='"+response.item(i).link+"' target='blank'>"+response.item(i).link+"</a>";
            out+="</label>";
        }
        out+="<p><a href='#' onclick='SharingHistory.show()'>اغلق البحث</a></p>"
        $("#history").html(out);
    }
}

$(function(){
    SharingHistory.init();
});


    
    
    
    
    