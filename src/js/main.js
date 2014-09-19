require([
  "mote",
  "render-gl",
  "render-2d"
], function(Mote, RendererGL, Renderer2D) {
  
  var count = 1500;
  var batchSize = 10;
  var renderer;
  var speed = .2;
  var jitter = .05;
  
  var canvas = document.querySelector("canvas[dust]");
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  
  try {
    //throw("force 2d");
    document.createElement("canvas").getContext("webgl");
    renderer = new RendererGL(canvas);
    count = 6000;
    //set the GL renderer
  } catch (_) {
    console.log("WebGL unavailable, using 2D context");
    //set the 2D renderer
    renderer = new Renderer2D(canvas);
  }
  
  var reaper = function(mote) {
    return mote.x < 0 || mote.x > canvas.width || mote.y < 0 || mote.y > canvas.height;
  }
  
  var spawn = function() {
    return {
      x: (canvas.width * .1) + (Math.random() * canvas.width * .8),
      y: canvas.height - (100 * Math.random())
    };
  };
  
  var layers = {
    bokeh: {
      ratio: .001,
      rate: 1,
      chance: .01,
      particles: [],
      make: function() {
        var options = spawn();
        options.size = Math.random() * 8 + 10;
        options.dx = (Math.random() - .25) * speed;
        options.dy = -Math.random() * speed;
        return new Mote(options);
      }
    },
    speck: {
      ratio: .5,
      rate: 4,
      chance: 1,
      particles: [],
      make: function() {
        var options = spawn();
        options.size = Math.random();
        options.dx = (Math.random - .5) * speed * .1;
        options.dy = -Math.random() * speed;
        return new Mote(options);
      }
    },
    blurred: {
      ratio: .001,
      rate: 10,
      chance: .01,
      particles: [],
      make: function() {
        var options = spawn();
        options.size = Math.random() * 8;
        options.dx = options.size / 10 * speed;
        options.dy = -Math.random() * speed;
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
          if (Math.random() < layer.chance) {
            dust.push(layer.make())
          }
        }
      }
      for (var i = 0; i < dust.length; i++) {
        var mote = dust[i];
        mote.update();
        //check for dead or reapable motes, spawn replacements
        if (reaper(mote)) {
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
