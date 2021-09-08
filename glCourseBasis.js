
// =====================================================
var gl;
var shadersLoaded = 0;
var vertShaderTxt;
var fragShaderTxt;
var shaderProgram = null;
var vertexBuffer;
var colorBuffer;
var yPos;
var mvMatrix = mat4.create();
var pMatrix = mat4.create();
var objMatrix = mat4.create();
var nb = 181;
var pas = 0.003;
var trancheUp = 181;
var trancheDown = 0;
var typeMode = 0.0;
var transp = 1.0;
var affichCol1 = 1.0;
var affichCol2 = 1.0;
var affichCol3 = 1.0;
var affichCol4 = 1.0;
var affichCol5 = 1.0;

var borneCol1 = 0.7;
var borneCol2 = 1.4;
var borneCol3 = 2.5;
var borneCol4 = 2.8;
var borneTransfMin = 0.0;
var borneTransfMax = 1.0;
var affTranche = 0.0;
var choixTranche = 100;

mat4.identity(objMatrix);



// =====================================================
function webGLStart() {
	var canvas = document.getElementById("WebGL-test");
	canvas.onmousedown = handleMouseDown;
	document.onmouseup = handleMouseUp;
	document.onmousemove = handleMouseMove;

	//création du tableau qui contiendra le path vers toutes les images
	images=[];
	for (i=1;i<=nb;i++){
		images.push('images/'+(nb+1-i)+'.jpg');
	}


	initGL(canvas);
	initBuffers();
	initTexture(images);
	loadShaders('shader');


	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.enable(gl.DEPTH_TEST);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	gl.enable(gl.BLEND);


	drawScene();
	tick();
}

// =====================================================
function initGL(canvas)
{
	try {
		gl = canvas.getContext("experimental-webgl");
		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height;
		gl.viewport(0, 0, canvas.width, canvas.height);
	} catch (e) {}
	if (!gl) {
		console.log("Could not initialise WebGL");
	}
}

//fonction pour faire varier la tranche maximale affichée
function changeSizeUp(){
	var sliderTrancheUp = document.getElementById("pileUp");
	trancheUp = sliderTrancheUp.value;
}

//fonction pour faire varier la tranche minimale affichée
function changeSizeDown(){
	var sliderTrancheDown = document.getElementById("pileDown");
	trancheDown = sliderTrancheDown.value;
}

//fonction pour faire changer le mode d'affichage en niveaux de gris / fausses couleurs / fonction de transfert
function changeModeType(){
	var sliderTypeMode = document.getElementById("modeType");
	if (sliderTypeMode.value == "grey"){
		typeMode = 0.0;
	}else if(sliderTypeMode.value == "colour"){typeMode = 1.0;}
	else if(sliderTypeMode.value == "transfert"){typeMode = 2.0;}

}

//fonction pour changer le mode d'affichage des tranches en objet 3D/ une seule tranche
function changeModeTranche(){
	var sliderAffTranche = document.getElementById("affichTranche");
	if (sliderAffTranche.checked == true){
		affTranche = 1.0;
	}else{affTranche = 0.0;}
}

//fonction pour changer la tranche affichée
function changeTranche(){
	var sliderChoixTranche = document.getElementById("choixTranche");
	choixTranche = sliderChoixTranche.value;
}

//fonction pour changer la borne minimum de la fonction de transfert
function changeTransfMin(){
	var sliderTransfMin = document.getElementById("transfMin");
	borneTransfMin = sliderTransfMin.value;

}

//fonction pour changer la borne maximum de la fonction de transfert
function changeTransfMax(){
	var sliderTransfMax = document.getElementById("transfMax");
	borneTransfMax = sliderTransfMax.value;
}


//fonction pour changer la transparence
function changeTransp(){
	var sliderTransp = document.getElementById("transp");
	transp = sliderTransp.value;
}

//fonction pour changer la borne d'intensité de la 1ière couleur
function changeColour1(){
	var sliderCol1 = document.getElementById("rangeColour1");
	borneCol1 = sliderCol1.value;
}
//fonction pour changer la borne d'intensité de la 2ième couleur
function changeColour2(){
	var sliderCol2 = document.getElementById("rangeColour2");
	borneCol2 = sliderCol2.value;
}

//fonction pour changer la borne d'intensité de la 3ième couleur
function changeColour3(){
	var sliderCol3 = document.getElementById("rangeColour3");
	borneCol3 = sliderCol3.value;
}

