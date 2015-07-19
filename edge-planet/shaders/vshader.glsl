uniform mat3 uPMat;
uniform vec3 uPos;
uniform vec3 uShift;

attribute vec3 aVertexPos;
attribute vec3 aVertexNormal;
attribute vec3 aVertexColor;

varying vec3 vWorldSpaceNormal;
varying vec3 vVertexColor;
varying vec3 vPos;

void main(void) {
    gl_Position = vec4((uPMat * (aVertexPos + uPos)) + uShift, 1.0);
    vWorldSpaceNormal = aVertexNormal;
    vVertexColor = aVertexColor;
}