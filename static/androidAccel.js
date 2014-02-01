$( document ).ready(function() {

  var phone = new Object({posX:0, posY:0, posZ:20});

  init();
    var count = 0;



  // OSName= navigator.appVersion;



function refresh(){


var tmp1 = $('#doTiltFB').html();
// console.log(tmp1);
var local = parseInt(tmp1);
// console.log("local")
// console.log(local)
// console.log(local>0)
  // $('body').css('background-color','purple');  
  if (local>0){
    // socket.emit('change', { upTilt: upTilt});
    // socket.broadcast.emit('change', { upTilt: upTilt});

    // console.log('tilted');

    $("#tilted").html(local); 
    $('body').css('background-color','purple');  

  }
    if (local<0){
    // socket.emit('change', { upTilt: upTilt});
    // socket.broadcast.emit('change', { upTilt: upTilt});

    // console.log('tilted');

    $("#tilted").html(local); 
    $('body').css('background-color','pink');  



  }

}

setInterval(refresh, 500);





  console.log( "ready!" );

    var socket = io.connect('/');


  // var socket = io.connect('/');

  socket.on('players', function (data) {
    // console.log(data);
    $("#numPlayers").text(data.number);
  });
    
  socket.on('playerNameUpdate', function (data) {
    // console.log(data);
    var players = "<ul>";
    for(var i=0; i < data.listOfPlayers.length; i++)
    players+="<li>"+data.listOfPlayers[i]+"</li>";
    players+="</ul>";
    $("#playerList").html(players); 
    // console.log(players);
  });


  // Form Submission
  $("#submitButton").click(function(){
    socket.emit('playerNameAdded', { playerName : $("#playerName").val()});
    console.log($("#playerName").val());
  });

  if ( keyboard.pressed("enter") ){
    console.log("NETR")
  }

  $("#playerName").keyup(function(event){
    if(event.keyCode == 13){
        $("#submitButton").click();
    }
  });

  $("#moveit").on('click', function(){
    //   delta = clock.getDelta(); 
    //   walking = true;
    // var moveDistance = 600 * delta;
    // console.log("i like to move it");
    // android.translateZ(  moveDistance )
  });



  // WebSockets
  socket.on('phoneDataUpdateOnPage', function (data) {
     // console.log(data);
    // console.log(data.phone.posX)
    
    $("#ltr").html(data.phone.phone.posX); 
    $("#ftb").html(data.phone.phone.posY); 
    $("#posZ").html(data.phone.phone.posZ); 

    var winH = $(window).height();

    var initPosX = android.position.z;
    var deltaX = initPosX + data.phone.phone.posX;
    if ((deltaX >=5) && (deltaX < 1000)){}
      $("#ball").css('left', deltaX);

    // var initPosX = $("#ball").offset().left; 
    var deltadir = data.phone.phone.posZ;
    // // if (deltadir>=0 && deltadir<90)
    // if (deltadir>=350)                //left
    //   {var deltaX = initPosX - 0.1*(360-(deltadir))}
    // if(deltadir>0 && deltadir<170) // left
    //   {var deltaX = initPosX - 0.1*deltadir;}
    // if (deltadir < 350 && deltadir>= 200)         // right
    //   {var deltaX = initPosX + 0.1*(360-(deltadir))}
    // if (deltaX < 990)
    //   $("#ball").css('left', deltaX);
    
    var initPosY = android.position.z;
    var deltaY = initPosY - .01*data.phone.phone.posY;
    console.log(deltaY);
    if ((deltaY >=50) && (deltaY < 730)){
            $("#ball").css('top', deltaY);

      delta = clock.getDelta(); 
      walking = true;
      var moveDistance = 300 * delta;
      console.log("i like to move it");
      android.translateZ(  moveDistance )
    }
    if (deltaY <=70){
            $("#ball").css('top', deltaY);

            delta = clock.getDelta(); 
      walking = true;
      var moveDistance = 300 * delta;
      console.log("i like to move it");
      android.translateZ( -moveDistance )
    }
    
    var deltadir = data.phone.phone.posZ;
    if(deltadir>0 && deltadir<170 && (data.phone.phone.posX <= 2)) // left
      {var deltaX = initPosX - 25;}
    if(deltadir<=360 && deltadir>270 && (data.phone.phone.posX >= 2)) // right
      {var deltaX = initPosX + 25;}

    // console.log(deltadir)

    // debugger;
    // console.log(players);
  });


  function updateDesktop(ltr, ftb, dir){
    phone.posX = ltr;
    phone.posY = ftb; 
    phone.posZ = dir;
    console.log("PHONE:");

    socket.emit('change', {phone : phone});
    // console.log(phone);
  }



function init() {
    var OSName = "Unknown OS";

    if (navigator.appVersion.indexOf("Win")!=-1) OSName="Windows";
    if (navigator.appVersion.indexOf("Mac")!=-1) OSName="MacOS";
    if (navigator.appVersion.indexOf("X11")!=-1) OSName="UNIX";
    if (navigator.appVersion.indexOf("Linux")!=-1) OSName="Linux";
    if (navigator.appVersion.indexOf("Android")!=-1) OSName="Android";
    if (navigator.appVersion.indexOf("iPhone")!=-1) OSName="iPhone";

    $("#os").html(navigator.appVersion);

      // if (OSName == "Android") {
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

          // console.log(eventData);
          // debugger;

          }, false);
      } else {
        document.getElementById("doEvent").innerHTML = "Not supported on your device or browser.  Sorry."
      }
    
  
    function deviceOrientationHandler(tiltLR, tiltFB, dir) {
      document.getElementById("doTiltLR").innerHTML = Math.round(tiltLR);
      document.getElementById("doTiltFB").innerHTML = Math.round(tiltFB);
      document.getElementById("doDirection").innerHTML = Math.round(dir);
      
      // Apply the transform to the image
      // var logo = document.getElementById("imgLogo");
      // logo.style.webkitTransform = "rotate("+ tiltLR +"deg) rotate3d(1,0,0, "+ (tiltFB*-1)+"deg)";
      // logo.style.MozTransform = "rotate("+ tiltLR +"deg)";
      // logo.style.transform = "rotate("+ tiltLR +"deg) rotate3d(1,0,0, "+ (tiltFB*-1)+"deg)";

      if (OSName == "Android" || OSName == "iPhone") {
      $("#posZ").html(Math.round(dir)); // bypassed some error... 
        updateDesktop(Math.round(tiltLR), Math.round(tiltFB), Math.round(dir));
      }
    }
    
    
    // Some other fun rotations to try...
    //var rotation = "rotate3d(0,1,0, "+ (tiltLR*-1)+"deg) rotate3d(1,0,0, "+ (tiltFB*-1)+"deg)";
    //var rotation = "rotate("+ tiltLR +"deg) rotate3d(0,1,0, "+ (tiltLR*-1)+"deg) rotate3d(1,0,0, "+ (tiltFB*-1)+"deg)";
  // } // if android end
} 



});

