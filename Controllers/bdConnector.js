/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var dbDriver={
    db:this.db,
    setup:function(){
        dbDriver.db=openDatabase("sharedlinks", "0.1", "list of Shared links.", 200000);
        if(!dbDriver.db){
            alert("Failed to connect to database.");
        }
        dbDriver.db.transaction(
            function(tx) {
                tx.executeSql("CREATE TABLE if not exists links (id integer primary key asc, link string,title string , time string ,type string)", [], null, null);
            }
            );
    },
    insert:function(link,title,time,type){
        dbDriver.db.transaction(
            function(tx) {
                tx.executeSql("INSERT INTO links (link,title,time,type) values(?,?,?,?)", [link,title,time,type], null, null);
            }
            );
    },
    selectAll:function(callback){
        dbDriver.db.transaction(
            function(tx) {
                tx.executeSql("SELECT * FROM links", [],
                    function(tx, result) {
                        callback(result.rows);
                    /*for(var i = 0; i < result.rows.length; i++) {
                            alert(JSON.stringify(result.rows.item(i)));
                        }*/
                    }, null);
            }
            );
    },
    deleteAll:function(callback){
        dbDriver.db.transaction(
            function(tx) {
                tx.executeSql("delete FROM links", [],
                    function(tx, result) {
                        callback("eshta");
                    }, null);
            }
            );
    },
    deleteSelected:function(id,callback){
        dbDriver.db.transaction(
            function(tx) {
                tx.executeSql("delete FROM links where id="+id, [],
                    function(tx, result) {
                        callback("eshta");
                    }, null);
            }
            );
    },
    search:function(word,callback){
        dbDriver.db.transaction(
            function(tx) {
                tx.executeSql("select * FROM links where title like '%"+word+"%'", [],
                    function(tx, result) {
                        callback(result.rows);
                    }, null);
            }
            );
    }
}

