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
                out+="<input name='' type='checkbox' value='' class='f' />";
                out+="<img src='images/"+response.item(i).type+".png' class='f'/>";
                out+="<a class='f'>"+response.item(i).title+"</a><br />";
                out+="<a class='f history-box-link'>"+response.item(i).link+"</a>";
                out+="</label>";
                
            }
            $("#history").html(out);
        })
    }
}

$(function(){
    SharingHistory.init();
});


    
    
    
    
    