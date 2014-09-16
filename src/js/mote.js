define(function() {
  
  var speedLimit = .6;
  var jitter = .1;
  var coinToss = function() { return Math.random() > .5 };
  
  var Mote = function(options) {
    options = options || {};
    this.x = options.x || 0;
    this.y = options.y || 0;
    this.dx = options.dx || 0;
    this.dy = options.dy || 0;
    this.size = options.size || .5;
    this.age = options.age || 0;
  };
  
  Mote.prototype = {
    update: function(time) {
      time = time || 1;
      this.x += (this.dx + (coinToss() ? jitter : -jitter)) * time;
      this.y += (this.dy + (coinToss() ? jitter : -jitter)) * time;
      //add some horizontal variation
      this.dx += (Math.random() - .5) * .1;
      if (Math.abs(this.dx) > speedLimit) {
        this.dx *= .5;
      }
      this.age += time + Math.random() * 2;
    }
  };
  
  return Mote;
  
});