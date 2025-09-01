"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatEconomicActivity = exports.formatDocumentType = exports.formatNameTypeDocument = void 0;
var seedcode_catalogos_mh_1 = require("seedcode-catalogos-mh");
var formatNameTypeDocument = function (type) {
    switch (type) {
        case "13":
            return "DUI";
        case "36":
            return "NIT";
        case "37":
            return "OTROS";
        default:
            return "OTROS";
    }
};
exports.formatNameTypeDocument = formatNameTypeDocument;
var formatDocumentType = function (type) {
    switch (type) {
        case "01":
            return "COMPROBANTE DE FACTURA CONSUMIDOR FINAL";
        case "03":
            return "COMPROBANTE DE CRÉDITO FISCAL";
        case "04":
            return "COMPROBANTE DE NOTA DE REMISIÓN";
        case "14":
            return "COMPROBANTE DE SUJETO EXCLUIDO";
        default:
            return "OTROS";
    }
};
exports.formatDocumentType = formatDocumentType;
var formatEconomicActivity = function (code) {
    var _a;
    var services = new seedcode_catalogos_mh_1.SeedcodeCatalogosMhService();
    return (_a = services.get019CodigoDeActividaEcono("", 1, 100000).find(function (item) { return item.codigo === code; })) === null || _a === void 0 ? void 0 : _a.valores;
};
exports.formatEconomicActivity = formatEconomicActivity;
