(function () {
    'use strict';

    window.Chunk = function () {
        this.voxels = new Uint16Array(Chunk.size3);
        this.virtexBuffer = gl.createBuffer();
        this.normalBuffer = gl.createBuffer();
        this.colorBuffer = gl.createBuffer();
        this.indexBuffer = gl.createBuffer();
        this.numVertices = 0;
        this.numIndices = 0;
        this.pos = new Float32Array(3);
    };

    Chunk.prototype = Object.create(null);

    Chunk.size = 16;
    Chunk.size2 = Chunk.size * Chunk.size;
    Chunk.size3 = Chunk.size2 * Chunk.size;

    window.px = 1 / Chunk.size;

    // maximum sized arrays
    var ver = new Float32Array(Chunk.size3 * 6 /*sides per cube*/ * 4 /*vertices per side*/ * 3 /*vertex xyz + normal xyz*/);
    var nor = new Float32Array(Chunk.size3 * 6 /*sides per cube*/ * 4 /*vertices per side*/ * 3 /*vertex xyz + normal xyz*/);
    var col = new Float32Array(Chunk.size3 * 6 /*sides per cube*/ * 4 /*vertices per side*/ * 3 /*vertex xyz + normal xyz*/);
    var ind = new Uint16Array(Chunk.size3 * 6 /*sides per cube*/ * 6 /*indices per side*/);

    Chunk.prototype.update = function (cxm, cxp, cym, cyp, czm, czp) {
        var s = Chunk.size;
        var ss = s * s;
        var s1 = s - 1;
        var ss1 = s1 * s;
        var sss1 = ss1 * s;
        var x, y, z, i;
        var px = window.px;
        var cnk = this.voxels;
        var vxm, vxp, vym, vyp, vzm, vzp; // voxels x minus, x plus, y minus ....
        var vp = 0, ip = 0, iv = 0; // vertex pointer, index pointer, index vertex
        var vvv = 0; // current voxel
        var x1, y1, z1;
        var cz = this.pos[2] + 8;
        for (z = 0, i = 0; z !== s; z++) {
            z1 = z + 1;
            for (y = 0; y !== s; y++) {
                y1 = y + 1;
                for (x = 0; x !== s; x++, i++) {
                    vvv = cnk[i];
                    if (vvv !== 0) {
                        x1 = x + 1;

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
                            ver[vp] = x * px;
                            ver[vp + 1] = y1 * px;
                            ver[vp + 2] = z * px;
                            // vertex 1
                            ver[vp + 3] = x * px;
                            ver[vp + 4] = y * px;
                            ver[vp + 5] = z * px;
                            // vertex 2
                            ver[vp + 6] = x * px;
                            ver[vp + 7] = y1 * px;
                            ver[vp + 8] = z1 * px;
                            // vertex 3
                            ver[vp + 9] = x * px;
                            ver[vp + 10] = y * px;
                            ver[vp + 11] = z1 * px;

                            // normal 0
                            nor[vp] = -1;
                            nor[vp + 1] = 0;
                            nor[vp + 2] = 0;
                            // normal 1
                            nor[vp + 3] = -1;
                            nor[vp + 4] = 0;
                            nor[vp + 5] = 0;
                            // normal 2
                            nor[vp + 6] = -1;
                            nor[vp + 7] = 0;
                            nor[vp + 8] = 0;
                            // normal 3
                            nor[vp + 9] = -1;
                            nor[vp + 10] = 0;
                            nor[vp + 11] = 0;

                            // color 0
                            col[vp] = (z+cz*s)/ss;
                            col[vp + 1] = 1-(z+cz*s)/ss;
                            col[vp + 2] = 0.5;
                            // color 1
                            col[vp + 3] = (z+cz*s)/ss;
                            col[vp + 4] = 1-(z+cz*s)/ss;
                            col[vp + 5] = 0.5;
                            // color 2
                            col[vp + 6] = (z+cz*s)/ss;
                            col[vp + 7] = 1-(z+cz*s)/ss;
                            col[vp + 8] = 0.5;
                            // color 3
                            col[vp + 9] = (z+cz*s)/ss;
                            col[vp + 10] = 1-(z+cz*s)/ss;
                            col[vp + 11] = 0.5;
                            vp += 12;

                            // indices
                            ind[ip] = iv;         // 0
                            ind[ip + 1] = iv + 1; // 1
                            ind[ip + 2] = iv + 2; // 2
                            ind[ip + 3] = iv + 2; // 2
                            ind[ip + 4] = iv + 1; // 1
                            ind[ip + 5] = iv + 3; // 3
                            iv += 4;
                            ip += 6;
                        }

                        if (vxp === 0) {
                            // vertex 0
                            ver[vp] = x1 * px;
                            ver[vp + 1] = y * px;
                            ver[vp + 2] = z * px;
                            // vertex 1
                            ver[vp + 3] = x1 * px;
                            ver[vp + 4] = y1 * px;
                            ver[vp + 5] = z * px;
                            // vertex 2
                            ver[vp + 6] = x1 * px;
                            ver[vp + 7] = y * px;
                            ver[vp + 8] = z1 * px;
                            // vertex 3
                            ver[vp + 9] = x1 * px;
                            ver[vp + 10] = y1 * px;
                            ver[vp + 11] = z1 * px;

                            // normal 0
                            nor[vp] = 1;
                            nor[vp + 1] = 0;
                            nor[vp + 2] = 0;
                            // normal 1
                            nor[vp + 3] = 1;
                            nor[vp + 4] = 0;
                            nor[vp + 5] = 0;
                            // normal 2
                            nor[vp + 6] = 1;
                            nor[vp + 7] = 0;
                            nor[vp + 8] = 0;
                            // normal 3
                            nor[vp + 9] = 1;
                            nor[vp + 10] = 0;
                            nor[vp + 11] = 0;

                            // color 0
                            col[vp] = (z+cz*s)/ss;
                            col[vp + 1] = 1-(z+cz*s)/ss;
                            col[vp + 2] = 0.5;
                            // color 1
                            col[vp + 3] = (z+cz*s)/ss;
                            col[vp + 4] = 1-(z+cz*s)/ss;
                            col[vp + 5] = 0.5;
                            // color 2
                            col[vp + 6] = (z+cz*s)/ss;
                            col[vp + 7] = 1-(z+cz*s)/ss;
                            col[vp + 8] = 0.5;
                            // color 3
                            col[vp + 9] = (z+cz*s)/ss;
                            col[vp + 10] = 1-(z+cz*s)/ss;
                            col[vp + 11] = 0.5;
                            vp += 12;

                            // indices
                            ind[ip] = iv;         // 0
                            ind[ip + 1] = iv + 1; // 1
                            ind[ip + 2] = iv + 2; // 2
                            ind[ip + 3] = iv + 2; // 2
                            ind[ip + 4] = iv + 1; // 1
                            ind[ip + 5] = iv + 3; // 3
                            iv += 4;
                            ip += 6;
                        }

                        if (vym === 0) {
                            // vertex 0
                            ver[vp] = x * px;
                            ver[vp + 1] = y * px;
                            ver[vp + 2] = z * px;
                            // vertex 1
                            ver[vp + 3] = x1 * px;
                            ver[vp + 4] = y * px;
                            ver[vp + 5] = z * px;
                            // vertex 2
                            ver[vp + 6] = x * px;
                            ver[vp + 7] = y * px;
                            ver[vp + 8] = z1 * px;
                            // vertex 3
                            ver[vp + 9] = x1 * px;
                            ver[vp + 10] = y * px;
                            ver[vp + 11] = z1 * px;

                            // normal 0
                            nor[vp] = 0;
                            nor[vp + 1] = -1;
                            nor[vp + 2] = 0;
                            // normal 1
                            nor[vp + 3] = 0;
                            nor[vp + 4] = -1;
                            nor[vp + 5] = 0;
                            // normal 2
                            nor[vp + 6] = 0;
                            nor[vp + 7] = -1;
                            nor[vp + 8] = 0;
                            // normal 3
                            nor[vp + 9] = 0;
                            nor[vp + 10] = -1;
                            nor[vp + 11] = 0;

                            // color 0
                            col[vp] = (z+cz*s)/ss;
                            col[vp + 1] = 1-(z+cz*s)/ss;
                            col[vp + 2] = 0.5;
                            // color 1
                            col[vp + 3] = (z+cz*s)/ss;
                            col[vp + 4] = 1-(z+cz*s)/ss;
                            col[vp + 5] = 0.5;
                            // color 2
                            col[vp + 6] = (z+cz*s)/ss;
                            col[vp + 7] = 1-(z+cz*s)/ss;
                            col[vp + 8] = 0.5;
                            // color 3
                            col[vp + 9] = (z+cz*s)/ss;
                            col[vp + 10] = 1-(z+cz*s)/ss;
                            col[vp + 11] = 0.5;
                            vp += 12;

                            // indices
                            ind[ip] = iv;         // 0
                            ind[ip + 1] = iv + 1; // 1
                            ind[ip + 2] = iv + 2; // 2
                            ind[ip + 3] = iv + 2; // 2
                            ind[ip + 4] = iv + 1; // 1
                            ind[ip + 5] = iv + 3; // 3
                            iv += 4;
                            ip += 6;
                        }

                        if (vyp === 0) {
                            // vertex 0
                            ver[vp] = x1 * px;
                            ver[vp + 1] = y1 * px;
                            ver[vp + 2] = z * px;
                            // vertex 1
                            ver[vp + 3] = x * px;
                            ver[vp + 4] = y1 * px;
                            ver[vp + 5] = z * px;
                            // vertex 2
                            ver[vp + 6] = x1 * px;
                            ver[vp + 7] = y1 * px;
                            ver[vp + 8] = z1 * px;
                            // vertex 3
                            ver[vp + 9] = x * px;
                            ver[vp + 10] = y1 * px;
                            ver[vp + 11] = z1 * px;

                            // normal 0
                            nor[vp] = 0;
                            nor[vp + 1] = 1;
                            nor[vp + 2] = 0;
                            // normal 1
                            nor[vp + 3] = 0;
                            nor[vp + 4] = 1;
                            nor[vp + 5] = 0;
                            // normal 2
                            nor[vp + 6] = 0;
                            nor[vp + 7] = 1;
                            nor[vp + 8] = 0;
                            // normal 3
                            nor[vp + 9] = 0;
                            nor[vp + 10] = 1;
                            nor[vp + 11] = 0;

                            // color 0
                            col[vp] = (z+cz*s)/ss;
                            col[vp + 1] = 1-(z+cz*s)/ss;
                            col[vp + 2] = 0.5;
                            // color 1
                            col[vp + 3] = (z+cz*s)/ss;
                            col[vp + 4] = 1-(z+cz*s)/ss;
                            col[vp + 5] = 0.5;
                            // color 2
                            col[vp + 6] = (z+cz*s)/ss;
                            col[vp + 7] = 1-(z+cz*s)/ss;
                            col[vp + 8] = 0.5;
                            // color 3
                            col[vp + 9] = (z+cz*s)/ss;
                            col[vp + 10] = 1-(z+cz*s)/ss;
                            col[vp + 11] = 0.5;
                            vp += 12;

                            // indices
                            ind[ip] = iv;         // 0
                            ind[ip + 1] = iv + 1; // 1
                            ind[ip + 2] = iv + 2; // 2
                            ind[ip + 3] = iv + 2; // 2
                            ind[ip + 4] = iv + 1; // 1
                            ind[ip + 5] = iv + 3; // 3
                            iv += 4;
                            ip += 6;
                        }

                        if (vzm === 0) {
                            // vertex 0
                            ver[vp] = x * px;
                            ver[vp + 1] = y1 * px;
                            ver[vp + 2] = z * px;
                            // vertex 1
                            ver[vp + 3] = x1 * px;
                            ver[vp + 4] = y1 * px;
                            ver[vp + 5] = z * px;
                            // vertex 2
                            ver[vp + 6] = x * px;
                            ver[vp + 7] = y * px;
                            ver[vp + 8] = z * px;
                            // vertex 3
                            ver[vp + 9] = x1 * px;
                            ver[vp + 10] = y * px;
                            ver[vp + 11] = z * px;

                            // normal 0
                            nor[vp] = 0;
                            nor[vp + 1] = 0;
                            nor[vp + 2] = -1;
                            // normal 1
                            nor[vp + 3] = 0;
                            nor[vp + 4] = 0;
                            nor[vp + 5] = -1;
                            // normal 2
                            nor[vp + 6] = 0;
                            nor[vp + 7] = 0;
                            nor[vp + 8] = -1;
                            // normal 3
                            nor[vp + 9] = 0;
                            nor[vp + 10] = 0;
                            nor[vp + 11] = -1;

                            // color 0
                            col[vp] = (z+cz*s)/ss;
                            col[vp + 1] = 1-(z+cz*s)/ss;
                            col[vp + 2] = 0.5;
                            // color 1
                            col[vp + 3] = (z+cz*s)/ss;
                            col[vp + 4] = 1-(z+cz*s)/ss;
                            col[vp + 5] = 0.5;
                            // color 2
                            col[vp + 6] = (z+cz*s)/ss;
                            col[vp + 7] = 1-(z+cz*s)/ss;
                            col[vp + 8] = 0.5;
                            // color 3
                            col[vp + 9] = (z+cz*s)/ss;
                            col[vp + 10] = 1-(z+cz*s)/ss;
                            col[vp + 11] = 0.5;
                            vp += 12;

                            // indices
                            ind[ip] = iv;         // 0
                            ind[ip + 1] = iv + 1; // 1
                            ind[ip + 2] = iv + 2; // 2
                            ind[ip + 3] = iv + 2; // 2
                            ind[ip + 4] = iv + 1; // 1
                            ind[ip + 5] = iv + 3; // 3
                            iv += 4;
                            ip += 6;
                        }

                        if (vzp === 0) {
                            // vertex 0
                            ver[vp] = x * px;
                            ver[vp + 1] = y * px;
                            ver[vp + 2] = z1 * px;
                            // vertex 1
                            ver[vp + 3] = x1 * px;
                            ver[vp + 4] = y * px;
                            ver[vp + 5] = z1 * px;
                            // vertex 2
                            ver[vp + 6] = x * px;
                            ver[vp + 7] = y1 * px;
                            ver[vp + 8] = z1 * px;
                            // vertex 3
                            ver[vp + 9] = x1 * px;
                            ver[vp + 10] = y1 * px;
                            ver[vp + 11] = z1 * px;

                            // normal 0
                            nor[vp] = 0;
                            nor[vp + 1] = 0;
                            nor[vp + 2] = 1;
                            // normal 1
                            nor[vp + 3] = 0;
                            nor[vp + 4] = 0;
                            nor[vp + 5] = 1;
                            // normal 2
                            nor[vp + 6] = 0;
                            nor[vp + 7] = 0;
                            nor[vp + 8] = 1;
                            // normal 3
                            nor[vp + 9] = 0;
                            nor[vp + 10] = 0;
                            nor[vp + 11] = 1;

                            // color 0
                            col[vp] = (z+cz*s)/ss;
                            col[vp + 1] = 1-(z+cz*s)/ss;
                            col[vp + 2] = 0.5;
                            // color 1
                            col[vp + 3] = (z+cz*s)/ss;
                            col[vp + 4] = 1-(z+cz*s)/ss;
                            col[vp + 5] = 0.5;
                            // color 2
                            col[vp + 6] = (z+cz*s)/ss;
                            col[vp + 7] = 1-(z+cz*s)/ss;
                            col[vp + 8] = 0.5;
                            // color 3
                            col[vp + 9] = (z+cz*s)/ss;
                            col[vp + 10] = 1-(z+cz*s)/ss;
                            col[vp + 11] = 0.5;
                            vp += 12;

                            // indices
                            ind[ip] = iv;         // 0
                            ind[ip + 1] = iv + 1; // 1
                            ind[ip + 2] = iv + 2; // 2
                            ind[ip + 3] = iv + 2; // 2
                            ind[ip + 4] = iv + 1; // 1
                            ind[ip + 5] = iv + 3; // 3
                            iv += 4;
                            ip += 6;
                        }

                    }
                }
            }
        }

        this.numVertices = vp;
        this.numIndices = ip;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.virtexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, ver.subarray(0, this.numVertices), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, nor.subarray(0, this.numVertices), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, col.subarray(0, this.numVertices), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, ind.subarray(0, this.numIndices), gl.STATIC_DRAW);
    };

    Chunk.prototype.draw = function () {
        gl.uniform3fv(pr['uPos'].loc, this.pos);


        gl.bindBuffer(gl.ARRAY_BUFFER, this.virtexBuffer);
        gl.enableVertexAttribArray(pr['aVertexPos'].loc);
        gl.vertexAttribPointer(pr['aVertexPos'].loc, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.enableVertexAttribArray(pr['aVertexNormal'].loc);
        gl.vertexAttribPointer(pr['aVertexNormal'].loc, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.enableVertexAttribArray(pr['aVertexColor'].loc);
        gl.vertexAttribPointer(pr['aVertexColor'].loc, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        gl.drawElements(gl.TRIANGLES, this.numIndices, gl.UNSIGNED_SHORT, 0);
        //gl.disable(gl.DEPTH_TEST);
        //gl.drawElements(gl.LINES, this.numIndices, gl.UNSIGNED_SHORT, 0);
        //gl.enable(gl.DEPTH_TEST);
    };

    Chunk.prototype.fill = function (xmin, xmax, ymin, ymax, zmin, zmax) {
        var s = Chunk.size;
        var ss = s * s;
        for (var z = zmin; z < zmax; z++) {
            for (var y = ymin; y < ymax; y++) {
                for (var x = xmin; x < xmax; x++) {
                    this.voxels[z * ss + y * s + x] = 1;
                }
            }
        }
    };

    Chunk.prototype.fillZ = function (x, y, zmin, zmax) {
        var s = Chunk.size;
        var ss = s * s;
        var add = y * s + x;
        for (var z = zmin; z < zmax; z++) {
            this.voxels[z * ss + add] = 1;
        }
    };

})();