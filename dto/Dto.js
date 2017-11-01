const uuid = require('uuid/v4');

class Dto {

    // noinspection JSUnusedGlobalSymbols
    static createGUID(prefix) {
        return (prefix !== '' ? prefix + "-" : '') + uuid();
    }

    // noinspection JSUnusedGlobalSymbols
    fromArray(arr) {
        let instance = this;
        arr.forEach(function (key,val) {
            if (typeof instance[key] !== 'undefined') {
                instance[key] = val;
            }
        });
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    toArray() {
        let result = {};
        let keys = Object.keys(this);
        let instance = this;
        keys.forEach(function (field) {
            if (typeof instance[field] !== 'function' && field !== 'classname') {
                result[field] = instance[field];
            }
        });
        return result;
    }


}
module.exports = Dto;