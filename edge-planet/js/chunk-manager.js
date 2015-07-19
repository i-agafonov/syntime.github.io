(function () {
    'use strict';

    utils.onKeyDown('BACKSPACE', function () {
        chunkManager.initChunks();
    });

    var r = 16;
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

            czm = this.fullChunk.voxels;
            czp = this.emptyChunk.voxels;
            var x, y, i;
            var px, py, pi;

            var chunk;

            for (y = 0, i = 0; y < r; y++) {
                for (x = 0; x < r; x++, i++) {

                    chunk = this.chunks[i] = new Chunk();

                    chunk.pos[0] = x - r_2;
                    chunk.pos[1] = y - r_2;
                    chunk.pos[2] = 0;

                    //chunk.fill(0, Chunk.size, 0, Chunk.size, 0, Chunk.size);
                }
            }

            var h;
            var img = window.clouds;
            for (y = 0, i = 0; y < r; y++) {
                for (x = 0; x < r; x++, i++) {
                    chunk = this.chunks[i];
                    for (py = 0; py < r; py++) {
                        for (px = 0; px < r; px++) {
                            h = Math.ceil(img.data[((px + x * 16) + (py + y * 16) * 16) * 4] / r);
                            chunk.fillZ(x + px, y + py, 0, h);
                        }
                    }
                }
            }

            for (y = 0, i = 0; y < r; y++) {
                for (x = 0; x < r; x++, i++) {
                    chunk = this.chunks[i];

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
        };

        this.draw = function () {
            for (var i = 0, len = this.chunks.length; i < len; i++) {
                this.chunks[i].draw();
                //gl.uniform3fv(pr['uColor'].loc, this.color);
                //gl.uniform3fv(pr['uPos'].pos, c.pos);
            }
        }

    };

})();