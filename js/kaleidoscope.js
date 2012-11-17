$(document).ready(function () {

  var parameters = (function (src) {
    var params = {}, qryStr = src.split('?')[1];
    qryStr && $.each(qryStr.split('&'), function (i, p) {
        ps = p.replace(/\/$/, '').split('=');
        var k = ps[0].replace(/^\?/, '');
        params[k] = ps[1] || true;
    });
    return params;
  })(location.search);

  // PARAMETER: *n* is the number of segements.
  var n = ~~parameters['n'] || 7;
  if (n) {
    var tiles = '';
    for (var i = 0; i <= n * 2; i++) {
      tiles += '<div class="tile t' + i + '"><div class="image"></div></div>';
    }
  }

  var $kaleidescope = $('.kaleidoscope');
  $kaleidescope.addClass('n' + n);
  $kaleidescope.append(tiles);
  var $image = $kaleidescope.find('.image');

  // PARAMETER: *src* is the URL for an alternate image.
  var src = parameters['src'];
  if (src)
    $image.css('background-image', 'url(' + src + ')');

  // PARAMETER: *clean* hides the Github link.
  var clean = parameters['clean'];
  if (clean)
    $('#fork').hide();

  // PARAMETER (undocumented): *mode* changes the animation style.
  var mode = ~~parameters['mode'] || 2;

  var x = 0;
  var y = 0;


  // Project changes in cursor (x, y) onto the image background position.
  $kaleidescope.mousemove(function (e) {
    x++;
    y++;

    var nx = e.pageX, ny = e.pageY;
    switch (mode) {
      case 1: {
        nx = -x;
        ny = e.pageY;
        break;
      }
      case 2: {
        nx = e.pageX;
        ny = -y;
        break;
      }
      case 3: {
        nx = x;
        ny = e.pageY;
        break;
      }
      case 4: {
        nx = e.pageX;
        ny = y;
        break;
      }
      case 5: {
        nx = x;
        ny = y;
      }
    }

    move( nx, ny );
    auto = false;
  })
  
  // Request Fullscreen for maximum LSD effect
  var $fullscreen = $('#fullscreen');
  var k = $kaleidescope[0];
  
  $fullscreen.click(function(){
    if (document.fullscreenEnabled || document.mozFullScreenEnabled || 
        document.webkitFullscreenEnabled) {
      if (k.requestFullscreen)       k.requestFullscreen();
      if (k.mozRequestFullScreen)    k.mozRequestFullScreen();
      if (k.webkitRequestFullscreen) k.webkitRequestFullscreen();
    }
  });

  // Animate all the things!
  window.requestAnimFrame = (function( window ) {
    var suffix = "equestAnimationFrame",
      rAF = [ "r", "webkitR", "mozR", "msR", "oR" ].filter(function( val ) {
        return val + suffix in window;
      })[ 0 ] + suffix;

    return window[ rAF ]  || function( callback, element ) {
      window.setTimeout(function() {
        callback( +new Date );
      }, 1000 / 60);
    };
  })( window );

  var auto_x = 0;
  var auto_y = 0;
  var auto = false;
  var auto_speed = parameters['auto_speed'] || 3;

  function animate() {
    var time = new Date().getTime() * ['.000', auto_speed].join();
    var auto_x = Math.sin( time ) * document.body.clientWidth;
    var auto_y = Math.cos( time ) * document.body.clientHeight;

    move( auto_x, auto_y );
    if (auto) requestAnimFrame(animate);
  }

  function move( x, y ) {
    $image.css('background-position', [x + "px", y + "px"].join(' '));
  }

  // Timer to check for inactivity
  (function timer() {
    setTimeout(function() {
      timer();
      if (!auto) {
        auto = true;
      } else {
        animate();
      }
    }, 5000 );
  })();
});
