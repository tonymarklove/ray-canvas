

function rand() {
  return Math.random();
};


jQuery(function($) {

  var renderWidth = 800;
  var renderHeight = 600;

  var context = document.getElementById("canvas").getContext('2d');
  var pixels = context.createImageData(renderWidth, renderHeight);

  var frame = 0;
  var previousFrameStartTime = 0;

  var drawFrame = function(frameStartTime) {
    frame++;

    console.debug("Frame " + frame + " ms: " + Math.round(frameStartTime - previousFrameStartTime));
    previousFrameStartTime = frameStartTime;

    for (var y = 0; y < renderHeight; y++) {
      for (var x = 0; x < renderWidth; x++) {
        var offset = x * 4 + (y * 4 * renderWidth);

        pixels.data[offset + 0] = 255;
        pixels.data[offset + 1] = 0;
        pixels.data[offset + 2] = 0;
        pixels.data[offset + 3] = 255;
      }
    }

    context.putImageData(pixels, 0, 0);

    // window.requestAnimationFrame(drawFrame);
  };

  window.requestAnimationFrame(drawFrame);

});
