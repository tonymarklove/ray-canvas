var Scene = function() {
  this.objects = [];
  this.lights = [];
};

Scene.prototype.sample = function(origin, direction) {
  // var trace = this.traceRay(origin, direction);

  var color = new Vector(0.7, 0.6, 1);
  return color.scale(Math.pow(1-direction.z, 4));
};

Scene.prototype.traceRay = function(origin, direction) {
  var t = 1000000000;
  var m = 0;
  var p = -(origin.z / direction.z);
  var n = new Vector();

  if (.01<p) {
    t = p;
    n = new Vector(0,0,1);
    m = 1;
  }

  return {hit: m, t: t, normal: n};
};
