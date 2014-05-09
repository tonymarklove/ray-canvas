var Scene = function() {
  this.objects = [];
  this.lights = [];
  this.lightPos = vec(5, 0, 20);
};

Scene.prototype.addObject = function(obj) {
  this.objects.push(obj);
};

Scene.prototype.sample = function(origin, direction) {
  var trace = this.traceRay(origin, direction);

  if (trace.hit == 0) {
    return vec(0.7, 0.6, 1).scale(Math.pow(1-direction.z, 4));
  }

  var intersectPoint = origin.add(direction.scale(trace.t));
  var intersectPointToLight = this.lightPos.add(randVec()).add(intersectPoint.scale(-1)).normalize();
  var normal = trace.normal;
  var halfVec = direction.add(normal.scale(normal.dot(direction) * -2));
  var lambertian = intersectPointToLight.dot(normal);

  if (lambertian < 0) {
    lambertian = 0;
  }

  if (trace.hit == 1) {
    var factor = lambertian * 0.7 + 0.1;

    intersectPoint = intersectPoint.scale(0.2);
    if ((Math.ceil(intersectPoint.x) + Math.ceil(intersectPoint.y)) & 1) {
      return vec(1,0.2,0.2).scale(factor);
    } else {
      return vec(0.95,0.95,0.95).scale(factor);
    }
  }

  var color = lambertian > 0 ? Math.pow(intersectPointToLight.dot(halfVec), 99) : 0;
  var sample = this.sample(intersectPoint, halfVec);

  return vec(color, color, color).add(sample.scale(0.5));
};

Scene.prototype.traceRay = function(origin, direction) {
  var t = 1000000000;
  var m = 0;
  var p = -(origin.z / direction.z);
  var n = new Vector();

  if (p > 0.01) {
    t = p;
    n = new Vector(0,0,1);
    m = 1;
  }

  this.objects.forEach(function(sphere) {
    var originToCenter = origin.sub(sphere.pos);
    var b = originToCenter.dot(direction);
    var c = originToCenter.dot(originToCenter) - sphere.radius * 2;
    var discriminant = b * b - c;

    if (discriminant > 0) {
      // We hit the sphere
      var cameraSphereDist = -b - Math.sqrt(discriminant);

      if (cameraSphereDist < t && cameraSphereDist > 0.01)
        // New smallest distance
        t = cameraSphereDist;
        n = originToCenter.add(direction).scale(cameraSphereDist).normalize();
        m = 2;
     }
  });

  return {hit: m, t: t, normal: n};
};
