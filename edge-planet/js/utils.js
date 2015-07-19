window.log = console.log.bind(console);
window.err = console.error.bind(console);

window.utils = {};

utils.loadFile = function (fileName, noCache) {

    return new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState == 1) {
                request.send();
            } else if (request.readyState == 4) {
                if (request.status == 200) {
                    resolve(request.responseText);
                } else if (request.status == 404) {
                    reject('File "' + fileName + '" does not exist.');
                } else {
                    reject('XHR error ' + request.status + '.');
                }
            }
        };
        var url = fileName;
        if (noCache) {
            url += '?' + (new Date()).getTime();
        }
        request.open('GET', url, true);
    });

};

utils.watch = function (object, key, callback) {
    var _key = ('_').concat(key);
    Object.defineProperty(object, _key, {
        writable: true,
        configurable: true,
        value: object[key]
    });
    Object.defineProperty(object, key, {
        set: function (v) {
            var old = object[_key];
            if (v !== old) {
                object[_key] = v;
                callback(v, old);
            }
        },
        get: function () {
            return object[_key];
        },
        enumerable: true,
        configurable: true,
    });
};

utils.keysCodes = {
    SPACE: 32,
    APOSTROPHE: 222,
    COMMA: 188,
    MINUS: 189,
    PERIOD: 190,
    SLASH: 191,
    0: 48,
    1: 49,
    2: 50,
    3: 51,
    4: 52,
    5: 53,
    6: 54,
    7: 55,
    8: 56,
    9: 57,
    SEMICOLON: 186,
    EQUAL: 187,
    A: 65,
    B: 66,
    C: 67,
    D: 68,
    E: 69,
    F: 70,
    G: 71,
    H: 72,
    I: 73,
    J: 74,
    K: 75,
    L: 76,
    M: 77,
    N: 78,
    O: 79,
    P: 80,
    Q: 81,
    R: 82,
    S: 83,
    T: 84,
    U: 85,
    V: 86,
    W: 87,
    X: 88,
    Y: 89,
    Z: 90,
    LEFT_BRACKET: 219,
    BACKSLASH: 220,
    RIGHT_BRACKET: 221,
    GRAVE_ACCENT: 192,
    ESCAPE: 27,
    ENTER: 13,
    TAB: 9,
    BACKSPACE: 8,
    INSERT: 45,
    DELETE: 46,
    RIGHT: 39,
    LEFT: 37,
    DOWN: 40,
    UP: 38,
    PAGE_UP: 33,
    PAGE_DOWN: 34,
    HOME: 36,
    END: 35,
    CAPS_LOCK: 20,
    SCROLL_LOCK: 145,
    NUM_LOCK: 144,
    PRINT_SCREEN: 44,
    PAUSE: 19,
    F1: 112,
    F2: 113,
    F3: 114,
    F4: 115,
    F5: 116,
    F6: 117,
    F7: 118,
    F8: 119,
    F9: 120,
    F10: 121,
    F11: 122,
    F12: 123,
    KP_0: 96,
    KP_1: 97,
    KP_2: 98,
    KP_3: 99,
    KP_4: 100,
    KP_5: 101,
    KP_6: 102,
    KP_7: 103,
    KP_8: 104,
    KP_9: 105,
    KP_DECIMAL: 110,
    KP_DIVIDE: 111,
    KP_MULTIPLY: 106,
    KP_SUBTRACT: 109,
    KP_ADD: 107,
    KP_ENTER: 13,
    SHIFT: 16,
    CONTROL: 17,
    ALT: 18,
    SUPER: 91
};

utils.keyLabels = {
    32: 'SPACE',
    222: 'APOSTROPHE',
    188: 'COMMA',
    189: 'MINUS',
    190: 'PERIOD',
    191: 'SLASH',
    48: '0',
    49: '1',
    50: '2',
    51: '3',
    52: '4',
    53: '5',
    54: '6',
    55: '7',
    56: '8',
    57: '9',
    186: 'SEMICOLON',
    187: 'EQUAL',
    65: 'A',
    66: 'B',
    67: 'C',
    68: 'D',
    69: 'E',
    70: 'F',
    71: 'G',
    72: 'H',
    73: 'I',
    74: 'J',
    75: 'K',
    76: 'L',
    77: 'M',
    78: 'N',
    79: 'O',
    80: 'P',
    81: 'Q',
    82: 'R',
    83: 'S',
    84: 'T',
    85: 'U',
    86: 'V',
    87: 'W',
    88: 'X',
    89: 'Y',
    90: 'Z',
    219: 'LEFT_BRACKET',
    220: 'BACKSLASH',
    221: 'RIGHT_BRACKET',
    192: 'GRAVE_ACCENT',
    27: 'ESCAPE',
    13: 'ENTER',
    9: 'TAB',
    8: 'BACKSPACE',
    45: 'INSERT',
    46: 'DELETE',
    39: 'RIGHT',
    37: 'LEFT',
    40: 'DOWN',
    38: 'UP',
    33: 'PAGE_UP',
    34: 'PAGE_DOWN',
    36: 'HOME',
    35: 'END',
    20: 'CAPS_LOCK',
    145: 'SCROLL_LOCK',
    144: 'NUM_LOCK',
    44: 'PRINT_SCREEN',
    19: 'PAUSE',
    112: 'F1',
    113: 'F2',
    114: 'F3',
    115: 'F4',
    116: 'F5',
    117: 'F6',
    118: 'F7',
    119: 'F8',
    120: 'F9',
    121: 'F10',
    122: 'F11',
    123: 'F12',
    96: 'KP_0',
    97: 'KP_1',
    98: 'KP_2',
    99: 'KP_3',
    100: 'KP_4',
    101: 'KP_5',
    102: 'KP_6',
    103: 'KP_7',
    104: 'KP_8',
    105: 'KP_9',
    110: 'KP_DECIMAL',
    111: 'KP_DIVIDE',
    106: 'KP_MULTIPLY',
    109: 'KP_SUBTRACT',
    107: 'KP_ADD',
    16: 'SHIFT',
    17: 'CONTROL',
    18: 'ALT',
    91: 'SUPER'
};

utils.keyPressed = {};
utils.keyListeners = {};

utils.onKeyDown = function (keyLabel, callback) {
    var key = utils.keysCodes[keyLabel];
    utils.keyListeners[key] = utils.keyListeners[key] || [];
    utils.keyListeners[key].push(callback);
};

var onKeyEvent = function (e) {
    var keydown = e.type === 'keydown', fns;
    utils.keyPressed[e.keyCode] = keydown;
    if (keydown && (fns = utils.keyListeners[e.keyCode])) {
        e.preventDefault();
        for (var i = 0; i < fns.length; i++) {
            fns[i]();
        }
    }
};

addEventListener('keydown', onKeyEvent);
addEventListener('keyup', onKeyEvent);