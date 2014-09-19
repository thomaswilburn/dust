precision highp float;
varying float v_age;
varying float v_size;
const float pi = 3.141592;
const float tau = pi * 2.0;
const float cycle_speed = 300.0;

void drawBokeh(float dist) {
  if (dist < 0.4) {
    //inner ring
    float shade = clamp(dist / 3.0, 0.0, 0.4);
    shade = shade * (1.0 - gl_PointCoord.x);
    shade = shade * (1.0 - gl_PointCoord.y);
    gl_FragColor = vec4(1.0, 1.0, 1.0, shade);
  } else {
    //outer ring
    float shade = 0.0;
    gl_FragColor = vec4(1.0, 1.0, 1.0, shade);
  }
}

float reflect(float age) {
  float shine = mod(age, cycle_speed) / cycle_speed * 2.0;
  if (shine > 1.0) {
    shine = 2.0 - shine;
  }
  return clamp(shine - 0.5, 0.0, 1.0);
}

void drawSpeck(float dist) {
  //round out the fragment
  if (dist > 0.5) discard;
  float shade = reflect(v_age);
  gl_FragColor = vec4(1.0, 1.0, 1.0, shade);
}

void drawBlurred(float dist) {
  if (dist > 0.5) discard;
  float alpha = 1.0 - (v_size / 10.0);
  gl_FragColor = vec4(1.0, 1.0, 1.0, alpha * reflect(v_age));
}

void main() {
  /*
  Three kinds of particle types, by size class:
  1. regular dust motes, which sparkle at various sizes (1-3px?)
  2. fibers, spinning, drawn according to sin/cos (4-10px)
  3. bubbles, drawn as blurred circles (11-20px)
  */
  float dist = distance(gl_PointCoord, vec2(0.5));
  if (v_size > 6.0) {
    drawBokeh(dist);
  // } else if (v_size > 2.0) {
  //   //fibers based on age and location
  //   float shade = smoothstep(0.7, 1.0, 1.0 - abs(gl_PointCoord.x - gl_PointCoord.y));
  //   gl_FragColor = vec4(shade, shade, shade, 1.0);
  } else if (v_size > 2.0) {
    drawBlurred(dist);
  } else {
    drawSpeck(dist);
  }
}