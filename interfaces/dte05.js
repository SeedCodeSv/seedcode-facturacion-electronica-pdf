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
exports.Resumen05 = exports.CuerpoDocumento05 = exports.Receptor05 = void 0;
var dte03_1 = require("./dte03");
var dte03_2 = require("./dte03");
var Receptor05 = /** @class */ (function (_super) {
    __extends(Receptor05, _super);
    function Receptor05() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Receptor05;
}(dte03_1.Receptor03));
exports.Receptor05 = Receptor05;
var CuerpoDocumento05 = /** @class */ (function (_super) {
    __extends(CuerpoDocumento05, _super);
    function CuerpoDocumento05() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CuerpoDocumento05;
}(dte03_2.CuerpoDocumento03));
exports.CuerpoDocumento05 = CuerpoDocumento05;
var Resumen05 = /** @class */ (function (_super) {
    __extends(Resumen05, _super);
    function Resumen05() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Resumen05;
}(dte03_1.Resumen03));
exports.Resumen05 = Resumen05;
