var _crypto = require('crypto');
   
var isObject = function (val) {
    return Object.prototype.toString.call(val) === '[object Object]';
};

var hash_hmac = function (type, data, key) {
    var hash = _crypto.createHmac(type, key);
    hash.update(data);
    return hash.digest('hex');
};

export var sign = function (data, apiSec) {
    return hash_hmac('sha256', preSign(data), apiSec);
};

var sortBy = function (arr, cb) {
    return arr.sort(function (a, b) {
        var aKey = cb(a);
        var bKey = cb(b);
        if (aKey < bKey) return -1;
        if (aKey > bKey) return 1;
        return 0;
    });
};

var pairs = function (collection) {
    return Object.keys(collection).map(function (key) {
        return [key, collection[key]];
    });
};

var ksort = function (collection) {
    return sortBy(pairs(collection), function (a) {
        return a[0];
    });
};

var preSign = function (collection) {
    var keyVals = ksort(collection);

    return keyVals.map(function (keyVal) {
        var key = keyVal[0];
        var value = keyVal[1];
        if (isObject(value)) {
            value = preSign(value);
        }
        return key + '=' + value;
    }).join('&');
};


