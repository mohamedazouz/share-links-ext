SharingHistory={
    init:function(){
        dbDriver.setup();
        SharingHistory.show();
    },
    show:function(){
        out="<div class='tit'>History</div>";
        dbDriver.selectAll(function(response){
            for(i=0;i<response.length;i++)
            {
                out+="<label class='f'>";
                out+="<input type='checkbox' value='"+response.item(i).id+"' class='f' name='historyItem'/>";
                out+="<img src='images/"+response.item(i).type+".png' class='f'/>";
                out+="<a class='f'>"+response.item(i).title+"</a><br />";
                out+="<a class='f history-box-link'>"+response.item(i).link+"</a>";
                out+="</label>";
                
            }
            $("#history").html(out);
        })
    },
    deleteSelected:function(){
        if($("input:checked").length==0){
            alert("Please, Select Any Item to Delete");
            return;
        }
        alert( " تم حذف " +$("input:checked").length  + "مشاركة");
        $("input:checked").each(function(index){
            dbDriver.deleteSelected($(this).val(),function(response){
                SharingHistory.show();
                //
            })
        })
    },
    deleteAll:function(){
        var confirmMessage=confirm("هل انت متأكد من إجراء الحذف?");
        if(confirmMessage){
            dbDriver.deleteAll(function(response){
                SharingHistory.show();
            })
        }
    }
}

$(function(){
    SharingHistory.init();
});


    
    
    
    
    