precision mediump float;

uniform vec4 uColor;
uniform vec3 uLight;

varying vec3 vWorldSpaceNormal;
varying vec3 vPos;

void main(void) {
    gl_FragColor = vec4(vPos * dot(uLight, vWorldSpaceNormal) * 0.5 + 0.5 * uColor.rgb, uColor.w);
}