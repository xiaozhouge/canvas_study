var ws = require('nodejs-websocket')  
var PORT = 3001  
var events = require('events'); 
var emitter = new events.EventEmitter();

var person=0;
var server = ws.createServer(function(conn){ 
    person++; 
    console.log('New connection',person) 

    emitter.on('start', (data) =>{
           conn.sendText(JSON.stringify({times:2,"arr":data.arr}));     
    });
    emitter.on('reset', (data) =>{
           conn.sendText(JSON.stringify(data));     
    });
    conn.on("text",function(str){  
        // console.log(str);
        var data=JSON.parse(str);
        if(data.times==1){
            var descp="你是第"+person+"个进来的，看其他人画吧兄弟";
            if(person==1){
                descp="你是第"+person+"个进来的，获得了绘画的主动权"
            }
            conn.sendText(JSON.stringify({times:1,"person":person,"descp":descp}))
        }else if(data.times==2){
            emitter.emit('start',data);
        }else if(data.times==3){
            person=0;
            emitter.emit('reset',data);
        }

        
    })  
    conn.on("close",function(code,reason){  
        console.log("connection closed")  
    })  
    conn.on("error",function(err){  
        console.log("handle err")  
        console.log(err)  
    })  
}).listen(PORT)  
  
console.log('websocket server listening on port ' + PORT)  