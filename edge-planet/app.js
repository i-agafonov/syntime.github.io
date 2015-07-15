(function () {
    'use strict';

    var canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    window.gl = canvas.getContext('webgl', {antialias: false});

    var dWidth, dHeight;

    var resizeCanvas = function () {
        dWidth = parseFloat(document.body.clientWidth);
        dHeight = parseFloat(document.body.clientHeight);
        dWidth += dWidth & 1;
        dHeight += dHeight & 1;
        canvas.width = dWidth;
        canvas.height = dHeight;
        log('canvas size changed: %d x %d', dWidth, dHeight);
    };

    resizeCanvas();

    var frameRate = document.createElement('div');
    frameRate.setAttribute('style', 'position: fixed; bottom: 20px; left: 20px; color: #fff');
    document.body.appendChild(frameRate);

    var initShaders = function () {
        return glu.loadProgram('shaders/vshader.glsl', 'shaders/fshader.glsl').then(function (program) {
            window.pr = program;
            gl.useProgram(pr);
        });
    };

    var chunks = new Array(4);

    var initBuffers = function () {

        for (var i = 0, len = chunks.length; i < len; i++) {
            var chunk = chunks[i] = new Chunk();
            chunk.pos[0] = i % 2 - 1;
            chunk.pos[1] = (i + 1) % 2 - 1;
            chunk.fill(0, Chunk.size, 0, Chunk.size, 0, ~~(Math.random() * Chunk.size));
            chunk.update();
        }
    };

    var resizeView = function () {
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        updateProjectionMatrix();
    };

    var updateProjectionMatrix = function () {
        var dh = 1 / dHeight;
        var dw = 1 / dWidth;
        var b = (pxScreenSize * 2 * dh) / px;
        var a = dHeight * dw;
        gl.uniformMatrix3fv(pr['uPMat'].loc, false, new Float32Array([
            +a * b, +0.5 * b, +0.01,
            +a * b, -0.5 * b, -0.01,
            +0.000, +1.0 * b, +0.00,
        ]));
        gl.uniform3f(pr['uShift'].loc, 0.0, dh, 0.0);
    };

    window.pxScreenSize = 32;
    utils.watch(window, 'pxScreenSize', function () {
        log('pixel screen size set to %d', pxScreenSize);
        updateProjectionMatrix();
    });

    utils.onKeyDown('EQUAL', function () { window.pxScreenSize <<= 1; });
    utils.onKeyDown('MINUS', function () { window.pxScreenSize > 1 ? window.pxScreenSize >>= 1 : window.pxScreenSize = 1; });

    initShaders().then(function () {
        initBuffers();
        init();
        resizeView();
        addEventListener('resize', function () {
            resizeCanvas();
            resizeView();
        });
        requestAnimationFrame(draw);
    }, err);

    var invSqrt2 = 1 / Math.sqrt(2);
    var init = function () {
        gl.clearColor(0.0, 0.06, 0.1, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);

        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.FRONT);

        gl.enableVertexAttribArray(pr['aVertexPos'].loc);
        gl.vertexAttribPointer(pr['aVertexPos'].loc, 3, gl.FLOAT, false, 24, 0);
        gl.enableVertexAttribArray(pr['aVertexNormal'].loc);
        gl.vertexAttribPointer(pr['aVertexNormal'].loc, 3, gl.FLOAT, false, 24, 12);

        var angle = Math.PI - 0.1;
        gl.uniform3f(
            pr['uLight'].loc,
            Math.sin(angle) * invSqrt2,
            Math.cos(angle) * invSqrt2,
            invSqrt2
        );
    };

    var ot, dt;
    var frame = 1;
    var fRate = 0;

    var numColors = 9;
    var colors = new Float32Array(numColors * 3);

    var changeColors = function () {
        for (var i = 0; i < numColors * 3; i++) {
            colors[i] = Math.random();
        }
        colors.seed = ~~(Math.random() * 4294967296);
    };
    utils.onKeyDown('BACKSPACE', changeColors);

    changeColors();

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

        var colorIndex = 0;
        var rnd = colors.seed;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        for (var i = 0, len = chunks.length; i < len; i++) {
            rnd = (rnd * 1103515245 + 12345) % 4294967296;
            colorIndex = Math.abs(rnd) % numColors;
            gl.uniform3fv(pr['uColor'].loc, colors.subarray(colorIndex));

            chunks[i].draw();
        }
        ot = nt;
    };

})();