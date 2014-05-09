var Scene = function() {
  this.objects = [];
  this.lights = [];
};

Scene.prototype.sample = function(origin, direction) {
  var trace = this.traceRay(origin, direction);

  if (trace.hit == 0) {
    return vec(0.7, 0.6, 1).scale(Math.pow(1-direction.z, 4));
  }

  var intersectPoint = origin.add(direction.scale(trace.t));

  if (trace.hit == 1) {
    intersectPoint = intersectPoint.scale(0.2);
    if ((Math.ceil(intersectPoint.x) + Math.ceil(intersectPoint.y)) & 1) {
      return vec(1,0.2,0.2);
    } else {
      return vec(0.95,0.95,0.95);
    }
  }

  return vec(0, 0, 0);
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
