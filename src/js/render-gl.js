define([
  "text!particle-vertex.glsl",
  "text!particle-fragment.glsl"
], function(vertexSource, fragmentSource) {
  
  var Renderer = function(canvas) {
    var gl = this.gl = canvas.getContext("webgl");
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    window.gl = gl;
    this.program = gl.createProgram();
    this.uniforms = {};
    this.attributes = {};
    this.vertexBuffer = gl.createBuffer();
    
    var vertex = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertex, vertexSource);
    gl.compileShader(vertex);
    
    var fragment = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragment, fragmentSource);
    gl.compileShader(fragment);
    
    gl.attachShader(this.program, vertex);
    gl.attachShader(this.program, fragment);
    gl.linkProgram(this.program);
    
    this.uniforms.resolution = gl.getUniformLocation(this.program, "resolution");
    this.attributes.position = gl.getAttribLocation(this.program, "position");
    this.attributes.age = gl.getAttribLocation(this.program, "a_age");
    this.attributes.size = gl.getAttribLocation(this.program, "a_size");
    
    this.activate();
  };
  
  Renderer.prototype = {
    activate: function() {
      this.gl.useProgram(this.program);
      for (var key in this.attributes) {
        this.gl.enableVertexAttribArray(this.attributes[key]);
      }
    },
    deactivate: function() {
      for (var key in this.attributes) {
        this.gl.disableVertexAttribArray(this.attributes[key]);
      }
    },
    render: function(particleList) {
      var gl = this.gl;
      
      //flatten particles into buffer, attach to buffer, and 
      var flattened = [];
      for (var i = 0; i < particleList.length; i++) {
        var particle = particleList[i];
        flattened.push(particle.x, particle.y, particle.age, particle.size);
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flattened), gl.STATIC_DRAW);
      gl.vertexAttribPointer(this.attributes.position, 2, gl.FLOAT, false, 16, 0);
      gl.vertexAttribPointer(this.attributes.age, 1, gl.FLOAT, false, 16, 8);
      gl.vertexAttribPointer(this.attributes.size, 1, gl.FLOAT, false, 16, 12);
      
      gl.uniform2f(this.uniforms.resolution, gl.canvas.width, gl.canvas.height);
      gl.drawArrays(gl.POINTS, 0, particleList.length);
    }
  };
  
  return Renderer;
  
});