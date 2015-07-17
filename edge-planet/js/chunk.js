(function () {
    'use strict';

    window.Chunk = function () {
        this.voxels = new Uint16Array(Chunk.size3);
        this.virtexBuffer = gl.createBuffer();
        this.virtexBuffer = gl.createBuffer();
        this.indexBuffer = gl.createBuffer();
        this.numIndices = 0;
        this.pos = new Float32Array(3);
    };

    Chunk.prototype = Object.create(null);

    Chunk.size = 16;
    Chunk.size2 = Chunk.size * Chunk.size;
    Chunk.size3 = Chunk.size2 * Chunk.size;

    window.px = 1 / Chunk.size;

    // maximum sized arrays
    var ver = new Float32Array(Chunk.size3 * 6 /*sides per cube*/ * 4 /*vertices per side*/ * 6 /*vertex xyz + normal xyz*/);
    var ind = new Uint16Array(Chunk.size3 * 6 /*sides per cube*/ * 6 /*indices per side*/);

    Chunk.prototype.update = function (cxm, cxp, cym, cyp, czm, czp) {
        var s = Chunk.size;
        var ss = s * s;
        var s1 = s - 1;
        var ss1 = s1 * s;
        var sss1 = ss1 * s;
        var i = 0;
        var px = window.px;
        var cnk = this.voxels;
        var vxm, vxp, vym, vyp, vzm, vzp; // voxels x minus, x plus, y minus ....
        var vp = 0, ip = 0, iv = 0; // vertex pointer, index pointer, index vertex
        var vvv = 0; // current voxel
        for (var z = 0; z !== s; z++) {

            for (var y = 0; y !== s; y++) {

                for (var x = 0; x !== s; x++, i++) {
                    vvv = cnk[i];
                    if (vvv !== 0) {

                        if (z !== 0 && z !== s1) {
                            vzm = cnk[i - ss];
                            vzp = cnk[i + ss];
                        } else if (z === 0) {
                            vzm = czm[i + sss1];
                            vzp = cnk[i + ss];
                        } else {
                            vzm = cnk[i - ss];
                            vzp = czp[i - sss1];
                        }

                        if (y !== 0 && y !== s1) {
                            vym = cnk[i - s];
                            vyp = cnk[i + s];
                        } else if (y === 0) {
                            vym = cym[i + ss1];
                            vyp = cnk[i + s];
                        } else {
                            vym = cnk[i - s];
                            vyp = cyp[i - ss1];
                        }

                        if (x !== 0 && x !== s1) {
                            vxm = cnk[i - 1];
                            vxp = cnk[i + 1];
                        } else if (x === 0) {
                            vxm = cxm[i + s1];
                            vxp = cnk[i + 1];
                        } else {
                            vxm = cnk[i - 1];
                            vxp = cxp[i - s1];
                        }

                        if (vxm === 0) {
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
        }

        gl.vertexAttribPointer(pr['aVertexPos'].loc, 3, gl.FLOAT, false, 24, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.virtexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, ver, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, ind, gl.STATIC_DRAW);
    };

    Chunk.prototype.draw = function () {
        gl.uniform3fv(pr['uPos'].loc, this.pos);
        gl.drawElements(gl.TRIANGLES, this.numIndices, gl.UNSIGNED_SHORT, 0);
    };

    Chunk.prototype.fill = function (xmin, xmax, ymin, ymax, zmin, zmax) {
        var s = Chunk.size;
        var i = 0;
        for (var x = xmin; x < xmax; x++) {
            for (var y = ymin; y < ymax; y++) {
                for (var z = zmin; z < zmax; z++, i++) {
                    this.voxels[i] = 1;
                }
            }
        }
    };

})();