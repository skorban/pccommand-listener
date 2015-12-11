const http = require("http");
const url = require("url");
const exec = require("child_process").exec;

module.exports.create = function() {
  
  return http.createServer(function(request, response) {

    if (request.connection.remoteAddress != "127.0.0.1") {

      response.writeHead(403);
      this.emit("command_fail", new Error("Unauthorized host: " + request.connection.remoteAddress));
    
    }
    else {

      var params = url.parse(request.url, true).query;
      var cmd = params["cmd"];
      exec(cmd, function(error, stdout, stderr) {

        if (error)
          this.emit("command_fail", error);
        else
          this.emit("command_success");
      
      });
      response.writeHead(200, {
        "Content-Type": "text/html",
        "Access-Control-Allow-Origin": "*"
      }); 
    
    }
    response.end();

  });
  
}
