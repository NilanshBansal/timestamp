var fs=require('fs');
var url=require('url');
function renderHtml(path,response){
    fs.readFile(path,null,function(error,data){
            if(error){
                response.writeHead(404);
                response.write("FIle not found!");
            }
            else{
                response.write(data);
            }
            response.end();
        });
}

function toTimestamp(strDate){
  
  var unix = Math.round(Date.parse(strDate)/1000);
  return unix;
}


function renderJson(path,response){
    var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

    response.writeHead(200,{'Content-Type':'application/json'});
    var obj={};
    if(path.indexOf("%20") == -1 && !isNaN(parseInt(path)) ){
      
       var theDate=new Date(path * 1000);

       var dateString=monthNames[theDate.getMonth()] + " " + theDate.getDate() + "," + theDate.getFullYear();
       
       obj["unix"]=path;
       obj["natural"]=dateString;
       response.write(JSON.stringify(obj));
       response.end();
       return ;
    }
   path=path.replace(/%20/g, " ");
   var val=toTimestamp(path);
   
   obj["unix"]=val;
   obj["natural"]=path;
   
   
   if(isNaN(parseInt(val)) || !isNaN(parseInt(path))) 
   {   
       obj["unix"]=null;
       obj["natural"]=null;
   }
   response.write(JSON.stringify(obj));
   response.end();
}


module.exports={
    onRequest:function(request,response){
        response.writeHead(200,{'Content-Type':'text/html'});
        var path=url.parse(request.url).pathname;
        
        switch(path){
            case '/':renderHtml('./index.html',response);
                    break;
            default:renderJson(path.substring(1),response);   //to eliminate / from path used substring
            
        }
        
    }
};