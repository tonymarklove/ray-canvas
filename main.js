

function rand() {
  return Math.random();
};


jQuery(function($) {

  var renderWidth = 800;
  var renderHeight = 600;

  var context = document.getElementById("canvas").getContext('2d');
  var pixels = context.createImageData(renderWidth, renderHeight);

  var frame = 0;
  var scene = new Scene();

  var moveBallPos = vec(-5, -15, 10);

  scene.addObject({pos: vec(-28, -22, 5), radius: 5});
  scene.addObject({pos: moveBallPos, radius: 10});

  var drawFrame = function(frameStartTime) {
    frame++;

    var look = vec(-6, -16, 0).normalize();
    var up = vec(0, 0, -1).cross(look).normalize().scale(0.002);
    var right = look.cross(up).normalize().scale(0.002);
    var c = up.add(right).scale(-256).add(look);

    for (var y = 0; y < renderHeight; y++) {
      for (var x = 0; x < renderWidth; x++) {
        var offset = x * 4 + (y * 4 * renderWidth);
        var pixelColor = new Vector();

        for (var s = 0; s < settings.samplesPerPixel; s++) {
          var originJitter = settings.jitter ? up.scale(rand()-0.5).scale(99).add(right.scale(rand()-0.5).scale(99)) : vec(0,0,0);
          var origin = vec(0,0,15).add(originJitter);
          var ray = originJitter.scale(-1).add(up.scale(rand()+x).add(right.scale(y+rand()).add(c)).scale(16)).normalize();

          var sample = scene.sample(origin, ray);
          pixelColor = pixelColor.add(sample);
        }

        pixelColor = pixelColor.scale(1/settings.samplesPerPixel).scale(255);

        pixels.data[offset + 0] = pixelColor.x;
        pixels.data[offset + 1] = pixelColor.y;
        pixels.data[offset + 2] = pixelColor.z;
        pixels.data[offset + 3] = 255;
      }
    }

    context.putImageData(pixels, 0, 0);

    console.debug("Frame " + frame + " ms: " + Math.round(performance.now() - frameStartTime));
  };

  window.requestAnimationFrame(drawFrame);

  $("body").keydown(function(e) {
    if(e.keyCode == 37) { // left
      moveBallPos.x += 5;
    }
    else if(e.keyCode == 39) { // right
      moveBallPos.x -= 5;
    }
    else if(e.keyCode == 38) { // up
      moveBallPos.y -= 10;
    }
    else if(e.keyCode == 40) { // down
      moveBallPos.y += 10;
    }
    else {
      return true;
    }

    window.requestAnimationFrame(drawFrame);
  });

  window.renderFrame = function() {
    window.requestAnimationFrame(drawFrame);
  };

});