//fonction pour changer la borne d'intensité de la 4ième couleur
function changeColour4(){
	var sliderCol4 = document.getElementById("rangeColour4");
	borneCol3 = sliderCol4.value;
}

//fonction pour changer le bool qui affiche ou pas la couleur 1
function affColour1(){
	var sliderAffCol1 = document.getElementById("affichCol1");
	if (sliderAffCol1.checked == true){
		affichCol1 = 1.0;
	}else{affichCol1 = 0.0;}
}

//fonction pour changer le bool qui affiche ou pas la couleur 2
function affColour2(){
	var sliderAffCol2 = document.getElementById("affichCol2");
	if (sliderAffCol2.checked == true){
		affichCol2 = 1.0;
	}else{affichCol2 = 0.0;}
}

//fonction pour changer le bool qui affiche ou pas la couleur 3
function affColour3(){
	var sliderAffCol3 = document.getElementById("affichCol3");
	if (sliderAffCol3.checked == true){
		affichCol3 = 1.0;
	}else{affichCol3 = 0.0;}
}

//fonction pour changer le bool qui affiche ou pas la couleur 4
function affColour4(){
	var sliderAffCol4 = document.getElementById("affichCol4");
	if (sliderAffCol4.checked == true){
		affichCol4 = 1.0;
	}else{affichCol4 = 0.0;}
}

//fonction pour changer le bool qui affiche ou pas la couleur 5
function affColour5(){
	var sliderAffCol5 = document.getElementById("affichCol5");
	if (sliderAffCol5.checked == true){
		affichCol5 = 1.0;
	}else{affichCol5 = 0.0;}
}


// =====================================================
function initBuffers() {
	// Vertices (array)
	vertices = [
		-0.3, 0.2, -0.3,
		-0.3,  0.0, 0.3,
		 0.3,  0.0, 0.3,
		0.3,  0.2, -0.3,
		];
	vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	vertexBuffer.itemSize = 3;
	vertexBuffer.numItems = 4;

	// Texture coords (array)
	texcoords = [
		0.0, 0.0,
		0.0, 1.0,
		1.0, 1.0,
		1.0, 0.0,
		   ];
	texCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);
	texCoordBuffer.itemSize = 2;
	texCoordBuffer.numItems = 4;
	
	// Index buffer (array)
	var indices = [ 0, 1, 2, 3];
	indexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
	indexBuffer.itemSize = 1;
	indexBuffer.numItems = indices.length;
	
}


// =====================================================
function initTexture(nomImage) {
	
	texture=[];

	//on crée une texture pour chaque image dans le tableau de nom d'image
	for (i=0; i<nomImage.length;i++) {
		texture[i] = gl.createTexture();
		var texImage = new Image();
		texImage.src = nomImage[i];

		texture[i].image = texImage;

		//on load chaque texture. les textures sont load a part car elles ne voulait pas ce loader directement ici.
		loadTexture(i);
	}
	
}

function loadTexture(text){
	
	texture[text].image.onload = function () {
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.bindTexture(gl.TEXTURE_2D, texture[text]);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture[text].image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.uniform1i(shaderProgram.samplerUniform, 0);
		gl.activeTexture(gl.TEXTURE0);
	}
}


// =====================================================
function loadShaders(shader) {
	loadShaderText(shader,'.vs');
	loadShaderText(shader,'.fs');
}

// =====================================================
function loadShaderText(filename,ext) {   // technique car lecture asynchrone...
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
			if(ext=='.vs') { vertShaderTxt = xhttp.responseText; shadersLoaded ++; }
			if(ext=='.fs') { fragShaderTxt = xhttp.responseText; shadersLoaded ++; }
			if(shadersLoaded==2) {
				initShaders(vertShaderTxt,fragShaderTxt);
				shadersLoaded=0;
			}
    }
  }
  xhttp.open("GET", filename+ext, true);
  xhttp.send();
}

