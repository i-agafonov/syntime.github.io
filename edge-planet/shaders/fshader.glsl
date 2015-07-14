precision mediump float;

uniform vec3 uColor;
uniform vec3 uLight;

varying vec3 vWorldSpaceNormal;

void main(void) {
    gl_FragColor = vec4(uColor * dot(uLight, vWorldSpaceNormal) * 0.5 + 0.5 * uColor, 1.0);
}