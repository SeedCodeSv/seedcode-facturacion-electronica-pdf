import jsPDF from "jspdf";
import autoTable, { RowInput } from "jspdf-autotable";
import { DteFe } from "../interfaces/dte01";
import { DteCcf } from "../interfaces/dte03";
import { DteNre } from "../interfaces/dte04";
import { DteNce } from "../interfaces/dte05";
import { DteFse } from "../interfaces/dte14";
import { Direccion } from "../interfaces/common";
import {
  adjustImage,
  formatAddress,
  formatCurrency,
  formatNameByTypeDte,
  generateQR,
} from "./utils";

type Dte = DteFe | DteCcf | DteNre | DteNce | DteFse;
export type SummaryRow = [label: string, amount: string];
type Field = [label: string, value: string];
type RGB = [number, number, number];

export interface DesignOptions {
  logo?: Uint8Array | string;
  selloInvalidacion?: string;
  contingence?: boolean;
  canInvertName?: boolean;
  splitNameInTwoLines?: boolean;
  shortName?: boolean;
}

const palette = {
  blue: [0, 112, 201] as RGB,
  deepBlue: [0, 79, 166] as RGB,
  navy: [9, 24, 76] as RGB,
  border: [174, 195, 223] as RGB,
  pale: [242, 248, 255] as RGB,
  ink: [20, 23, 30] as RGB,
};
const margin = 6.5;
const bottom = 281;

