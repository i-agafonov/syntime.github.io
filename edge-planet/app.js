(function () {
    'use strict';

    var canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    window.gl = canvas.getContext('webgl', {antialias: false});

    var dWidth, dHeight;

    var resizeCanvas = function () {
        dWidth = parseFloat(document.body.clientWidth);
        dHeight = parseFloat(document.body.clientHeight);
        canvas.width = dWidth;
        canvas.height = dHeight;
    };

    resizeCanvas();

    var frameRate = document.createElement('div');
    frameRate.setAttribute('style', 'position: fixed; bottom: 50px; left: 20px; color: #fff');
    document.body.appendChild(frameRate);

    var cube;

    var pr;
    var initShaders = function () {
        return glu.loadProgram('shaders/vshader.glsl', 'shaders/fshader.glsl').then(function (program) {
            pr = program;
            gl.useProgram(pr);

            pr.aVertexPos = gl.getAttribLocation(pr, "aVertexPos");
            pr.aVertexNormal = gl.getAttribLocation(pr, "aVertexNormal");
            pr.uPMat = gl.getUniformLocation(pr, "uPMat");
            pr.uColor = gl.getUniformLocation(pr, "uColor");
            pr.uLight = gl.getUniformLocation(pr, "uLight");
            pr.uPos = gl.getUniformLocation(pr, "uPos");
        });
    };

    var pxScreenSize = 4;
    var px = 1 / pxScreenSize;

    var Cube = function (size) {

        // cube ///////////////////////////////////////////////////////////////////////
        //    v6------v5
        //   /|      /|
        //  v1------v0|
        //  | |     | |
        //  | |v7---|-|v4
        //  |/      |/
        //  v2------v3

        var i;
        this.vertices = [
            -1, -1, +1, +0, +0, +1,
            +1, -1, +1, +0, +0, +1,
            -1, +1, +1, +0, +0, +1,
            +1, +1, +1, +0, +0, +1,
            -1, +1, +1, +0, +1, +0,
            +1, +1, +1, +0, +1, +0,
            -1, +1, -1, +0, +1, +0,
            +1, +1, -1, +0, +1, +0,
            -1, +1, -1, +0, +0, -1,
            +1, +1, -1, +0, +0, -1,
            -1, -1, -1, +0, +0, -1,
            +1, -1, -1, +0, +0, -1,
            -1, -1, -1, +0, -1, +0,
            +1, -1, -1, +0, -1, +0,
            -1, -1, +1, +0, -1, +0,
            +1, -1, +1, +0, -1, +0,
            +1, -1, +1, +1, +0, +0,
            +1, -1, -1, +1, +0, +0,
            +1, +1, +1, +1, +0, +0,
            +1, +1, -1, +1, +0, +0,
            -1, -1, -1, -1, +0, +0,
            -1, -1, +1, -1, +0, +0,
            -1, +1, -1, -1, +0, +0,
            -1, +1, +1, -1, +0, +0,
        ];
        this.indices = [0, 1, 2, 2, 1, 3, 4, 5, 6, 6, 5, 7, 8, 9, 10, 10, 9, 11, 12, 13, 14, 14, 13, 15, 16, 17, 18, 18, 17, 19, 20, 21, 22, 22, 21, 23];

        var len = this.vertices.length;
        size *= 0.5;
        for (i = 0; i < len; i++) {
            if (i % 6 < 3) {
                this.vertices[i] *= size;
            }
        }
    };

    var initBuffers = function () {

        cube = new Cube(px);

        cube.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cube.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cube.vertices), gl.STATIC_DRAW);

        cube.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cube.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(cube.indices), gl.STATIC_DRAW);
    };

    var resizeView = function () {
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

        var b = (pxScreenSize * 2) / (dHeight * px);
        var a = dHeight / dWidth;
        gl.uniformMatrix3fv(pr.uPMat, false, new Float32Array([
            +a * b, +0.5 * b, +1.0,
            +a * b, -0.5 * b, -1.0,
            +0.000, +1.0 * b, +0.0,
        ]));
    };

    var resize = function () {
        resizeCanvas();
        resizeView();
    };

    initBuffers();
    initShaders().then(function () {
        init();
        resizeView();
        addEventListener('resize', resize);
        addEventListener('keydown', onKeyEvent);
        addEventListener('keyup', onKeyEvent);
        requestAnimationFrame(draw);
    }, err);

    var invSqrt2 = 1 / Math.sqrt(2);
    var init = function () {
        gl.clearColor(0.0, 0.06, 0.1, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);

        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.FRONT);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cube.indexBuffer);

        gl.bindBuffer(gl.ARRAY_BUFFER, cube.vertexBuffer);

        gl.enableVertexAttribArray(pr.aVertexPos);
        gl.vertexAttribPointer(pr.aVertexPos, 3, gl.FLOAT, false, 24, 0);
        gl.enableVertexAttribArray(pr.aVertexNormal);
        gl.vertexAttribPointer(pr.aVertexNormal, 3, gl.FLOAT, false, 24, 12);

        var angle = Math.PI - 0.1;
        gl.uniform3f(
            pr.uLight,
            Math.sin(angle) * invSqrt2,
            Math.cos(angle) * invSqrt2,
            invSqrt2
        );
    };

    var keys = {};
    var keyListeners = {};
    var onKeyEvent = function (e) {
        var keydown = e.type === 'keydown', fn;
        keys[e.keyCode] = keydown;
        if (keydown && (fn = keyListeners[e.keyCode])) {
            fn();
        }
    };
    var onKeyDown = function (keyLabel, callback) {
        keyListeners[utils.keysCodes[keyLabel]] = callback;
    };

    var ot, dt;
    var frame = 1;
    var fRate = 0;

    var numColors = 7;
    var colors = new Float32Array(numColors * 3);

    var changeColors = function () {
        for (var i = 0; i < numColors * 3; i++) {
            colors[i] = Math.random();
        }
        colors.seed = Math.floor(Math.random() * 4294967296);
    };
    onKeyDown('BACKSPACE', changeColors);

    changeColors();

    var o = {};
    utils.watch(o, 'sqr', function (v) {
        o.num = v * v;
    });
    o.sqr = 11;
    o.h = 0;

    onKeyDown('LEFT_BRACKET', function () { o.sqr -= 2; });
    onKeyDown('RIGHT_BRACKET', function () { o.sqr += 2; });

    onKeyDown('PAGE_UP', function () { o.h += 1; });
    onKeyDown('PAGE_DOWN', function () { o.h -= 1; });

    var draw = function (nt) {
        if (!ot) {
            ot = nt;
            requestAnimationFrame(draw);
            return;
        }
        dt = nt - ot;
        frame++;
        frame = frame % 11;
        if (frame) {
            fRate += 1000 / dt;
        } else {
            frameRate.innerHTML = (fRate / 10).toFixed(1);
            fRate = 0;
        }

        requestAnimationFrame(draw);

        var shift = Math.floor(o.sqr / 2);
        var colorIndex = 0;
        var rnd = colors.seed;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        for (var i = 0; i < o.sqr; i++) {
            for (var j = 0; j < o.sqr; j++) {
                rnd = (rnd * 1103515245 + 12345) % 4294967296;
                colorIndex = rnd % numColors;
                gl.uniform3fv(pr.uColor, colors.subarray(colorIndex, colorIndex + 3));
                gl.uniform3f(
                    pr.uPos,
                    Math.floor(i - shift) * px,
                    Math.floor(j - shift) * px,
                    o.h * px
                );
                gl.drawElements(gl.TRIANGLES, cube.indices.length, gl.UNSIGNED_BYTE, 0);
            }
        }
        ot = nt;
    };

})();