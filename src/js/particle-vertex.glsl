uniform vec2 resolution;
attribute vec2 position;
attribute float a_age;
attribute float a_size;
varying float v_age;
varying float v_size;

void main() {
  vec2 vertex = position / resolution * 2.0 - 1.0;
  vec2 inverted = vertex * vec2(1.0, -1.0);
  gl_Position = vec4(inverted, 0, 1);
  gl_PointSize = a_size;
  v_age = a_age;
  v_size = a_size;
}