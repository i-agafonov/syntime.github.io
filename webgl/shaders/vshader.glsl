attribute vec2 aVertexPosition;

uniform mat2 uRotationMatrix;

void main(void) {
    gl_Position = vec4(uRotationMatrix * aVertexPosition, 0.0, 1.0);
}