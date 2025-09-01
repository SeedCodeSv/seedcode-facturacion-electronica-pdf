"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DteCcf = exports.Resumen03 = exports.CuerpoDocumento03 = exports.Receptor03 = void 0;
var common_1 = require("./common");
var Receptor03 = /** @class */ (function (_super) {
    __extends(Receptor03, _super);
    function Receptor03() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Receptor03;
}(common_1.Emisor));
exports.Receptor03 = Receptor03;
var CuerpoDocumento03 = /** @class */ (function () {
    function CuerpoDocumento03() {
    }
    return CuerpoDocumento03;
}());
exports.CuerpoDocumento03 = CuerpoDocumento03;
var Resumen03 = /** @class */ (function () {
    function Resumen03() {
    }
    return Resumen03;
}());
exports.Resumen03 = Resumen03;
var DteCcf = /** @class */ (function () {
    function DteCcf() {
    }
    return DteCcf;
}());
exports.DteCcf = DteCcf;
