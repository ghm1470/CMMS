'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var TownShip_1 = require('./TownShip');
var City = (function () {
    function City(id, title, townShip) {
        this.id = id;
        this.title = title ? title : title;
        this.townShip = townShip ? townShip : new TownShip_1.TownShip();
    }
    return City;
}());
exports.City = City;