// =====================================================
function initShaders(vShaderTxt,fShaderTxt) {

	vshader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vshader, vShaderTxt);
	gl.compileShader(vshader);
	if (!gl.getShaderParameter(vshader, gl.COMPILE_STATUS)) {
		console.log(gl.getShaderInfoLog(vshader));
		return null;
	}

	fshader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fshader, fShaderTxt);
	gl.compileShader(fshader);
	if (!gl.getShaderParameter(fshader, gl.COMPILE_STATUS)) {
		console.log(gl.getShaderInfoLog(fshader));
		return null;
	}

	shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vshader);
	gl.attachShader(shaderProgram, fshader);

	gl.linkProgram(shaderProgram);

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		console.log("Could not initialise shaders");
	}

	gl.useProgram(shaderProgram);

	shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
	gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

	shaderProgram.texCoordsAttribute = gl.getAttribLocation(shaderProgram, "texCoords");
	gl.enableVertexAttribArray(shaderProgram.texCoordsAttribute);

	shaderProgram.yPosUniform = gl.getUniformLocation(shaderProgram, "uYPos");

	shaderProgram.typeModeUniform = gl.getUniformLocation(shaderProgram, "uTypeMode");

	shaderProgram.transpUniform = gl.getUniformLocation(shaderProgram, "uTransp");

	shaderProgram.transfMinUniform = gl.getUniformLocation(shaderProgram, "uBorneTransfMin");

	shaderProgram.transfMaxUniform = gl.getUniformLocation(shaderProgram, "uBorneTransfMax");

	shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");

	shaderProgram.borne1Uniform = gl.getUniformLocation(shaderProgram, "uBorne1");
	shaderProgram.borne2Uniform = gl.getUniformLocation(shaderProgram, "uBorne2");
	shaderProgram.borne3Uniform = gl.getUniformLocation(shaderProgram, "uBorne3");
	shaderProgram.borne4Uniform = gl.getUniformLocation(shaderProgram, "uBorne4");

	shaderProgram.affichCol1Uniform = gl.getUniformLocation(shaderProgram, "uAffichCol1");
	shaderProgram.affichCol2Uniform = gl.getUniformLocation(shaderProgram, "uAffichCol2");
	shaderProgram.affichCol3Uniform = gl.getUniformLocation(shaderProgram, "uAffichCol3");
	shaderProgram.affichCol4Uniform = gl.getUniformLocation(shaderProgram, "uAffichCol4");
	shaderProgram.affichCol5Uniform = gl.getUniformLocation(shaderProgram, "uAffichCol5");

	shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
	
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
     	vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.texCoordsAttribute,
      	texCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

}


// =====================================================
function setMatrixUniforms() {
	if(shaderProgram != null) {
		gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
		gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
		gl.uniform1f(shaderProgram.yPosUniform, yPos);
		gl.uniform1f(shaderProgram.typeModeUniform, typeMode);
		gl.uniform1f(shaderProgram.transpUniform, transp);
		
		gl.uniform1f(shaderProgram.transfMinUniform, borneTransfMin);
		gl.uniform1f(shaderProgram.transfMaxUniform, borneTransfMax);

		gl.uniform1f(shaderProgram.borne1Uniform, borneCol1);
		gl.uniform1f(shaderProgram.borne2Uniform, borneCol2);
		gl.uniform1f(shaderProgram.borne3Uniform, borneCol3);
		gl.uniform1f(shaderProgram.borne4Uniform, borneCol4);

		gl.uniform1f(shaderProgram.affichCol1Uniform, affichCol1);
		gl.uniform1f(shaderProgram.affichCol2Uniform, affichCol2);
		gl.uniform1f(shaderProgram.affichCol3Uniform, affichCol3);
		gl.uniform1f(shaderProgram.affichCol4Uniform, affichCol4);
		gl.uniform1f(shaderProgram.affichCol5Uniform, affichCol5);
	}
}


// =====================================================
function drawScene() {
	gl.clear(gl.COLOR_BUFFER_BIT);

	if(shaderProgram != null) {

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

		mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
		mat4.identity(mvMatrix);
		mat4.translate(mvMatrix, [0.0, -0.3,-2.0]);
		mat4.multiply(mvMatrix, objMatrix);
		setMatrixUniforms();

		yPos = 0;

		//on affiche toutes les tranches entre les bornes min et max si affTranche = 0.0 et qu'une seul tranche si affTranche = 1.0
		if (affTranche==0.0) {
			for (i = trancheDown; i < trancheUp; i++) {
				//on commence l'affichage de l'objet de bas en haut en commencent à 0 avec un décallage de pas
				yPos = 0 + pas * i;

				setMatrixUniforms();
				//on choisi la bonne texture
				gl.bindTexture(gl.TEXTURE_2D, texture[i]);
				//on affiche la tranche
				gl.drawElements(gl.TRIANGLE_FAN, indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
			}
		}else{
			gl.bindTexture(gl.TEXTURE_2D, texture[choixTranche]);
			setMatrixUniforms();

			gl.drawElements(gl.TRIANGLE_FAN, indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

		}

	}
}