const pageWidth = (doc: jsPDF) => doc.internal.pageSize.getWidth();
const contentWidth = (doc: jsPDF) => pageWidth(doc) - margin * 2;
const lastY = (doc: jsPDF) =>
  (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;

function textStyle(doc: jsPDF, size = 8, bold = false, color = palette.ink) {
  doc.setFont("helvetica", bold ? "bold" : "normal");
  doc.setFontSize(size);
  doc.setTextColor(...color);
}

function gradient(
  doc: jsPDF, x: number, y: number, width: number, height: number,
  from: RGB, to: RGB, radius = 2,
) {
  doc.saveGraphicsState();
  doc.roundedRect(x, y, width, height, radius, radius, null);
  doc.clip();
  doc.discardPath();
  const steps = 80;
  for (let i = 0; i < steps; i++) {
    const color = from.map((value, index) =>
      Math.round(value + (to[index] - value) * i / (steps - 1)),
    ) as RGB;
    doc.setFillColor(...color);
    doc.rect(x + width * i / steps, y, width / steps + 0.02, height, "F");
  }
  doc.restoreGraphicsState();
}

function panel(doc: jsPDF, x: number, y: number, width: number, height: number) {
  gradient(doc, x, y, width, height, [255, 255, 255], palette.pale);
  doc.setDrawColor(...palette.border);
  doc.setLineWidth(0.2);
  doc.roundedRect(x, y, width, height, 2.3, 2.3, "S");
}

function address(value?: Direccion | null) {
  if (!value) return "No establecida";
  return `${value.complemento} ${formatAddress(
    value.departamento, value.municipio, value.distrito,
  )}`.trim();
}

function issuerName(dte: Dte, options: DesignOptions) {
  const name = dte.emisor.nombre;
  const commercial = "nombreComercial" in dte.emisor ? dte.emisor.nombreComercial : "";
  if (!["01", "03"].includes(dte.identificacion.tipoDte) || !commercial || name === commercial) {
    return name;
  }
  const names = options.canInvertName ? [commercial, name] : [name, commercial];
  return names.join(options.splitNameInTwoLines ? "\n" : ", ");
}

async function prepareHeader(doc: jsPDF, dte: Dte, options: DesignOptions) {
  const [logo, qr] = await Promise.all([
    adjustImage(options.logo, 23, 25), generateQR(dte),
  ]);
  const name = issuerName(dte, options);
  textStyle(doc, 11, true);
  const nameLines: string[] = doc.splitTextToSize(name, 81);
  textStyle(doc, 7.7);
  const details: string[] = [
    `Actividad económica: ${dte.emisor.descActividad}`,
    `Dirección: ${address(dte.emisor.direccion)}`,
    `Tel: ${dte.emisor.telefono}`,
  ].flatMap(line => doc.splitTextToSize(line, 81));
  const height = Math.max(32, nameLines.length * 4.3 + details.length * 3.3 + 3);
  const endY = 9 + height + 4;
  return {
    endY,
    draw() {
      doc.addImage(logo.imageBase64, "PNG", margin, 11, logo.width, logo.height, "issuer-logo");
      doc.setFillColor(0, 151, 245);
      doc.roundedRect(30, 9, 1.3, height, 0.6, 0.6, "F");
      textStyle(doc, 11, true, palette.navy);
      doc.text(nameLines, 34.5, 13, { lineHeightFactor: 1.1 });
      textStyle(doc, 7.7);
      doc.text(details, 34.5, 13 + nameLines.length * 4.3 + 1, { lineHeightFactor: 1.2 });
      if (qr) doc.addImage(qr, "PNG", 118, 17, 21, 21, "dte-qr");

      const x = 142;
      const width = pageWidth(doc) - margin - x;
      panel(doc, x, 11, width, 29);
      gradient(doc, x, 11, width, 6.4, palette.blue, palette.deepBlue);
      textStyle(doc, 7.7, true, [255, 255, 255]);
      doc.text("DOCUMENTO TRIBUTARIO ELECTRÓNICO", x + width / 2, 15.3, { align: "center" });
      textStyle(doc, 9, true);
      const title = doc.splitTextToSize(
        formatNameByTypeDte(dte.identificacion.tipoDte, options.shortName ?? false), width - 6,
      );
      doc.text(title, x + width / 2, 22, { align: "center", lineHeightFactor: 1.08 });
      doc.setDrawColor(...palette.border);
      doc.line(x + 6, 29, x + width - 6, 29);
      textStyle(doc, 8.6, true);
      doc.text(`N.I.T. ${dte.emisor.nit}`, x + width / 2, 33.6, { align: "center" });
      doc.text(`NRC No. ${dte.emisor.nrc}`, x + width / 2, 37.5, { align: "center" });
      doc.setDrawColor(...palette.border);
      doc.line(margin, endY, pageWidth(doc) - margin, endY);
    },
  };
}

function fieldLines(doc: jsPDF, fields: Field[], width: number, labelWidth: number) {
  textStyle(doc, 7.4);
  return fields.map(([label, value]) => {
    // Long labels receive their own measured width, keeping their values aligned.
    textStyle(doc, 7.4, true);
    const offset = Math.max(labelWidth, doc.getTextWidth(label) + 2);
    textStyle(doc, 7.4);
    const lines: string[] = doc.splitTextToSize(value || "-", width - offset - 8);
    return { label, offset, lines, height: Math.max(4.4, lines.length * 3.2 + 0.7) };
  });
}

function recipientCards(doc: jsPDF, dte: Dte, y: number, options: DesignOptions) {
  const excluded = "sujetoExcluido" in dte ? dte.sujetoExcluido : undefined;
  const recipient = dte.receptor ?? excluded;
  const rfc = recipient && "nrc" in recipient ? recipient.nrc : "-";
  const id = dte.identificacion;
  const summary = dte.resumen;
  const excludedType = id.tipoDte === "14";
  const fiscalRecipient = id.tipoDte === "03";
  const document = recipient && "nit" in recipient && fiscalRecipient
    ? recipient.nit
    : recipient && "numDocumento" in recipient ? recipient.numDocumento : "-";
  const left: Field[] = [
    ["Nombre:", recipient?.nombre ?? "-"],
    ["Dirección:", recipient?.direccion ? `${address(recipient.direccion)}, El Salvador` : "No establecida"],
    ["Giro:", recipient?.descActividad ?? "-"],
    [fiscalRecipient ? "NIT:" : "Número Documento:", document ?? "-"],
    ["Correo:", recipient?.correo ?? "-"],
    ["Tel:", recipient?.telefono ?? "-"],
  ];
  if (id.tipoDte !== "04") {
    left.push(["Condición de la Operación:", excludedType ? "Contado" :
      "condicionOperacion" in summary && summary.condicionOperacion === 1 ? "Contado" : "Crédito"]);
  }
  const right: Field[] = [
    ["NRC:", rfc ?? "-"],
    ["Código Generación:", id.codigoGeneracion],
    ["Número de Control:", id.numeroControl],
    ["Sello:", "respuestaMH" in dte ? dte.respuestaMH?.selloRecibido ?? "-" : "-"],
    ["Fecha Hora Emisión:", `${id.fecEmi} - ${id.horEmi}`],
    ["Modelo de Facturación:", (excludedType ? options.contingence : id.tipoModelo === 2) ? "Diferido" : "Previo"],
    ["Tipo de Transmisión:", (excludedType ? options.contingence : id.tipoOperacion === 2) ? "Por contingencia" : "Normal"],
  ];
  const width = (contentWidth(doc) - 3.5) / 2;
  const columns = [fieldLines(doc, left, width, 16), fieldLines(doc, right, width, 32)];
  const height = Math.max(...columns.map(rows => rows.reduce((sum, row) => sum + row.height, 0))) + 6;
  columns.forEach((rows, column) => {
    const x = margin + column * (width + 3.5);
    panel(doc, x, y, width, height);
    let baseline = y + 4.6;
    rows.forEach(row => {
      textStyle(doc, 7.4, true);
      doc.text(row.label, x + 4, baseline);
      textStyle(doc, 7.4);
      doc.text(row.lines, x + 4 + row.offset, baseline, { lineHeightFactor: 1.22 });
      baseline += row.height;
    });
  });
  return y + height + 4;
}

function section(doc: jsPDF, title: string, headers: string[], body: RowInput[], y: number, continuationTop: number) {
  const width = contentWidth(doc);
  if (y + 22 > bottom) {
    doc.addPage();
    y = continuationTop;
  }
  autoTable(doc, {
    startY: y + 7, theme: "plain", head: [headers], body,
    margin: { left: margin + 2.5, right: margin + 2.5, top: continuationTop + 7, bottom: 20 },
    styles: { font: "helvetica", fontSize: 7.2, cellPadding: 1.5, textColor: palette.ink },
    headStyles: { fillColor: palette.pale, fontStyle: "bold", lineWidth: { bottom: 0.15 }, lineColor: palette.border },
    columnStyles: { 0: { cellWidth: headers.length === 3 ? 64 : 65 } },
    rowPageBreak: "avoid",
    willDrawPage: data => {
      const top = data.pageNumber === 1 ? y : continuationTop;
      gradient(doc, margin, top, width, 7, [218, 237, 255], [155, 203, 250]);
      textStyle(doc, 9.5, true, palette.deepBlue);
      doc.text(title, margin + 4.5, top + 4.8);
    },
    didDrawPage: data => {
      const top = data.pageNumber === 1 ? y : continuationTop;
      doc.setDrawColor(...palette.border);
      doc.setLineWidth(0.18);
      doc.roundedRect(margin, top, width, (data.cursor?.y ?? top + 7) - top + 1, 2, 2, "S");
    },
  });
  return lastY(doc) + 4.5;
}

function summaryHeight(doc: jsPDF, dte: Dte, rows: SummaryRow[]) {
  textStyle(doc, 6.4);
  const rowHeight = rows.slice(0, -1).reduce((sum, [label]) =>
    sum + Math.max(3.2, doc.splitTextToSize(label, 64).length * 2.5 + 0.7), 0);
  textStyle(doc, 7.3);
  const lettersHeight = Math.max(7.5, doc.splitTextToSize(dte.resumen.totalLetras, 128).length * 3.2 + 3);
  const extension = "extension" in dte ? dte.extension : undefined;
  const observations = extension?.observaciones ?? ("observaciones" in dte.resumen ? dte.resumen.observaciones : "");
  const observationHeight = doc.splitTextToSize(observations || "-", 105).length * 3;
  const responsibilityHeight = Math.max(
    doc.splitTextToSize(extension?.nombEntrega || "-", 49).length,
    doc.splitTextToSize(extension?.nombRecibe || "-", 49).length,
  ) * 3 + Math.max(
    doc.splitTextToSize(extension?.docuEntrega || "-", 49).length,
    doc.splitTextToSize(extension?.docuRecibe || "-", 49).length,
  ) * 3;
  return lettersHeight + 4 + Math.max(rowHeight + 12, 27 + responsibilityHeight + observationHeight);
}

/** Draw the totals supplied by each document without recalculating its amounts. */
export function drawDesignSummary(doc: jsPDF, y: number, dte: Dte, rows: SummaryRow[]) {
  const width = contentWidth(doc);
  textStyle(doc, 7.3);
  const letters = doc.splitTextToSize(dte.resumen.totalLetras, 128);
  const bandHeight = Math.max(7.5, letters.length * 3.2 + 3);
  gradient(doc, margin, y, width, bandHeight, [227, 242, 255], [213, 230, 247]);
  doc.text(letters, margin + 3.5, y + 4.7, { lineHeightFactor: 1.2 });
  const sum = "totalCompra" in dte.resumen ? dte.resumen.totalCompra :
    dte.resumen.totalNoSuj + dte.resumen.totalExenta + dte.resumen.totalGravada;
  textStyle(doc, 9, true, palette.navy);
  doc.text("Suma de Ventas:", 147, y + 5, { align: "left" });
  doc.text(formatCurrency(sum), pageWidth(doc) - margin - 2, y + 5, { align: "right" });

  const startY = y + bandHeight + 4;
  const x = 117;
  const summaryWidth = pageWidth(doc) - margin - x;
  textStyle(doc, 6.4);
  const amounts = rows.slice(0, -1).map(([label, amount]) => {
    const lines = doc.splitTextToSize(label, 64);
    return { lines, amount, height: Math.max(3.2, lines.length * 2.5 + 0.7) };
  });
  const height = amounts.reduce((sum, row) => sum + row.height, 0) + 3;
  panel(doc, x, startY, summaryWidth, height + 9);
  let rowY = startY + 1.5;
  amounts.forEach((row, index) => {
    textStyle(doc, 6.4);
    doc.text(row.lines, x + 4, rowY + 2.4, { lineHeightFactor: 1.1 });
    textStyle(doc, 6.8, true);
    doc.text(`$${row.amount}`, x + summaryWidth - 3, rowY + 2.4, { align: "right" });
    rowY += row.height;
    if (index < amounts.length - 1) {
      doc.setDrawColor(...palette.border);
      doc.setLineWidth(0.1);
      doc.line(x + 3, rowY, x + summaryWidth - 3, rowY);
    }
  });
  gradient(doc, x, startY + height, summaryWidth, 9, palette.blue, palette.deepBlue);
  textStyle(doc, 11, true, [255, 255, 255]);
  doc.text(rows[rows.length - 1][0], x + 4, startY + height + 5.9);
  doc.text(`$${rows[rows.length - 1][1]}`, x + summaryWidth - 3, startY + height + 5.9, { align: "right" });

  const extension = "extension" in dte ? dte.extension : undefined;
  let observationY = startY + 5;
  if (dte.identificacion.tipoDte !== "14") {
    let detailsEnd = startY;
    [
      { x: margin + 2.5, label: "emisor", name: extension?.nombEntrega, id: extension?.docuEntrega },
      { x: 65.5, label: "receptor", name: extension?.nombRecibe, id: extension?.docuRecibe },
    ].forEach(person => {
      textStyle(doc, 7.1, true, palette.navy);
      doc.text(`Responsable por parte del ${person.label}:`, person.x, startY + 5);
      textStyle(doc, 7.1);
      const name = doc.splitTextToSize(person.name || "-", 49);
      doc.text(name, person.x, startY + 9);
      const documentY = startY + 12 + name.length * 3;
      textStyle(doc, 7.1, true, palette.navy);
      doc.text("N° de Documento:", person.x, documentY);
      textStyle(doc, 7.1);
      const id = doc.splitTextToSize(person.id || "-", 49);
      doc.text(id, person.x, documentY + 4);
      detailsEnd = Math.max(detailsEnd, documentY + 4 + id.length * 3);
    });
    doc.setDrawColor(...palette.border);
    doc.line(61.5, startY + 3, 61.5, startY + height + 4);
    observationY = detailsEnd + 4;
  }
  textStyle(doc, 7.1, true, palette.navy);
  doc.text("Observaciones:", margin + 2.5, observationY);
  textStyle(doc, 7.1);
  const observation = extension?.observaciones ?? ("observaciones" in dte.resumen ? dte.resumen.observaciones : "");
  doc.text(doc.splitTextToSize(observation || "-", 105), margin + 2.5, observationY + 4);
}

export async function generateDesignPdf(
  dte: Dte, products: RowInput[], rows: SummaryRow[], options: DesignOptions = {},
) {
  const doc = new jsPDF({ compress: true });
  const header = await prepareHeader(doc, dte, options);
  const continuationTop = header.endY + 6;
  header.draw();
  let y = recipientCards(doc, dte, header.endY + 4.5, options);
  if (options.selloInvalidacion) {
    textStyle(doc, 8, true, [185, 28, 28]);
    const lines = doc.splitTextToSize(`DTE INVALIDO CORRECTAMENTE — SELLO DE ANULACIÓN: ${options.selloInvalidacion}`, contentWidth(doc) - 6);
    doc.text(lines, margin + 3, y + 3);
    y += lines.length * 3.5 + 5;
  }
  if (dte.identificacion.tipoDte !== "14") {
    y = section(doc, "OTROS DOCUMENTOS ASOCIADOS", ["Identificación del documento", "Descripción"], [["-", "-"]], y, continuationTop);
    y = section(doc, "VENTA A CUENTA DE TERCEROS", ["NIT", "Nombre, denominación o razón social"], [["-", "-"]], y, continuationTop);
    const related = "documentoRelacionado" in dte ? dte.documentoRelacionado : null;
    y = section(doc, "DOCUMENTOS RELACIONADOS", ["Tipo de Documento", "N° de Documento", "Fecha de Documento"],
      related?.length ? related.map(item => [item.tipoDocumento, item.numeroDocumento, item.fechaEmision]) : [["-", "-", "-"]], y, continuationTop);
  }

  const excluded = dte.identificacion.tipoDte === "14";
  const headers = excluded
    ? ["Cantidad", "Descripción", "Precio Unitario", "Descuento", "Compras"]
    : ["Cantidad", "Descripción", "Precio Unitario", "Descuento", "Otros Montos\nNo Afectos", "Ventas No\nSujetas", "Ventas\nExentas", "Ventas\nGravadas"];
  const widths = excluded ? [18, 90, 30, 28, contentWidth(doc) - 166]
    : [18, 57, 25, 19.5, 22, 18.5, 18, contentWidth(doc) - 178];
  const summarySize = summaryHeight(doc, dte, rows);
  // Leave the complete summary together; long descriptions continue on a fresh page.
  const tableBottom = bottom - summarySize - 5;
  const pageTables = new Map<number, { top: number; end: number }>();
  if (y + 23 > tableBottom) {
    doc.addPage();
    y = continuationTop - 2.5;
  }
  autoTable(doc, {
    startY: y + 2.5, head: [headers], body: products, theme: "plain",
    margin: { left: margin, right: margin, top: continuationTop, bottom: doc.internal.pageSize.getHeight() - tableBottom },
    styles: { font: "helvetica", fontSize: 8, cellPadding: 2.2, textColor: palette.ink, lineColor: palette.border, lineWidth: { left: 0.12, right: 0.12 }, overflow: "linebreak", minCellHeight: 7.8 },
    headStyles: { fillColor: false, textColor: [255, 255, 255], fontStyle: "bold", fontSize: 7.4, halign: "center", minCellHeight: 9.2, valign: "middle" },
    columnStyles: Object.fromEntries(widths.map((width, index) => [index, { cellWidth: width, halign: index === 0 ? "center" : index === 1 ? "left" : "right" }])),
    rowPageBreak: "avoid",
    willDrawCell: data => {
      if (data.section === "head" && data.column.index === 0) {
        doc.saveGraphicsState();
        doc.rect(margin, data.cell.y, contentWidth(doc), data.cell.height, null);
        doc.clip();
        doc.discardPath();
        gradient(doc, margin, data.cell.y, contentWidth(doc), data.cell.height + 2, palette.blue, palette.deepBlue);
        doc.restoreGraphicsState();
      }
    },
    didDrawPage: data => {
      pageTables.set(doc.getCurrentPageInfo().pageNumber, {
        top: data.pageNumber === 1 ? y + 2.5 : continuationTop,
        end: data.cursor?.y ?? tableBottom,
      });
    },
  });
  const lastPage = doc.getNumberOfPages();
  for (const [page, table] of pageTables) {
    doc.setPage(page);
    const end = Math.max(tableBottom, table.end);
    doc.setDrawColor(...palette.border);
    doc.setLineWidth(0.2);
    doc.roundedRect(margin, table.top, contentWidth(doc), end - table.top, 2, 2, "S");
    let x = margin;
    widths.slice(0, -1).forEach(width => {
      x += width;
      doc.line(x, table.end, x, end);
    });
  }
  doc.setPage(lastPage);
  const summaryY = Math.max(tableBottom, lastY(doc)) + 3;
  drawDesignSummary(doc, summaryY, dte, rows);

  for (let page = 1; page <= doc.getNumberOfPages(); page++) {
    doc.setPage(page);
    if (page > 1) header.draw();
    if (options.contingence) {
      doc.saveGraphicsState();
      doc.setGState(doc.GState({ opacity: 0.15 }));
      textStyle(doc, 38, true, palette.deepBlue);
      doc.text("CONTINGENCIA", 36, 178, { angle: 35 });
      doc.restoreGraphicsState();
    }
    doc.setDrawColor(0, 151, 245);
    doc.setLineWidth(0.6);
    doc.line(margin, 287, 147, 287);
    textStyle(doc, 9, false, palette.navy);
    doc.setFont("helvetica", "italic");
    doc.text("Generado por", 150, 287.7);
    doc.setFont("helvetica", "bolditalic");
    doc.text("Seedcode SV", 172, 287.7);
    if (doc.getNumberOfPages() > 1) {
      textStyle(doc, 6.5, false, palette.navy);
      doc.text(`${page} / ${doc.getNumberOfPages()}`, pageWidth(doc) - margin, 292, { align: "right" });
    }
  }
  return doc.output("arraybuffer");
}
