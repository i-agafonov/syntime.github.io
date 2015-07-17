(function () {
    'use strict';

    window.Cube = function (size) {
        size *= 0.5;

        // cube ///////////////////////////////////////////////////////////////////////
        //    v6------v5
        //   /|      /|
        //  v1------v0|
        //  | |     | |
        //  | |v7---|-|v4
        //  |/      |/
        //  v2------v3

        this.vertices = [
            -size, -size, +size, +0, +0, +1,
            +size, -size, +size, +0, +0, +1,
            -size, +size, +size, +0, +0, +1,
            +size, +size, +size, +0, +0, +1,
            -size, +size, +size, +0, +1, +0,
            +size, +size, +size, +0, +1, +0,
            -size, +size, -size, +0, +1, +0,
            +size, +size, -size, +0, +1, +0,
            -size, +size, -size, +0, +0, -1,
            +size, +size, -size, +0, +0, -1,
            -size, -size, -size, +0, +0, -1,
            +size, -size, -size, +0, +0, -1,
            -size, -size, -size, +0, -1, +0,
            +size, -size, -size, +0, -1, +0,
            -size, -size, +size, +0, -1, +0,
            +size, -size, +size, +0, -1, +0,
            +size, -size, +size, +1, +0, +0,
            +size, -size, -size, +1, +0, +0,
            +size, +size, +size, +1, +0, +0,
            +size, +size, -size, +1, +0, +0,
            -size, -size, -size, -1, +0, +0,
            -size, -size, +size, -1, +0, +0,
            -size, +size, -size, -1, +0, +0,
            -size, +size, +size, -1, +0, +0,
        ];

        this.indices = [0, 1, 2, 2, 1, 3, 4, 5, 6, 6, 5, 7, 8, 9, 10, 10, 9, 11, 12, 13, 14, 14, 13, 15, 16, 17, 18, 18, 17, 19, 20, 21, 22, 22, 21, 23];
    };

})();