define(function() {
  
  var rgba = function() { return "rgba(" + [].join.call(arguments, ",") + ")" };
  var gray = function(b, a) { return rgba(b, b, b, a) };
  
  var Renderer = function(canvas) {
    //canvas needs to be downscaled for speed
    canvas.width *= .5;
    canvas.height *= .5;
    
    this.context = canvas.getContext("2d");
    this.gradient = this.context.createRadialGradient(10, 10, 5, 10, 10, 10);
    this.gradient.addColorStop(0, gray(255, 0));
    this.gradient.addColorStop(.8, gray(255, .07));
    this.gradient.addColorStop(1, gray(255, .15));
  }
  
  var now = null;
  
  Renderer.prototype = {
    speck: function(mote, i) {
      if (mote.age != now) {
        var mod = (mote.age % 300) / 300 * 2;
        var shade = mod > 1 ? 2 - mod : mod;
        shade -= .6;
        if (shade < 0) shade = 0;
        this.context.fillStyle = gray(255, shade);
        now = mote.age;
      }
      var half = mote.size / 2;
      this.context.beginPath();
      this.context.arc(mote.x, mote.y, half, 0, Math.PI * 2);
      this.context.fill();
      // this.context.fillRect(mote.x - half, mote.y - half, mote.size, mote.size);
    },
    orb: function(mote, i) {
      now = null;
      if (this.context.fillStyle != this.gradient) {
        this.context.fillStyle = this.gradient;
      }
      var half = mote.size / 4;
      this.context.translate(mote.x + half, mote.y + half);
      this.context.beginPath();
      this.context.arc(half, half, half, 0, Math.PI * 2);
      this.context.fill();
      this.context.closePath();
      this.context.translate(-mote.x - half, -mote.y - half);
    },
    render: function(particleList) {
      //clear canvas, set resolution
      // this.context.canvas.width = this.context.canvas.offsetWidth;
      // this.context.canvas.height = this.context.canvas.offsetHeight;
      this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
      
      particleList.sort(function(a, b) {
        return a.age - b.age;
      });
      
      var now = null;
      
      for (var i = 0; i < particleList.length; i++) {
        var mote = particleList[i];
        if (mote.size <= 10) {
          this.speck(mote, i);
        } else {
          this.orb(mote, i);
        }
      }
    }
  }
  
  return Renderer;
  
});