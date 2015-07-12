window.glu = {};

glu.createShader = function (str, type) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, str);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        var typeStr = 'Shader';
        if (type === gl.VERTEX_SHADER) {
            typeStr = 'Vertex shader';
        } else if (type === gl.FRAGMENT_SHADER) {
            typeStr = 'Fragment shader';
        }
        throw (typeStr + ' compilation error: ' + gl.getShaderInfoLog(shader));
    }
    return shader;
};

glu.createProgram = function (vSource, fSource) {
    var program = gl.createProgram();
    var vShader = glu.createShader(vSource, gl.VERTEX_SHADER);
    var fShader = glu.createShader(fSource, gl.FRAGMENT_SHADER);
    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw ('Shader linkage error: ' + gl.getProgramInfoLog(program));
    }
    return program;
};

glu.loadProgram = function (vFileName, fFileName) {

    return Promise.all([
        utils.loadFile(vFileName, true),
        utils.loadFile(fFileName, true)
    ]).then(function (sources) {
        var vStr = sources[0];
        var fStr = sources[1];
        var program = glu.createProgram(vStr, fStr);
        program.vSource = vStr;
        program.fSource = fStr;
        return program;
    }, err);

};