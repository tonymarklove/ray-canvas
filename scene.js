var Scene = function() {
  this.objects = [];
  this.lights = [];
  this.lightPos = vec(-15, 0, 20);
};

Scene.prototype.addObject = function(obj) {
  this.objects.push(obj);
};

Scene.prototype.sample = function(origin, direction, recurseDepth) {
  if (recurseDepth && recurseDepth > 5) {
    return vec(0, 0, 0);
  }

  var trace = this.traceRay(origin, direction);

  if (trace.hit == "sky") {
    return Vector.lerp(vec(0.35, 0.55, 0.67), vec(0.04, 0.3, 0.45), 1-direction.z);
  }

  var intersectPoint = origin.add(direction.scale(trace.t));
  var intersectPointToLight = this.lightPos.add(randVec()).sub(intersectPoint).normalize();
  var normal = trace.normal;
  var lambertian = intersectPointToLight.dot(normal);

  if (lambertian < 0) {
    lambertian = 0;
  }

  if (settings.shadows) {
    var shadowTrace = this.traceRay(intersectPoint, intersectPointToLight);

    if (shadowTrace.hit != "sky") {
      lambertian = 0;
    }
  }

  if (trace.hit == "ground") {
    var factor = lambertian * 0.7 + 0.1;
    var floorColor = vec(1,0.2,0.2);

    if (!settings.textures) {
      return floorColor.scale(factor);
    }

    intersectPoint = intersectPoint.scale(0.2);
    if ((Math.ceil(intersectPoint.x) + Math.ceil(intersectPoint.y)) & 1) {
      return floorColor.scale(factor);
    } else {
      return vec(0.95,0.95,0.95).scale(factor);
    }
  }

  var reflectVec = direction.sub(normal.scale(normal.dot(direction) * 2));
  var color = (settings.reflections && lambertian > 0) ? Math.pow(intersectPointToLight.dot(reflectVec), 99) : 0;
  var sample = new Vector();

  if (settings.reflections) {
    sample = this.sample(intersectPoint, reflectVec, recurseDepth ? recurseDepth + 1 : 1);
  } else {
    var ballColor = vec(0.08, 0.26, 0.36);
    var diffuseColor = ballColor.scale(vec(0, 0, 1).dot(normal)).add(ballColor);
    sample = diffuseColor;
  }

  return vec(color, color, color).add(sample.scale(settings.shinyness));
};

Scene.prototype.traceRay = function(origin, direction) {
  var t = 1000000000;
  var m = "sky";
  var p = -(origin.z / direction.z);
  var n = new Vector();

  if (p > 0.01) {
    t = p;
    n = new Vector(0,0,1);
    m = "ground";
  }

  this.objects.forEach(function(sphere) {
    var originToCenter = sphere.pos.sub(origin);
    var b = originToCenter.dot(direction);
    var c = originToCenter.dot(originToCenter) - (sphere.radius * 2);
    var discriminant = b * b - c;

    if (discriminant > 0) {
      // We hit the sphere
      var cameraSphereDist = b - Math.sqrt(discriminant);

      if (cameraSphereDist < t && cameraSphereDist > 0.01) {
        // New smallest distance
        t = cameraSphereDist;
        n = origin.add(direction.scale(cameraSphereDist)).sub(sphere.pos).normalize();
        m = "object";
      }
    }
  });

  return {hit: m, t: t, normal: n};
};
