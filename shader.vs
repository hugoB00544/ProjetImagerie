
attribute vec3 aVertexPosition;
attribute vec2 texCoords;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

uniform float uYPos;

varying vec2 tCoords;
varying float text;

void main(void) {
	tCoords = texCoords;

	// on ajoute le décalage uYPos à la position des sommets pour supperposer les tranches

	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition + vec3(0,uYPos,0), 1.0);
}
