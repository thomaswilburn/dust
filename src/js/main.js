require([
  "mote",
  "render-gl"
], function(Mote, RendererGL) {
  
  var count = 1000;
  var batchSize = 10;
  var renderer;
  var speed = 2;
  var jitter = .05;
  
  var canvas = document.querySelector("canvas[dust]");
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  
  try {
    document.createElement("canvas").getContext("webgl");
    renderer = new RendererGL(canvas);
    count = 3000;
    //set the GL renderer
  } catch (_) {
    console.log("WebGL unavailable, using 2D context");
    //set the 2D renderer
    //renderer = new Renderer2D(canvas);
  }
  
  var reaper = function(mote) {
    return mote.x < 0 || mote.x > canvas.width || mote.y < 0 || mote.y > canvas.height;
  }
  
  var spawn = function() {
    return {
      x: (canvas.width * .1) + (Math.random() * canvas.width * .8),
      y: canvas.height - (30 * Math.random())
    };
  };
  
  var layers = {
    bokeh: {
      ratio: .001,
      rate: 1,
      particles: [],
      make: function() {
        var options = spawn();
        options.size = Math.random() * 8 + 10;
        options.dx = (Math.random() * speed - speed / 1.4) * .4;
        options.dy = (Math.random() * speed - speed) * .4;
        return new Mote(options);
      }
    },
    /*atmosphere: {
      ratio: .1,
      rate: 100,
      particles: [],
      make: function() {
        return new Mote({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          dx: Math.random() * 3 + 3,
          dy: Math.random() * .8 - 2,
          size: .4,
          age: Math.random() * 100
        });
      }
    },*/
    speck: {
      ratio: .5,
      rate: 10,
      particles: [],
      make: function() {
        var scale = 1.5;
        var options = spawn();
        options.size = Math.random() * scale;
        options.dx = options.size / scale;
        options.dy = Math.random() * speed - (speed / 2) * .4;
        return new Mote(options);
      }
    },
    blurred: {
      ratio: .005,
      rate: 2,
      particles: [],
      make: function() {
        var options = spawn();
        options.size = Math.random() * 8;
        options.dx = options.size / 1.5;
        options.dy = Math.random() * speed - (speed / 2) * .4;
        return new Mote(options);
      }
    }
  }
  
  var frame = function() {
    var all = [];
    for (var type in layers) {
      var layer = layers[type];
      var max = count * layer.ratio;
      var dust = layer.particles;
      if (dust.length < max) {
        for (var i = 0; i < layer.rate; i++) {
          dust.push(layer.make())
        }
      }
      for (var i = 0; i < dust.length; i++) {
        var mote = dust[i];
        mote.update();
        //check for dead or reapable motes, spawn replacements
        if (mote.x < 0 || mote.y < 0 || mote.x > canvas.width || mote.y > canvas.height) {
          dust[i] = layer.make();
        }
        //if (mote.age > Math.random() * 500) dust[i] = makeMote();
      }
      all.push.apply(all, dust);
    }
    renderer.render(all);
    requestAnimationFrame(frame);
  };
  
  frame();
  
});
