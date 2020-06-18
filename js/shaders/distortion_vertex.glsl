  
uniform float time;
uniform float progress;
uniform float direction;
varying vec2 vUv;
varying vec4 vPosition;


float calculate_z_progress(float progress, float direction){
  float result = min(2.*progress, 1.);

  if(direction == -1.) {
    result = 1.-min(2.* (1.-progress), 1.);
  }

  return result;
}

void main() {

  vec3 pos = position;

  float dist = length(uv - vec2(0.5));
  float maxdist = length(vec2(0.5));

  float stickEffect = direction * dist/maxdist;

  float distortion = 2.*min(progress, 1.-progress);

  float zOffset = 1.;

  float zProgress = calculate_z_progress(progress,direction);

  pos.z += zOffset * (stickEffect * distortion - zProgress);

  pos.z += progress*sin(dist*10. + 2.*time)*0.1;

  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
}