  init();
    var count = 0;



  // OSName= navigator.appVersion;


    
  function init() {
    var OSName = "Unknown OS";

    if (navigator.appVersion.indexOf("Win")!=-1) OSName="Windows";
    if (navigator.appVersion.indexOf("Mac")!=-1) OSName="MacOS";
    if (navigator.appVersion.indexOf("X11")!=-1) OSName="UNIX";
    if (navigator.appVersion.indexOf("Linux")!=-1) OSName="Linux";
    if (navigator.appVersion.indexOf("Android")!=-1) OSName="Android";

    $("#os").html(OSName);

      if (OSName == "Android") {
      if (window.DeviceOrientationEvent) {
        document.getElementById("doEvent").innerHTML = "DeviceOrientation";
        // Listen for the deviceorientation event and handle the raw data
        window.addEventListener('deviceorientation', function(eventData) {
          // gamma is the left-to-right tilt in degrees, where right is positive
          var tiltLR = eventData.gamma;
          
          // beta is the front-to-back tilt in degrees, where front is positive
          var tiltFB = eventData.beta;
          
          // alpha is the compass direction the device is facing in degrees
          var dir = eventData.alpha
          
          // call our orientation event handler
          deviceOrientationHandler(tiltLR, tiltFB, dir);
          }, false);
      } else {
        document.getElementById("doEvent").innerHTML = "Not supported on your device or browser.  Sorry."
      }
    
  
    function deviceOrientationHandler(tiltLR, tiltFB, dir) {
      document.getElementById("doTiltLR").innerHTML = Math.round(tiltLR);
      document.getElementById("doTiltFB").innerHTML = Math.round(tiltFB);
      document.getElementById("doDirection").innerHTML = Math.round(dir);
      
      // Apply the transform to the image
      var logo = document.getElementById("imgLogo");
      logo.style.webkitTransform = "rotate("+ tiltLR +"deg) rotate3d(1,0,0, "+ (tiltFB*-1)+"deg)";
      logo.style.MozTransform = "rotate("+ tiltLR +"deg)";
      logo.style.transform = "rotate("+ tiltLR +"deg) rotate3d(1,0,0, "+ (tiltFB*-1)+"deg)";
    }
    
    
    // Some other fun rotations to try...
    //var rotation = "rotate3d(0,1,0, "+ (tiltLR*-1)+"deg) rotate3d(1,0,0, "+ (tiltFB*-1)+"deg)";
    //var rotation = "rotate("+ tiltLR +"deg) rotate3d(0,1,0, "+ (tiltLR*-1)+"deg) rotate3d(1,0,0, "+ (tiltFB*-1)+"deg)";
  }
} 


function refresh(){

console.log( "ready!" );

var tmp1 = $('#doTiltFB').html();
console.log(tmp1);
var local = parseInt(tmp1);
console.log("local")
console.log(local)
console.log(local>0)
  // $('body').css('background-color','purple');  
  if (local>75){
    // socket.emit('change', { upTilt: upTilt});
    // socket.broadcast.emit('change', { upTilt: upTilt});

    console.log('tilted');

    $("#tilted").html(local); 
    $('body').css('background-color','purple');  

  }
    if (local<75){
    // socket.emit('change', { upTilt: upTilt});
    // socket.broadcast.emit('change', { upTilt: upTilt});

    console.log('tilted');

    $("#tilted").html(local); 
    $('body').css('background-color','pink');  

  }
}

setInterval(refresh, 500);