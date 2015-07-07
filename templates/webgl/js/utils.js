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
