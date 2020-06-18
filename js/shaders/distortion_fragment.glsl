uniform float time;
uniform float speed;
uniform sampler2D texture;
uniform vec4 resolution;
uniform vec2 mouseTarget;
uniform float progress;

varying vec2 vUv;
varying vec4 vPosition;

void main()	{
	float normSpeed = clamp(speed*40.,0.,1.);
	float mouseDist = length(vUv - mouseTarget);

	float circle = smoothstep(0.2, 0., mouseDist);

	vec2 newUV = (vUv - vec2(0.5))*resolution.zw + vec2(0.5);

	float r = texture2D(texture,newUV + 0.05* circle * normSpeed).r;
	float g = texture2D(texture,newUV + 0.03* circle * normSpeed).g;
	float b = texture2D(texture,newUV + 0.01* circle * normSpeed).b;

	gl_FragColor = vec4(r,g,b,1.);
}