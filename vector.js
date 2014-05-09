function Vector(x,y,z) {
  if (arguments.length == 0) {
    x = y = z = 0;
  }

  this.x = x;
  this.y = y;
  this.z = z;
}

Vector.prototype.clone = function() {
  return new Vector(this.x, this.y, this.z);
};

Vector.prototype.set = function(x,y,z) {
  this.x = x;
  this.y = y;
  this.z = z;
};

Vector.prototype.magnitude = function() {
  return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
};

Vector.prototype.normalize = function() {
  var m = this.magnitude();

  if (m == 0) {
    m = 1;
  }

  this.x /= m;
  this.y /= m;
  this.z /= m;

  return this;
};

Vector.prototype.add = function(v) {
  return new Vector(this.x + v.x, this.y + v.y, this.z + v.z);
};

Vector.prototype.scale = function(s) {
  return new Vector(this.x * s, this.y * s, this.z * s);
};

Vector.prototype.dot = function(v) {
  return this.x * v.x + this.y * v.y + this.z * v.z;
};

Vector.prototype.cross = function(v) {
  var x = this.y * v.z - this.z * v.y;
  var y = this.z * v.x - this.x * v.z;
  var z = this.x * v.y - this.y * v.x;

  return new Vector(x, y, z);
};

function vec(x,y,z) {
  return new Vector(x,y,z);
}
