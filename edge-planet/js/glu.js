(function () {
    'use strict';

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

        glu.getProgramLocations(program);

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

    glu.getProgramLocations = function (program) {

        program.activeUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
        program.activeAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);

        var i;
        for (i = 0; i < program.activeUniforms; i++) {
            var uniform = gl.getActiveUniform(program, i);
            uniform.index = i;
            uniform.loc = gl.getUniformLocation(program, uniform.name);
            program[uniform.name] = uniform;
        }

        for (i = 0; i < program.activeAttributes; i++) {
            var attribute = gl.getActiveAttrib(program, i);
            attribute.index = i;
            attribute.loc = gl.getAttribLocation(program, attribute.name);
            program[attribute.name] = attribute;
        }

    };

})();