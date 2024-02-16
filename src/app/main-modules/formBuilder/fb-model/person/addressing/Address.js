'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var City_1 = require('./City');
var Address = (function () {
    function Address(city, mainStreet, street, details, number, region, plaque, postalCode) {
        this.city = city ? city : new City_1.City();
        this.mainStreet = mainStreet ? mainStreet : '';
        this.street = street ? street : '';
        this.details = details ? details : '';
        this.number = number ? number : '';
        this.region = region ? region : '';
        this.plaque = plaque ? plaque : '';
        this.postalCode = postalCode ? postalCode : '';
    }
    return Address;
}());
exports.Address = Address;
