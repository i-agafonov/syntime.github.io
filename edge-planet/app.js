(function () {
    'use strict';

    utils.onKeyDown('F2', function () {
        var count = 10000;
        var s = 16;
        var s1 = s - 1;
        var x, y, z, i, iter;
        var vp, ip, iv;
        var ver, ind;

        //==============================================================================================================
        var t1s = window.performance.now();
        ver = new Float32Array(Chunk.size3 * 6 /*sides per cube*/ * 4 /*vertices per side*/ * 6 /*vertex xyz + normal xyz*/);
        ind = new Uint16Array(Chunk.size3 * 6 /*sides per cube*/ * 6 /*indices per side*/);
        vp = 0;
        ip = 0;
        iv = 0;
        for (iter = 0; iter < count; iter++) {
            for (z = 0, i = 0; z !== s; z++) {
                for (y = 0; y !== s; y++) {
                    for (x = 0; x !== s; x++, i++) {
                        // vertex 0
                        ver[vp] = x * px;
                        ver[vp + 1] = (y + 1) * px;
                        ver[vp + 2] = z * px;

                        // normal 0
                        ver[vp + 3] = -1;
                        ver[vp + 4] = 0;
                        ver[vp + 5] = 0;

                        // vertex 1
                        ver[vp + 6] = x * px;
                        ver[vp + 7] = y * px;
                        ver[vp + 8] = z * px;

                        // normal 1
                        ver[vp + 9] = -1;
                        ver[vp + 10] = 0;
                        ver[vp + 11] = 0;

                        // vertex 2
                        ver[vp + 12] = x * px;
                        ver[vp + 13] = (y + 1) * px;
                        ver[vp + 14] = (z + 1) * px;

                        // normal 2
                        ver[vp + 15] = -1;
                        ver[vp + 16] = 0;
                        ver[vp + 17] = 0;

                        // vertex 3
                        ver[vp + 18] = x * px;
                        ver[vp + 19] = y * px;
                        ver[vp + 20] = (z + 1) * px;

                        // normal 3
                        ver[vp + 21] = -1;
                        ver[vp + 22] = 0;
                        ver[vp + 23] = 0;
                        vp += 24;

                        // indices
                        ind[ip] = iv; // 0
                        ind[ip + 1] = iv + 1; // 1
                        ind[ip + 2] = iv + 2;   // 2
                        ind[ip + 3] = iv + 2; // 2
                        ind[ip + 4] = iv + 1;   // 1
                        ind[ip + 5] = iv + 3; // 3
                        iv += 4;
                        ip += 6;
                    }
                }
            }
        }
        var t1f = window.performance.now();
        //==============================================================================================================

        //==============================================================================================================
        var t2s = window.performance.now();
        ver = new Float32Array(Chunk.size3 * 6 /*sides per cube*/ * 4 /*vertices per side*/ * 6 /*vertex xyz + normal xyz*/);
        ind = new Uint16Array(Chunk.size3 * 6 /*sides per cube*/ * 6 /*indices per side*/);
        vp = 0;
        ip = 0;
        iv = 0;
        for (iter = 0; iter < count; iter++) {
            for (z = 0, i = 0; z !== s; z++) {
                for (y = 0; y !== s; y++) {
                    for (x = 0; x !== s; x++, i++) {
                        // vertex 0
                        ver[vp++] = x * px;
                        ver[vp++] = (y + 1) * px;
                        ver[vp++] = z * px;

                        // normal 0
                        ver[vp++] = -1;
                        ver[vp++] = 0;
                        ver[vp++] = 0;

                        // vertex 1
                        ver[vp++] = x * px;
                        ver[vp++] = y * px;
                        ver[vp++] = z * px;

                        // normal 1
                        ver[vp++] = -1;
                        ver[vp++] = 0;
                        ver[vp++] = 0;

                        // vertex 2
                        ver[vp++] = x * px;
                        ver[vp++] = (y + 1) * px;
                        ver[vp++] = (z + 1) * px;

                        // normal 2
                        ver[vp++] = -1;
                        ver[vp++] = 0;
                        ver[vp++] = 0;

                        // vertex 3
                        ver[vp++] = x * px;
                        ver[vp++] = y * px;
                        ver[vp++] = (z + 1) * px;

                        // normal 3
                        ver[vp++] = -1;
                        ver[vp++] = 0;
                        ver[vp++] = 0;

                        // indices
                        ind[ip++] = iv++; // 0
                        ind[ip++] = iv++; // 1
                        ind[ip++] = iv;   // 2
                        ind[ip++] = iv--; // 2
                        ind[ip++] = iv;   // 1
                        iv += 2;
                        ind[ip++] = iv++; // 3
                    }
                }
            }
        }
        var t2f = window.performance.now();
        //==============================================================================================================

        log('1: ' + ((t1f - t1s)).toFixed(4));
        log('2: ' + ((t2f - t2s)).toFixed(4));
    });

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
        //log('canvas size changed: %d x %d', dWidth, dHeight);
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

    window.chunkManager = new ChunkManager();
    var initBuffers = function () {
        chunkManager.initChunks();
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

    function loadData() {
        var clouds = new Image();
        return new Promise(function (resolve) {
            clouds.onload = function () {
                var canvas = document.createElement('canvas');
                var context = canvas.getContext('2d');
                context.drawImage(clouds, 0, 0);
                window.clouds = context.getImageData(0, 0, clouds.width, clouds.height);
                canvas.remove();
                resolve();
            };
            clouds.src = 'img/clouds.png';
        });
    }

    loadData().then(function () {
        initShaders().then(function () {
            initBuffers();
            init();
            resizeView();
            addEventListener('resize', function () {
                resizeCanvas();
                resizeView();
            });
            requestAnimationFrame(draw);
        });
    }, err);

    var invSqrt2 = 1 / Math.sqrt(2);
    var init = function () {
        gl.clearColor(0.0, 0.06, 0.1, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);

        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.FRONT);

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

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        chunkManager.draw();
        ot = nt;
    };

})();