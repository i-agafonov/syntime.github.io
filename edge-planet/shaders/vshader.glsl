uniform mat3 uPMat;
uniform vec3 uPos;

attribute vec3 aVertexPos;
attribute vec3 aVertexNormal;

varying vec3 vWorldSpaceNormal;
varying vec3 vPos;

void main(void) {
    //gl_Position = vec4(aVertexPos.x + aVertexPos.y, (aVertexPos.x - aVertexPos.y) * 0.5 + aVertexPos.z, aVertexPos.x - aVertexPos.y, 1.0);
    gl_Position = vec4(uPMat * (aVertexPos + uPos), 1.0);
    vPos = aVertexPos * 18.0;
    vWorldSpaceNormal = aVertexNormal;
}