'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var Country_1 = require('./Country');
var Province = (function () {
    function Province(id, title, country, townShips) {
        this.id = id;
        this.title = title ? title : '';
        this.country = country ? country : new Country_1.Country();
        this.townShips = townShips;
    }
    return Province;
}());
exports.Province = Province;
