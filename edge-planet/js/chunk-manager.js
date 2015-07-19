(function () {
    'use strict';

    utils.onKeyDown('BACKSPACE', function () {
        chunkManager.initChunks();
    });

    var r = 16;
    var rr = r * r;
    var rrr = rr * r;
    var r_2 = Math.ceil(r / 2);
    var r1 = r - 1;
    var rr1 = r1 * r;

    window.ChunkManager = function () {

        this.chunks = new Array(r * r);
        this.emptyChunk = new Chunk();
        this.fullChunk = new Chunk();
        this.fullChunk.fill(0, Chunk.size, 0, Chunk.size, 0, Chunk.size, 0, Chunk.size);

        this.initChunks = function () {
            var cxm, cxp, cym, cyp, czm, czp;
            var x, y, z, i;
            var X, Y;

            var chunk;

            for (z = 0, i = 0; z < r; z++) {
                for (y = 0; y < r; y++) {
                    for (x = 0; x < r; x++, i++) {

                        chunk = this.chunks[i] = new Chunk();

                        chunk.pos[0] = x - r_2;
                        chunk.pos[1] = y - r_2;
                        chunk.pos[2] = z - r_2;

                        //chunk.fill(0, Chunk.size, 0, Chunk.size, 0, Chunk.size);
                    }
                }
            }

            var h, zr;
            var img = window.clouds;
            for (z = 0, i = 0; z < r; z++) {
                zr = z * r;
                for (y = 0; y < r; y++) {
                    for (x = 0; x < r; x++, i++) {
                        chunk = this.chunks[i];
                        for (Y = 0; Y < r; Y++) {
                            for (X = 0; X < r; X++) {
                                h = Math.ceil(img.data[(rrr * y + rr * Y + r * x + X) * 4]);
                                if (h >= zr) {
                                    chunk.fillZ(X, Y, 0, r);
                                } else if (h >= zr - r && h < zr) {
                                    chunk.fillZ(X, Y, 0, h - (zr - r));
                                }
                            }
                        }
                    }
                }
            }

            for (z = 0, i = 0; z < r; z++) {
                for (y = 0; y < r; y++) {
                    for (x = 0; x < r; x++, i++) {
                        chunk = this.chunks[i];

                        if (z !== 0 && z !== r1) {
                            czm = this.chunks[i - rr].voxels;
                            czp = this.chunks[i + rr].voxels;
                        } else if (z === 0) {
                            czm = this.fullChunk.voxels;
                            czp = this.chunks[i + rr].voxels;
                        } else {
                            czm = this.chunks[i - rr].voxels;
                            czp = this.fullChunk.voxels;
                        }

                        if (y !== 0 && y !== r1) {
                            cym = this.chunks[i - r].voxels;
                            cyp = this.chunks[i + r].voxels;
                        } else if (y == 0) {
                            cym = this.fullChunk.voxels;
                            cyp = this.chunks[i + r].voxels;
                        } else {
                            cym = this.chunks[i - r].voxels;
                            cyp = this.fullChunk.voxels;
                        }

                        if (x !== 0 && x !== r1) {
                            cxm = this.chunks[i - 1].voxels;
                            cxp = this.chunks[i + 1].voxels;
                        } else if (x === 0) {
                            cxm = this.fullChunk.voxels;
                            cxp = this.chunks[i + 1].voxels;
                        } else {
                            cxm = this.chunks[i - 1].voxels;
                            cxp = this.fullChunk.voxels;
                        }

                        chunk.update(cxm, cxp, cym, cyp, czm, czp);
                    }
                }
            }
        };

        this.draw = function () {
            for (var i = 0, len = this.chunks.length; i < len; i++) {
                if (this.chunks[i].numIndices !== 0) {
                    this.chunks[i].draw();
                }
            }
        }

    };

})();