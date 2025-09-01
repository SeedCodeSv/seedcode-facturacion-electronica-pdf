"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSvfe14_2 = void 0;
var jspdf_1 = require("jspdf");
var nunito_semibold_1 = require("./fonts/nunito-semibold");
var nunito_1 = require("./fonts/nunito");
var jspdf_autotable_1 = require("jspdf-autotable");
var icon_1 = require("./icons/icon");
var utils_1 = require("../utils");
var utils_2 = require("./utils");
/**
 * Function to generate svfe14 template 2
 *
 * @async
 * @param {Props} param0
 * @param {string} param0.borderColor
 * @param {string} param0.fillColor
 * @param {string} param0.fillColor2
 * @param {string} param0.darkTextColor
 * @param {string} param0.lightTextColor
 * @param {DteFe} param0.svfe14
 * @param {number} param0.logoWidth
 * @param {number} param0.logoHeight
 * @param {{ instagram: string; facebook: string; tiktok: string; whatsapp: string; phone: string; }} param0.socialMedia
 * @param {*} [param0.logo=""]
 * @param {*} [param0.watermark=""]
 * @returns {unknown}
 */
var generateSvfe14_2 = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var doc, marginX, marginY, tableWidth, tableHeight, radius, lastY, data, result, icons, PHONE, INSTAGRAM, FACEBOOK, TIKTOK, WHATSAPP, resumen, pageCounter, _loop_1, i;
    var _c, _d;
    var borderColor = _b.borderColor, fillColor = _b.fillColor, fillColor2 = _b.fillColor2, darkTextColor = _b.darkTextColor, lightTextColor = _b.lightTextColor, tertiaryColor = _b.tertiaryColor, svfe14 = _b.svfe14, logoWidth = _b.logoWidth, logoHeight = _b.logoHeight, socialMedia = _b.socialMedia, _e = _b.logo, logo = _e === void 0 ? "" : _e, _f = _b.watermark, watermark = _f === void 0 ? "" : _f, _g = _b.selloInvalidacion, selloInvalidacion = _g === void 0 ? "" : _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0:
                doc = new jspdf_1.default({
                    orientation: "portrait",
                    unit: "pt",
                    compress: true,
                    format: [816.38, 1057.33],
                });
                doc.addFileToVFS("Nunito-bold.ttf", nunito_1.nunitoBold);
                doc.addFont("Nunito-bold.ttf", "Nunito", "bold");
                doc.addFileToVFS("Nunito-semibold.ttf", nunito_semibold_1.nunitoSemibold);
                doc.addFont("Nunito-semibold.ttf", "Nunito", "normal");
                marginX = 15;
                marginY = 15;
                tableWidth = doc.internal.pageSize.width - marginX * 2;
                tableHeight = doc.internal.pageSize.height - marginY * 2;
                radius = 15;
                lastY = (_d = (_c = doc.lastAutoTable) === null || _c === void 0 ? void 0 : _c.finalY) !== null && _d !== void 0 ? _d : 0;
                data = svfe14.cuerpoDocumento
                    .filter(function (item) { return item.descripcion !== "PROPINA"; })
                    .map(function (item) { return [
                    item.cantidad,
                    item.descripcion,
                    item.precioUni,
                    item.compra,
                ]; });
                (0, jspdf_autotable_1.default)(doc, {
                    head: [["Cantidad", "Descripción", "Precio unitario", "Total compra"]],
                    foot: [["", "", "", "", "", ""]],
                    body: __spreadArray([], data, true),
                    showHead: true,
                    theme: "plain",
                    startY: 425,
                    margin: {
                        top: 175,
                        left: marginX + 10,
                        right: marginX + 10,
                        bottom: doc.internal.pages.length > 1 ? 10 : 20,
                    },
                    headStyles: {
                        minCellHeight: 35,
                        valign: "middle",
                        halign: "center",
                        fontStyle: "bold",
                        textColor: darkTextColor,
                        fontSize: 10,
                        font: "Nunito",
                    },
                    bodyStyles: {
                        textColor: darkTextColor,
                        fontSize: 9,
                    },
                    columnStyles: {
                        0: { cellWidth: 75, halign: "center", valign: "middle" },
                        1: { cellWidth: 500 },
                        2: { cellWidth: 90, halign: "center", valign: "middle" },
                        3: { cellWidth: 90, halign: "center", valign: "middle" },
                    },
                    didDrawPage: function (data) {
                        doc.setLineWidth(1.2);
                        doc.setDrawColor(borderColor);
                        doc.line(25, data.pageNumber === 1 ? 460 : 210, 793, data.pageNumber === 1 ? 460 : 210);
                    },
                });
                lastY = doc.lastAutoTable.finalY;
                result = doc.internal.pageSize.height - lastY;
                if (result < 200) {
                    doc.addPage();
                    lastY = 20;
                }
                icons = new icon_1.Icons();
                icons.changeFillColor(tertiaryColor);
                return [4 /*yield*/, icons.returnBase64Icon("PHONE")];
            case 1:
                PHONE = _h.sent();
                return [4 /*yield*/, icons.returnBase64Icon("INSTAGRAM")];
            case 2:
                INSTAGRAM = _h.sent();
                return [4 /*yield*/, icons.returnBase64Icon("FACEBOOK")];
            case 3:
                FACEBOOK = _h.sent();
                return [4 /*yield*/, icons.returnBase64Icon("TIKTOK")];
            case 4:
                TIKTOK = _h.sent();
                return [4 /*yield*/, icons.returnBase64Icon("WHATSAPP")];
            case 5:
                WHATSAPP = _h.sent();
                resumen = svfe14.resumen;
                (0, jspdf_autotable_1.default)(doc, {
                    head: [["", ""]],
                    startY: 900,
                    theme: "plain",
                    margin: { left: marginX + 10, right: marginX + 3 },
                    didDrawCell: function (data) {
                        if (data.section === "head") {
                            if (data.column.index === 0) {
                                doc.setLineWidth(1.2);
                                doc.setDrawColor(borderColor);
                                doc.roundedRect(data.cell.x + 10, data.cell.y, 250, 60, 5, 5, "S");
                                doc.setFont("Nunito", "normal");
                                doc.setTextColor(darkTextColor);
                                var observations = doc.splitTextToSize("Notas: ".concat(resumen.observaciones ? resumen.observaciones : ""), 240);
                                doc.text(observations, data.cell.x + 15, data.cell.y + 15);
                                doc.text("Cantidad en letras: ", data.cell.x + 10, data.cell.y + 80);
                                doc.roundedRect(data.cell.x + 100, data.cell.y + 65, 350, 30, 5, 5, "S");
                                doc.text(resumen.totalLetras, data.cell.x + 110, data.cell.y + 85);
                                doc.roundedRect(data.cell.x, data.cell.y + 160, 760, 50, 15, 15, "S");
                                doc.setFontSize(9);
                                doc.setTextColor(tertiaryColor);
                                doc.addImage(INSTAGRAM, "PNG", data.cell.x + 10, data.cell.y + 105, 14, 14);
                                doc.text(socialMedia.instagram, data.cell.x + 30, data.cell.y + 115);
                                doc.addImage(FACEBOOK, "PNG", data.cell.x + 159.2, data.cell.y + 105, 14, 14);
                                doc.text(socialMedia.facebook, data.cell.x + 180, data.cell.y + 115);
                                doc.addImage(TIKTOK, "PNG", data.cell.x + 318.4, data.cell.y + 105, 14, 14);
                                doc.text(socialMedia.tiktok, data.cell.x + 339, data.cell.y + 115);
                                doc.addImage(WHATSAPP, "PNG", data.cell.x + 474.6, data.cell.y + 105, 14, 14);
                                doc.text(socialMedia.whatsapp, data.cell.x + 495, data.cell.y + 115);
                                doc.addImage(PHONE, "PNG", data.cell.x + 633.8, data.cell.y + 105, 14, 14);
                                doc.text(socialMedia.phone, data.cell.x + 654, data.cell.y + 115);
                                doc.setTextColor(darkTextColor);
                            }
                            if (data.column.index === 1) {
                                doc.setFont("Nunito", "normal");
                                doc.setFontSize(8);
                                doc.setTextColor(darkTextColor);
                                doc.text("Suma total de operación:", data.cell.x + 215, data.cell.y + 35, {
                                    align: "right",
                                });
                                var textY = data.cell.y + 50;
                                doc.text("Total compra:", data.cell.x + 215, textY, {
                                    align: "right",
                                });
                                textY += 15;
                                doc.text("IVA retenido:", data.cell.x + 215, textY, {
                                    align: "right",
                                });
                                textY += 15;
                                doc.text("Retención renta:", data.cell.x + 215, textY, {
                                    align: "right",
                                });
                                textY += 15;
                                doc.text("TOTAL A PAGAR:", data.cell.x + 215, textY, {
                                    align: "right",
                                });
                                doc.setFillColor(fillColor);
                                doc.rect(data.cell.x + 220, data.cell.y + 20, 150, 80, "F");
                                doc.text(String(resumen.subTotal), data.cell.x + 230, data.cell.y + 35);
                                var textYTotals = data.cell.y + 50;
                                doc.text(String(resumen.totalCompra), data.cell.x + 230, textYTotals);
                                textYTotals += 15;
                                doc.text(String(resumen.ivaRete1), data.cell.x + 230, textYTotals);
                                textYTotals += 15;
                                doc.text(String(resumen.reteRenta), data.cell.x + 230, textYTotals);
                                textYTotals += 15;
                                doc.text(String(resumen.totalPagar), data.cell.x + 230, textYTotals);
                            }
                        }
                    },
                });
                lastY = doc.lastAutoTable.finalY;
                pageCounter = doc.internal.pages.length - 1;
                _loop_1 = function (i) {
                    var isFirstPage, isLastPage, hasMultiplePages, adjustedImage, lineHeight, pageWidth, pageHeight, rectWidth, rectHeight, centerX, offsetY, QR, _j, imageBase64, width, height;
                    return __generator(this, function (_k) {
                        switch (_k.label) {
                            case 0:
                                doc.setPage(i);
                                isFirstPage = i === 1;
                                isLastPage = i === doc.internal.pages.length - 1;
                                hasMultiplePages = doc.internal.pages.length - 1 > 1;
                                if (!(watermark !== "")) return [3 /*break*/, 2];
                                doc.saveGraphicsState();
                                doc.setGState(doc.GState({ opacity: 0.1 }));
                                return [4 /*yield*/, (0, utils_1.adjustImageWatermark)(watermark, 300, 300)];
                            case 1:
                                adjustedImage = _k.sent();
                                doc.addImage(adjustedImage.imageBase64, "PNG", doc.internal.pageSize.width / 2 - 150, isFirstPage
                                    ? hasMultiplePages
                                        ? doc.internal.pageSize.width / 2 + 100
                                        : doc.internal.pageSize.width / 2 + 50
                                    : doc.internal.pageSize.width / 2, adjustedImage.width, adjustedImage.height, "KEY" + i, "FAST");
                                doc.restoreGraphicsState();
                                _k.label = 2;
                            case 2:
                                doc.setLineWidth(1.2);
                                doc.setDrawColor(borderColor);
                                doc.roundedRect(marginX, marginY, tableWidth, tableHeight, radius, radius, "S");
                                doc.roundedRect(25, i === 1 ? 420 : 170, 768, i === 1
                                    ? doc.internal.pages.length - 1 > 1
                                        ? 600
                                        : 450
                                    : i === doc.internal.pages.length - 1
                                        ? 700
                                        : doc.internal.pageSize.height - 200, 15, 15, "S");
                                lineHeight = void 0;
                                if (isFirstPage) {
                                    lineHeight = hasMultiplePages
                                        ? doc.internal.pageSize.height - 38
                                        : doc.internal.pageSize.height - 190;
                                }
                                else if (isLastPage) {
                                    lineHeight = doc.internal.pageSize.height - 198;
                                }
                                else {
                                    lineHeight = doc.internal.pageSize.height - 30;
                                }
                                doc.line(100, i === 1 ? 420 : 170, 100, lineHeight);
                                doc.line(600, i === 1 ? 420 : 170, 600, lineHeight);
                                doc.line(700, i === 1 ? 420 : 170, 700, lineHeight);
                                if (selloInvalidacion !== "") {
                                    doc.saveGraphicsState();
                                    doc.setGState(doc.GState({ opacity: 1 }));
                                    doc.setTextColor("red");
                                    doc.setFontSize(16);
                                    pageWidth = doc.internal.pageSize.width;
                                    pageHeight = doc.internal.pageSize.height;
                                    rectWidth = 600;
                                    rectHeight = 20;
                                    centerX = pageWidth / 2;
                                    offsetY = isFirstPage
                                        ? hasMultiplePages
                                            ? pageHeight / 2 + 200
                                            : pageHeight / 2 + 150
                                        : pageHeight / 2;
                                    doc.setFillColor("#ffffff");
                                    doc.roundedRect(centerX - rectWidth / 2, offsetY, rectWidth, rectHeight, 3, 3, "F");
                                    doc.text("Documento invalidado: " + selloInvalidacion, centerX, offsetY + 14, {
                                        align: "center",
                                    });
                                    doc.restoreGraphicsState();
                                }
                                if (isLastPage) {
                                    doc.setFillColor(fillColor2);
                                    doc.roundedRect(25, doc.internal.pageSize.height - 198, 769, 20, 20, 20, "F");
                                    doc.roundedRect(25, doc.internal.pageSize.height - 198, 769, 10, 2, 2, "F");
                                    doc.setFontSize(11);
                                    doc.setTextColor(lightTextColor);
                                    doc.text("Suma de ventas:", 600, doc.internal.pageSize.height - 185, {
                                        align: "left",
                                    });
                                    doc.setDrawColor(lightTextColor);
                                    doc.setFontSize(10);
                                    doc.line(700, doc.internal.pageSize.height - 198, 700, doc.internal.pageSize.height - 175);
                                    doc.text(String(resumen.totalCompra), 750, doc.internal.pageSize.height - 185, {
                                        align: "center",
                                    });
                                }
                                return [4 /*yield*/, (0, utils_1.generateQRWithColor)(svfe14, darkTextColor)];
                            case 3:
                                QR = _k.sent();
                                return [4 /*yield*/, (0, utils_1.adjustImage)(logo, logoWidth, logoHeight)];
                            case 4:
                                _j = _k.sent(), imageBase64 = _j.imageBase64, width = _j.width, height = _j.height;
                                (0, jspdf_autotable_1.default)(doc, {
                                    head: [["", ""]],
                                    showHead: true,
                                    startY: marginY + 3,
                                    theme: "plain",
                                    margin: { left: marginX + 3, right: marginX + 3 },
                                    didDrawCell: function (data) {
                                        var _a;
                                        if (data.section === "head") {
                                            if (data.column.index === 0) {
                                                doc.addImage(imageBase64, "PNG", data.cell.x + 10, data.cell.y + 10, width, height, "LOGO");
                                                doc.setFont("Nunito", "bold");
                                                doc.setTextColor(darkTextColor);
                                                var lastY_1 = 110;
                                                doc.setFontSize(13);
                                                doc.text(svfe14.emisor.nombre, data.cell.x + 10, lastY_1);
                                                lastY_1 += 15;
                                                doc.setFontSize(10);
                                                doc.setTextColor(tertiaryColor);
                                                doc.text("N.I.T: ", data.cell.x + 10, lastY_1);
                                                doc.setFont("Nunito", "normal");
                                                doc.text(svfe14.emisor.nit, data.cell.x + 40, lastY_1);
                                                doc.setFont("Nunito", "bold");
                                                doc.text("N.R.C: ", data.cell.x + 150, lastY_1);
                                                doc.setFont("Nunito", "normal");
                                                doc.text(svfe14.emisor.nrc, data.cell.x + 180, lastY_1);
                                                doc.setTextColor(darkTextColor);
                                                doc.setFont("Nunito", "bold");
                                                lastY_1 += 15;
                                                doc.setFontSize(8);
                                                doc.setFont("Nunito", "normal");
                                                var address = doc.splitTextToSize((0, utils_1.formatAddress)(svfe14.emisor.direccion.departamento, svfe14.emisor.direccion.municipio) +
                                                    " " +
                                                    svfe14.emisor.direccion.complemento, 380);
                                                var textH = (0, utils_1.getHeightText)(doc, address);
                                                doc.text(address, data.cell.x + 10, lastY_1);
                                                lastY_1 += textH + 2;
                                                doc.text(svfe14.emisor.correo, data.cell.x + 10, lastY_1);
                                                doc.text(socialMedia.website, data.cell.x + 150, lastY_1);
                                            }
                                            if (data.column.index === 1) {
                                                doc.setLineWidth(1.2);
                                                doc.setDrawColor(borderColor);
                                                doc.roundedRect(data.cell.x - 5, data.cell.y + 5, data.cell.width, 130, 15, 15, "S");
                                                doc.setFont("Nunito", "bold");
                                                doc.setFontSize(15);
                                                doc.setTextColor(tertiaryColor);
                                                doc.text("Documento Tributario Electrónico", data.cell.x + 200, data.cell.y + 20, { align: "center" });
                                                doc.setFont("Nunito", "normal");
                                                doc.setFontSize(8);
                                                doc.text((0, utils_2.formatDocumentType)(svfe14.identificacion.tipoDte), data.cell.x + 200, data.cell.y + 32, { align: "center" });
                                                doc.setTextColor(darkTextColor);
                                                doc.addImage(QR, "PNG", data.cell.x + 5, data.cell.y + 40, 80, 80, "QR", "FAST");
                                                var lastY_2 = data.cell.y + 25 + 18;
                                                doc.setFontSize(8);
                                                doc.setFont("Nunito", "normal");
                                                doc.setTextColor(darkTextColor);
                                                doc.text("Código de generación:", data.cell.x + 95, lastY_2);
                                                doc.setFillColor(fillColor);
                                                doc.rect(data.cell.x + 180, lastY_2 - 8, 190, 13, "F");
                                                doc.setFontSize(7.5);
                                                doc.text(svfe14.identificacion.codigoGeneracion, data.cell.x + 185, lastY_2 + 1);
                                                lastY_2 += 21;
                                                doc.setFontSize(8);
                                                doc.text("Número de control de DTE:", data.cell.x + 95, lastY_2);
                                                doc.setFillColor(fillColor);
                                                doc.rect(data.cell.x + 197, lastY_2 - 8, 173, 13, "F");
                                                doc.setFontSize(7.5);
                                                doc.text(svfe14.identificacion.numeroControl, data.cell.x + 200, lastY_2 + 1);
                                                lastY_2 += 21;
                                                doc.setFontSize(8);
                                                doc.text("Sello de recepción:", data.cell.x + 95, lastY_2);
                                                doc.setFillColor(fillColor);
                                                doc.rect(data.cell.x + 167, lastY_2 - 8, 203, 13, "F");
                                                doc.setFontSize(7.5);
                                                doc.text((_a = svfe14.respuestaMH.selloRecibido) !== null && _a !== void 0 ? _a : "", data.cell.x + 170, lastY_2 + 1);
                                                lastY_2 += 18;
                                                doc.setFontSize(7);
                                                doc.setTextColor(darkTextColor);
                                                doc.text("Tipo de transmisión             Modelo de facturación             Fecha y hora generación", data.cell.x + 240, lastY_2, { align: "center" });
                                                doc.setFontSize(7.5);
                                                doc.text("Normal", data.cell.x + 125, lastY_2 + 8);
                                                doc.text("Previo", data.cell.x + 225, lastY_2 + 8);
                                                doc.text("".concat(svfe14.identificacion.fecEmi, " - ").concat(svfe14.identificacion.horEmi), data.cell.x + 293, lastY_2 + 8);
                                                doc.setLineWidth(1);
                                                doc.line(data.cell.x + 185, lastY_2 + 1, data.cell.x + 185, lastY_2 + 12);
                                                doc.line(data.cell.x + 280, lastY_2 + 1, data.cell.x + 280, lastY_2 + 12);
                                                doc.setFillColor(fillColor);
                                                doc.rect(data.cell.x + 172, lastY_2 + 12, 120, 13, "F");
                                                doc.setFontSize(7);
                                                doc.text("Moneda: ", data.cell.x + 195, lastY_2 + 21);
                                                doc.text(svfe14.identificacion.tipoMoneda, data.cell.x + 225, lastY_2 + 21);
                                            }
                                        }
                                    },
                                });
                                if (i === 1) {
                                    lastY = doc.lastAutoTable.finalY;
                                    (0, jspdf_autotable_1.default)(doc, {
                                        head: [[""]],
                                        showHead: true,
                                        startY: lastY + 110,
                                        theme: "plain",
                                        margin: { left: marginX + 3, right: marginX + 3 },
                                        didDrawCell: function (data) {
                                            var _a;
                                            if (data.section === "head") {
                                                if (data.column.index === 0) {
                                                    doc.setLineWidth(1.2);
                                                    doc.setDrawColor(borderColor);
                                                    doc.roundedRect(data.cell.x + 5, data.cell.y + 15, data.cell.width - 10, 245, 15, 15, "S");
                                                    doc.setFillColor(fillColor);
                                                    doc.roundedRect(data.cell.x + 100, data.cell.y + 30, 665, 210, 15, 15, "F");
                                                    doc.setFont("Nunito", "normal");
                                                    doc.setFontSize(11.5);
                                                    doc.setTextColor(darkTextColor);
                                                    var lastY_3 = data.cell.y + 40;
                                                    var paddingX = data.cell.x + 15;
                                                    doc.text("Cliente: ", paddingX, lastY_3);
                                                    doc.text(svfe14.sujetoExcluido.nombre, paddingX + 100, lastY_3 + 3);
                                                    lastY_3 += 30;
                                                    var actEco = doc.splitTextToSize("Actividad Economica: ", 100);
                                                    doc.text("-", paddingX + 100, lastY_3);
                                                    doc.text(actEco, paddingX, lastY_3);
                                                    lastY_3 += 35;
                                                    doc.text("Dirección: ", paddingX, lastY_3);
                                                    var address = doc.splitTextToSize(doc.splitTextToSize(svfe14.sujetoExcluido.direccion
                                                        ? (0, utils_1.formatAddress)(svfe14.sujetoExcluido.direccion.departamento, svfe14.sujetoExcluido.direccion.municipio) +
                                                            ", " +
                                                            svfe14.sujetoExcluido.direccion.complemento
                                                        : "", 600), 700);
                                                    doc.text(address, paddingX + 100, lastY_3);
                                                    lastY_3 += 40;
                                                    doc.text(doc.splitTextToSize("Tipo de documento: ", 100), paddingX, lastY_3 - 10);
                                                    doc.text(svfe14.sujetoExcluido.tipoDocumento
                                                        ? (0, utils_2.formatNameTypeDocument)(svfe14.sujetoExcluido.tipoDocumento)
                                                        : "-", paddingX + 100, lastY_3);
                                                    lastY_3 += 30;
                                                    doc.text(doc.splitTextToSize("Numero de documento: ", 100), paddingX, lastY_3 - 5);
                                                    doc.text((_a = svfe14.sujetoExcluido.numDocumento) !== null && _a !== void 0 ? _a : "-", paddingX + 100, lastY_3);
                                                    lastY_3 += 35;
                                                    doc.text("Correo: ", paddingX, lastY_3);
                                                    doc.text(svfe14.sujetoExcluido.correo, paddingX + 100, lastY_3);
                                                    lastY_3 += 25;
                                                    var nomCom = doc.splitTextToSize("NRC: ", 80);
                                                    doc.text(nomCom, paddingX, lastY_3);
                                                    doc.text("-", paddingX + 100, lastY_3);
                                                    doc.setFillColor(fillColor2);
                                                    doc.rect(data.cell.x + 60, data.cell.y + 243, 130, 17, "F");
                                                    doc.setTextColor("#ffffff");
                                                    doc.text("Condiciones de pago: ", data.cell.x + 70, data.cell.y + 255);
                                                    doc.setTextColor(darkTextColor);
                                                    doc.text(resumen.condicionOperacion === 1 ? "Contado" : "Credito", data.cell.x + 200, data.cell.y + 255);
                                                }
                                            }
                                        },
                                    });
                                }
                                return [2 /*return*/];
                        }
                    });
                };
                i = 1;
                _h.label = 6;
            case 6:
                if (!(i <= pageCounter)) return [3 /*break*/, 9];
                return [5 /*yield**/, _loop_1(i)];
            case 7:
                _h.sent();
                _h.label = 8;
            case 8:
                i++;
                return [3 /*break*/, 6];
            case 9: return [2 /*return*/, doc.output("arraybuffer")];
        }
    });
}); };
exports.generateSvfe14_2 = generateSvfe14_2;
