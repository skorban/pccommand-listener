
var gui = require("nw.gui");
var config = require("./js/config");
var start = window.opener.start;
var stop = window.opener.stop;
var notify = window.opener.notify;

document.addEventListener("DOMContentLoaded", function() {
  
  var win = gui.Window.get();
  win.focus();
  var port = document.querySelector("#port");
  var ok = document.querySelector("#ok");
  var cancel = document.querySelector("#cancel");
  var submitting = false;
  
  config.get(function(error, conf) {
    
    if (error)
      conf = config.getDefault();;
    port.value = conf["port"];
    // Bizarre, a handler named 'ok' is not called!?!
    ok.addEventListener("click", okFn, false);
    cancel.addEventListener("click", quit, false);
    document.addEventListener("keyup", function(e) {
      
      if (e.keyCode == 13) {
        
        e.preventDefault();
        e.stopPropagation();        
        okFn();
        
      }
      else if (e.keyCode == 27) {
        
        e.preventDefault();
        e.stopPropagation();        
        quit();
        
      }
      
    }, false);
    
  });
  
  function okFn() {
    
    if (submitting)
      return;   
    submitting = true;
    var conf = {
      
      "port": parseInt(port.value, 10)
      
    };
    config.put(conf, function(error) {

      submitting = false;
      if (error) {
        
        notify("Unable to save configuration: " + error.message, function() {
          
          port.focus();
          
        });
        
      }
      else {
        
        if (window.confirm("Changes will be effective the next time the listener is started. Would you like to restart it now?"))
          stop(start);
        quit();
        
      }
      
    });
    
  }
  
  function quit() {
    
    gui.Window.get().close();
    
  }
  
});