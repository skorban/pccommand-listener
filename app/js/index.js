
// Reference node-webkit Tray in global scope to prevent GC, per docs.
var tray;

var gui = require("nw.gui");
var listener = require("./js/listener").create();
var config = require("./js/config");

const title = "Profound UI PC Command Listener";
const notificationDelay = 2.5; // Seconds

document.addEventListener("DOMContentLoaded", function() {

  var menu = new gui.Menu();
  var optConfig = new gui.MenuItem({
    
    label: "Configure..."
    
  });
  optConfig.click = configure;
  menu.append(optConfig);
  var optStart = new gui.MenuItem({
    
    label: "Start listening",
    enabled: false
    
  });
  optStart.click = start;
  menu.append(optStart);
  var optStop = new gui.MenuItem({
    
    label: "Stop listening",
    enabled: false
    
  });
  optStop.click = stop;
  menu.append(optStop);
  var optExit = new gui.MenuItem({
    label: "Exit"
  });
  optExit.click = exit;
  menu.append(optExit);
  tray = new gui.Tray({
    icon: "app/img/16.png",
    tooltip: title + "\n(Not listening)"
  });  
  tray.menu = menu;
  
  listener.on("error", failed);
  start();
  
  function start(done) {
    
    optStart.enabled = optStop.enabled = false;
    config.get(function(error, conf) {
    
      if (error)
        conf = config.getDefault();
      listener.once("listening", function() {
        
        optStop.enabled = true;
        var addr = listener.address()["address"];
        var port = listener.address()["port"];
        tray.tooltip = title + "\n(Listening on " + addr + ":" + port + ")";
        notify("Started listening on " + addr + ":" + port, done);
        
      });
      listener.listen(conf["port"], "127.0.0.1");
      
    });
    
  }

  function stop(done) {
    
    optStart.enabled = optStop.enabled = false;
    listener.close(function(error) {
      
      optStart.enabled = true;
      if (!error) {
        
        // See net.Server.close doc, error passed when 
        // the close() is called while the server is not listening.
        tray.tooltip = title + "\n(Not listening)";
        notify("Stopped listening", done);
      
      }
      else if (typeof done == "function") {
        
        done();
        
      }
      
    });
    
  }
  
  function failed(error) {
    
    notify("Listener failed: " + error.message, function() {
      
      optStart.enabled = true;
      optStop.enabled = false;
      
    });
    
  }
  
  function notify(msg, done) {
    
    var notification = new Notification(title, {
      icon: "img/32.png",
      body: msg
    });
    setTimeout(function() {
      
      notification.close();
      if (typeof done == "function")
        done();
      
    }, notificationDelay * 1000);
    
  }
  
  function configure() {
    
    gui.Window.open("config_dialog.html", {
      
      title: "Configure",
      toolbar: false,
      icon: "app/img/32.png",
      width: 300,
      height: 100,
      resizable: false
      
    });
    
  }
  
  function exit() {

    optConfig.enabled = false;
    tray.tooltip = title + "\n(Shutting down)";
    stop(function() {
      
      gui.App.quit();
      
    });
    
  }
  
  window["start"] = start;
  window["stop"] = stop;
  window["notify"] = notify;
  
});
