function Chunk () {
    this.voxels = new Uint16Array(Chunk.fullSize);
    this.virtexBuffer = gl.createBuffer();
    this.indexBuffer = gl.createBuffer();
    this.numIndices = 0;
    this.pos = new Float32Array(3);
}

Chunk.prototype = Object.create(null);

Chunk.size = 16;
Chunk.size2 = Chunk.size * Chunk.size;
Chunk.size3 = Chunk.size * Chunk.size * Chunk.size;
window.px = 1 / Chunk.size;

Chunk.prototype.update = function () {
    var s = Chunk.size;
    var i = 0;
    var ver = new Float32Array(Chunk.size3);
    var ind = new Uint16Array(Chunk.size2);
    var px = window.px;
    for (var z = 0; z < s; z++) {
        for (var y = 0; y < s; y++) {
            for (var x = 0; x < s; x++, i++) {
                if (this.voxels[i]) {
                    ver[i] = px; ver[i+1] = px; ver[i+2] = px;
                    ind[i] = px; ind[i+1] = px; ind[i+2] = px;
                    this.numIndices++;
                }
            }
        }
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, this.virtexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new ver, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new ind, gl.STATIC_DRAW);
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