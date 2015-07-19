precision mediump float;
uniform vec3 uLight;

varying vec3 vVertexColor;
varying vec3 vWorldSpaceNormal;

void main(void) {
    gl_FragColor = vec4(vVertexColor * dot(uLight, vWorldSpaceNormal) * 0.5 + 0.5 * vVertexColor, 1.0);
}