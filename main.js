

function rand() {
  return Math.random();
};


jQuery(function($) {

  var renderWidth = 800;
  var renderHeight = 600;

  var samplesPerPixel = 1;

  var context = document.getElementById("canvas").getContext('2d');
  var pixels = context.createImageData(renderWidth, renderHeight);

  var frame = 0;
  var scene = new Scene();

  var drawFrame = function(frameStartTime) {
    frame++;

    var look = vec(-6, -16, 0).normalize();
    var up = vec(0, 0, 1).cross(look).normalize().scale(0.002);
    var right = look.cross(up).normalize().scale(0.002);
    var c = up.add(right).scale(-256).add(look);

    for (var y = 0; y < renderHeight; y++) {
      for (var x = 0; x < renderWidth; x++) {
        var offset = x * 4 + (y * 4 * renderWidth);
        var pixelColor = new Vector();

        for (var s = 0; s < samplesPerPixel; s++) {
          // Apply some jitter to the origin of the view (For Depth of View blur).
          var originJitter = up.scale(rand()-0.5).scale(99).add(right.scale(rand()-0.5).scale(99));
          var origin = vec(17,16,8).add(originJitter);
          var ray = vec((x-renderWidth/2)/100, (y-renderHeight/2)/100, 4).normalize();

          var ray = originJitter.scale(1).add(up.scale(rand()+x).add(right.scale(y+rand()).add(c))).scale(16).normalize();

          var sample = scene.sample(origin, ray);
          pixelColor = pixelColor.add(sample);
        }

        pixelColor = pixelColor.scale(255);

        pixels.data[offset + 0] = pixelColor.x;
        pixels.data[offset + 1] = pixelColor.y;
        pixels.data[offset + 2] = pixelColor.z;
        pixels.data[offset + 3] = 255;
      }
    }

    context.putImageData(pixels, 0, 0);

    console.debug("Frame " + frame + " ms: " + Math.round(performance.now() - frameStartTime));
    // window.requestAnimationFrame(drawFrame);
  };

  window.requestAnimationFrame(drawFrame);

});
