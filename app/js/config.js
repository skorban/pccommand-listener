
var fs = require("fs");

const dir = (process.platform == "win32") ? 
            process.env["APPDATA"] + "/Profound UI" : 
            process.env["HOME"] + "/.profoundui";
const file = "listener.conf";
const path = dir + "/" + file;
const dftConf = {
  
  "port": 80
  
}

module.exports = {
  
  getDefault: function() {
    
    return JSON.parse(JSON.stringify(dftConf));
    
  },
  
  get: function(done) {
    
    if (typeof done != "function")
      return;
    
    fs.access(path, fs.F_OK | fs.R_OK, function(error) {
      
      if (error) {
        
        done(error);
      
      }
      else {
        
        fs.readFile(path, null, function(error, data) {
          
          if (error) {
            
            done(error);
            
          }
          else {
          
            var conf;
            try {
              
              conf = JSON.parse(data);
              
            }
            catch (error) {
              
              done(error);
              return;
              
            }
            done(null, conf);
          
          }
          
        });
        
      }
      
    });
    
  },
  
  put: function(newConf, done) {
        
    if (!conforms(newConf, dftConf)) {
      
      done(new Error("Invalid configuration data."));
      
    }
    else {
      
      var data;
      try {
        
        data = JSON.stringify(newConf);
        
      }
      catch(error) {
        
        done(error);
        return;
        
      }
      
      checkDir(function(error) {
        
        if (error) {
          
          if (typeof done == "function")
            done(error);
          
        }
        else {
          
          fs.writeFile(path, data, null, done);
          
        }
        
      });
    
    }
    
  }
  
}

function checkDir(done) {
  
  fs.access(dir, fs.F_OK, function(error) {
    
    if (error)
      fs.mkdir(dir, null, done);
    else
      done();
    
  });
  
}

function conforms(a, b) {
  
  if (typeof a != typeof b)
    return false;
  if (typeof a == "object") {
    
    var ka = Object.keys(a).sort();
    var kb = Object.keys(b).sort();
    if (JSON.stringify(ka) != JSON.stringify(kb))
      return false;
    for (var i = 0; i < ka.length; i++) {
      
      var k = ka[i];
      if (!conforms(a[k], b[k]))
        return false;
      
    }
  
  }
  return true;
  
}