import jsPDF from "jspdf";
import { nunitoSemibold } from "./fonts/nunito-semibold";
import { nunitoBold } from "./fonts/nunito";
import autoTable from "jspdf-autotable";
import { DteFe } from "../../interfaces/dte01";
import {
  formatCurrency,
  generateQRWithColor,
  adjustImageWatermark,
  adjustImageByHeight,
} from "../utils";

interface PdfColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  textOnPrimary: string;
  border: string;
  headerBackground: string;
  headerText: string;
  titleColor: string;
  contentColor: string;
}

interface PdfDimensions {
  pageWidth: number;
  pageHeight: number;
  margin: number;
  headerHeight: number;
  sectionGap: number;
  cardRadius: number;
  fontSize: {
    title: number;
    subtitle: number;
    body: number;
    small: number;
    tiny: number;
  };
  lineHeight: number;
}

interface PdfConfig {
  colors: PdfColors;
  dimensions: PdfDimensions;
}

const DEFAULT_COLORS: PdfColors = {
  primary: "#512da8",
  secondary: "#673ab7",
  background: "#ffffff",
  surface: "#ede7f6",
  textPrimary: "#211a2e",
  textSecondary: "#5e5870",
  textOnPrimary: "#ffffff",
  border: "#d8d1e3",
  headerBackground: "#512da8",
  headerText: "#ffffff",
  titleColor: "#4527a0",
  contentColor: "#240046",
};

const DEFAULT_DIMENSIONS: PdfDimensions = {
  pageWidth: 816.38,
  pageHeight: 1057.33,
  margin: 40,
  headerHeight: 80,
  sectionGap: 20,
  cardRadius: 20,
  fontSize: {
    title: 14,
    subtitle: 12,
    body: 10,
    small: 9,
    tiny: 7,
  },
  lineHeight: 12,
};

const HEADER_ON_PAGE_HEIGHT = 100;

interface Props {
  svfe01: DteFe;
  logoWidth: number;
  logoHeight: number;
  logo: Uint8Array | string;
  selloInvalidacion: string;
  watermark: Uint8Array | string;
  colors?: Partial<PdfColors>;
  dimensions?: Partial<PdfDimensions>;
}

function calculateLayout(config: PdfConfig) {
  const { dimensions } = config;
  const {
    pageWidth,
    pageHeight,
    margin,
    headerHeight,
    sectionGap,
    cardRadius,
  } = dimensions;

  const contentWidth = pageWidth - margin * 2;
  const halfWidth = (contentWidth - sectionGap) / 2;

  let currentY = margin + headerHeight + sectionGap;

  return {
    pageWidth,
    pageHeight,
    margin,
    contentWidth,
    halfWidth,
    leftX: margin,
    rightX: margin + halfWidth + sectionGap,
    headerY: margin,
    currentY,
    cardRadius,
    sectionGap,
    nextSection: (height: number) => {
      const y = currentY;
      currentY += height + sectionGap;
      return y;
    },
    addHeight: (height: number) => {
      currentY += height;
    },
    getCurrentY: () => currentY,
  };
}

function drawCard(
  doc: jsPDF,
  config: PdfConfig,
  x: number,
  y: number,
  width: number,
  height: number,
  title: string,
  body: Array<[string, string]>,
) {
  const { colors, dimensions } = config;
  const cardPad = 10;

  doc.setFillColor(colors.surface);
  doc.setDrawColor(colors.border);
  doc.roundedRect(
    x,
    y,
    width,
    height,
    dimensions.cardRadius,
    dimensions.cardRadius,
    "FD",
  );

  doc.setFillColor(colors.primary);
  doc.rect(x + cardPad, y - 13, 130, 17, "F");
  doc.setFontSize(dimensions.fontSize.subtitle);
  doc.setTextColor(colors.textOnPrimary);
  doc.text(title, x + cardPad + 10, y + 2);

  autoTable(doc, {
    theme: "plain",
    startY: y + cardPad,
    styles: {
      fontSize: dimensions.fontSize.body,
      textColor: colors.contentColor,
      cellPadding: 3,
    },
    margin: {
      left: x + cardPad,
      top: y + cardPad,
    },
    body: body.map(([label, value]) => [
      {
        content: label,
        styles: { fontStyle: "bold", textColor: colors.titleColor },
      },
      { content: value, styles: { textColor: colors.contentColor } },
    ]),
    columnStyles: {
      0: { cellWidth: 100 },
      1: { cellWidth: width - 100 - cardPad * 2 },
    },
  });
}

function drawPageHeader(
  doc: jsPDF,
  config: PdfConfig,
  layout: ReturnType<typeof calculateLayout>,
  title: string,
  svfe01: DteFe,
  logo: Uint8Array | string = "",
  logoWidth: number = 0,
  logoHeight: number = 0,
) {
  const { colors, dimensions } = config;

  if (logo !== "" && logoWidth > 0 && logoHeight > 0) {
    try {
      doc.addImage(logo, "PNG", layout.leftX, layout.headerY, logoWidth, logoHeight, "LOGO", "SLOW");
    } catch {
      // ignore logo errors
    }
  }

  doc.setFont("Nunito", "bold");
  doc.setFontSize(dimensions.fontSize.subtitle);
  doc.setTextColor(colors.primary);
  doc.text(
    title,
    layout.pageWidth - layout.margin,
    layout.headerY + 12,
    { align: "right" },
  );

  const headerTableY = layout.headerY + 28;
  const { identificacion } = svfe01;

  autoTable(doc, {
    startY: headerTableY,
    margin: {
      top: 0,
      right: layout.margin,
      left: layout.rightX,
    },
    theme: "plain",
    styles: {
      fontSize: dimensions.fontSize.small,
      cellPadding: 1,
      textColor: colors.contentColor,
    },
    columnStyles: {
      0: { cellWidth: 120 },
    },
    body: [
      [
        {
          content: "Numero de control:",
          styles: { fontStyle: "bold", textColor: colors.titleColor },
        },
        {
          content: identificacion.numeroControl,
          styles: {
            halign: "right",
            valign: "middle",
            textColor: colors.contentColor,
          },
        },
      ],
      [
        {
          content: "Codigo de generacion:",
          styles: { fontStyle: "bold", textColor: colors.titleColor },
        },
        {
          content: identificacion.codigoGeneracion,
          styles: {
            halign: "right",
            valign: "middle",
            textColor: colors.contentColor,
          },
        },
      ],
      [
        {
          content: "Sello recibido:",
          styles: { fontStyle: "bold", textColor: colors.titleColor },
        },
        {
          content: svfe01.respuestaMH?.selloRecibido ?? "-",
          styles: {
            halign: "right",
            valign: "middle",
            textColor: colors.contentColor,
          },
        },
      ],
      [
        {
          content: "Fecha hora emision:",
          styles: { fontStyle: "bold", textColor: colors.titleColor },
        },
        {
          content: `${identificacion.fecEmi} - ${identificacion.horEmi}`,
          styles: {
            halign: "right",
            valign: "middle",
            textColor: colors.contentColor,
          },
        },
      ],
    ],
  });
}

function drawBottomSection(
  doc: jsPDF,
  config: PdfConfig,
  layout: ReturnType<typeof calculateLayout>,
  startY: number,
  qrDataUrl: string | Buffer,
  svfe01: DteFe,
) {
  const { colors, dimensions } = config;
  const { resumen } = svfe01;

  const qrSize = 125;
  const qrX = layout.leftX;
  const qrY = startY;

  doc.addImage(qrDataUrl as string, "PNG", qrX, qrY, qrSize, qrSize, "QR");

  const observationsHeight = 125;
  const observationsWidth = 250;
  const observationsX = (dimensions.pageWidth - observationsWidth) / 2;

  doc.setDrawColor(colors.primary);
  doc.roundedRect(
    observationsX - 85,
    qrY,
    observationsWidth,
    observationsHeight,
    dimensions.cardRadius,
    dimensions.cardRadius,
    "S",
  );
  doc.setTextColor(colors.primary);
  doc.setFontSize(dimensions.fontSize.body);
  doc.setFont("Nunito", "bold");
  doc.text("Observaciones: ", observationsX - 70, qrY + 20);
  doc.setFont("Nunito", "normal");
  doc.setFontSize(dimensions.fontSize.small);
  doc.text(
    doc.splitTextToSize(svfe01.extension?.observaciones ?? "-", 220),
    observationsX - 70,
    qrY + 35,
  );

  const totalsWidth = 240;
  const totalsHeight = 230;
  const totalsX = dimensions.pageWidth - layout.margin - totalsWidth;
  const totalsY = qrY;

  doc.setFillColor(colors.surface);
  doc.setDrawColor(colors.border);
  doc.roundedRect(totalsX + 140, totalsY, 100, totalsHeight, 10, 10, "FD");

  const totals =
    svfe01.identificacion.tipoDte === "01"
      ? [
          ["Total no sujeto", formatCurrency(resumen.totalNoSuj)],
          ["Total exento", formatCurrency(resumen.totalExenta)],
          ["Total gravada", formatCurrency(resumen.totalGravada)],
          ["Total no gravado", formatCurrency(resumen.totalNoGravado)],
          ["Descu. no sujeto", formatCurrency(resumen.descuNoSuj)],
          ["Descu. exento", formatCurrency(resumen.descuExenta)],
          ["Descu. gravada", formatCurrency(resumen.descuGravada)],
          ["Total descuento", formatCurrency(resumen.totalDescu)],
          ["Sub total", formatCurrency(resumen.subTotal)],
          ["Total IVA", formatCurrency(resumen.totalIva ?? 0)],
          ["Monto total operacion", formatCurrency(resumen.montoTotalOperacion)],
          ["Total a pagar", formatCurrency(resumen.totalPagar)],
        ]
      : [
          ["Total no sujeto", formatCurrency(resumen.totalNoSuj)],
          ["Total exento", formatCurrency(resumen.totalExenta)],
          ["Total gravada", formatCurrency(resumen.totalGravada)],
          ["Descu. no sujeto", formatCurrency(resumen.descuNoSuj)],
          ["Descu. exento", formatCurrency(resumen.descuExenta)],
          ["Descu. gravada", formatCurrency(resumen.descuGravada)],
          ["Total descuento", formatCurrency(resumen.totalDescu)],
          ["Sub total", formatCurrency(resumen.subTotal)],
          ["IVA Retenido", formatCurrency(resumen.ivaRete1 ?? 0)],
          ["IVA Percibido", formatCurrency(resumen.ivaPerci1 ?? 0)],
          ["Monto total operacion", formatCurrency(resumen.montoTotalOperacion)],
          ["Total a pagar", formatCurrency(resumen.totalPagar)],
        ];

  autoTable(doc, {
    startY: totalsY + 10,
    margin: {
      left: totalsX + 10,
    },
    theme: "plain",
    styles: {
      fontSize: dimensions.fontSize.body,
      textColor: colors.contentColor,
      cellPadding: 3,
    },
    columnStyles: {
      0: { cellWidth: 125 },
      1: {
        cellWidth: 75,
        halign: "right",
        cellPadding: { left: 15 },
      },
    },
    body: totals.map(([label, value]) => [
      {
        content: label,
        styles: {
          fontStyle: "bold",
          halign: "right",
          valign: "middle",
          textColor: colors.titleColor,
        },
      },
      {
        content: value,
        styles: {
          halign: "left",
          valign: "middle",
          textColor: colors.contentColor,
        },
      },
    ]),
  });

  const totalWordsHeight = 40;
  const totalWordsWidth = 410;
  const totalWordsY = totalsY + totalsHeight - 40;

  doc.setFontSize(dimensions.fontSize.subtitle);
  doc.setFillColor(colors.surface);
  doc.roundedRect(
    layout.leftX,
    totalWordsY,
    totalWordsWidth,
    totalWordsHeight,
    5,
    5,
    "FD",
  );
  doc.setDrawColor(colors.border);
  doc.setFillColor(colors.primary);
  doc.rect(layout.leftX + 10, totalWordsY - 10, 130, 20, "F");
  doc.setTextColor(colors.textOnPrimary);
  doc.text("Total en letras", layout.leftX + 20, totalWordsY + 5);
  doc.setFont("Nunito", "bold");
  doc.setTextColor(colors.textPrimary);
  doc.text(resumen.totalLetras, layout.leftX + 20, totalWordsY + 25);
}

export const generateSvfe01_3 = async ({
  svfe01,
  logoWidth,
  logoHeight,
  logo = "",
  watermark = "",
  selloInvalidacion = "",
  colors: customColors = {},
  dimensions: customDimensions = {},
}: Props) => {
  const mergedConfig: PdfConfig = {
    colors: { ...DEFAULT_COLORS, ...customColors },
    dimensions: { ...DEFAULT_DIMENSIONS, ...customDimensions },
  };

  const { colors, dimensions } = mergedConfig;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: [dimensions.pageWidth, dimensions.pageHeight],
  });

  doc.addFileToVFS("Nunito-bold.ttf", nunitoBold);
  doc.addFont("Nunito-bold.ttf", "Nunito", "bold");

  doc.addFileToVFS("Nunito-semibold.ttf", nunitoSemibold);
  doc.addFont("Nunito-semibold.ttf", "Nunito", "normal");

  const layout = calculateLayout(mergedConfig);

  const { identificacion } = svfe01;
  const docTitle =
    identificacion.tipoDte === "01"
      ? "COMPROBANTE DE FACTURA CONSUMIDOR FINAL"
      : "COMPROBANTE DE CREDITO FISCAL";

  drawPageHeader(doc, mergedConfig, layout, docTitle, svfe01, logo, logoWidth, logoHeight);

  const emitterY = layout.nextSection(180);
  const { emisor } = svfe01;
  drawCard(
    doc,
    mergedConfig,
    layout.leftX,
    emitterY,
    layout.halfWidth,
    180,
    "EMISOR",
    [
      ["NOMBRE:", emisor.nombre],
      ["N.I.T:", emisor.nit],
      ["N.R.C:", emisor.nrc],
      ["ACT. ECONOMICA:", emisor.descActividad],
      ["TELEFONO:", emisor.telefono],
      ["CORREO:", emisor.correo],
      [
        "DIRECCION:",
        emisor.direccion?.complemento ?? "-",
      ],
    ],
  );

  const receiverY = emitterY;
  const { receptor } = svfe01;
  const receptorFields: [string, string][] =
    identificacion.tipoDte === "01"
      ? [
          ["NOMBRE:", receptor.nombre],
          ["TIPO DOC:", (receptor as any).tipoDocumento ?? "-"],
          ["NUM DOC:", (receptor as any).numDocumento ?? "-"],
          ["N.R.C:", receptor.nrc ?? "-"],
          ["TELEFONO:", receptor.telefono ?? "-"],
          ["CORREO:", receptor.correo ?? "-"],
          [
            "DIRECCION:",
            receptor.direccion?.complemento ?? "-",
          ],
        ]
      : [
          ["NOMBRE:", receptor.nombre],
          ["N.I.T:", (receptor as any).nit ?? "-"],
          ["N.R.C:", receptor.nrc ?? "-"],
          ["ACT. ECONOMICA:", receptor.descActividad ?? "-"],
          ["TELEFONO:", receptor.telefono ?? "-"],
          ["CORREO:", receptor.correo ?? "-"],
          [
            "DIRECCION:",
            receptor.direccion?.complemento ?? "-",
          ],
        ];
  drawCard(
    doc,
    mergedConfig,
    layout.rightX,
    receiverY,
    layout.halfWidth,
    180,
    "RECEPTOR",
    receptorFields,
  );

  const itemsY = layout.getCurrentY();

  const exclude = ["PROPINA", "PROPINA EXTRA"];
  const descColWidth: number =
    layout.contentWidth - 55 - 70 - 65 - 65 - 65 - 65;

  const { cuerpoDocumento } = svfe01;

  const data = cuerpoDocumento
    .filter((item) => !exclude.includes(item.descripcion))
    .map((cuerpo) => [
      { content: String(cuerpo.cantidad), styles: { halign: "center" as const } },
      { content: cuerpo.descripcion, styles: { halign: "left" as const } },
      {
        content: `$${Number(cuerpo.precioUni).toFixed(2)}`,
        styles: { halign: "center" as const },
      },
      {
        content: `$${Number(cuerpo.montoDescu).toFixed(2)}`,
        styles: { halign: "center" as const },
      },
      {
        content: `$${Number(cuerpo.ventaNoSuj).toFixed(2)}`,
        styles: { halign: "center" as const },
      },
      {
        content: `$${Number(cuerpo.ventaExenta).toFixed(2)}`,
        styles: { halign: "center" as const },
      },
      {
        content: `$${Number(cuerpo.ventaGravada).toFixed(2)}`,
        styles: { halign: "center" as const },
      },
    ]);

  const headers = [
    "Cantidad",
    "Descripcion",
    "Precio unitario",
    "Desc. items",
    "Ventas no sujetas",
    "Ventas exentas",
    "Ventas gravadas",
  ];

  const bodyStyles: { [key: string]: any } = {
    0: { cellWidth: 55, halign: "center", valign: "middle" },
    1: { cellWidth: descColWidth, halign: "left", valign: "middle" },
    2: { cellWidth: 70, halign: "center", valign: "middle" },
    3: { cellWidth: 65, halign: "center", valign: "middle" },
    4: { cellWidth: 65, halign: "center", valign: "middle" },
    5: { cellWidth: 65, halign: "center", valign: "middle" },
    6: { cellWidth: 65, halign: "center", valign: "middle" },
  };

  const bottomGap = 30;
  const bottomSectionHeight = 240;
  const requiredBottomSpace = bottomSectionHeight + bottomGap;

  const colXPositions: number[] = [];

  autoTable(doc, {
    startY: itemsY,
    margin: {
      top: layout.headerY + HEADER_ON_PAGE_HEIGHT,
      left: layout.leftX,
      right: layout.margin,
      bottom: layout.margin,
    },
    styles: {
      fontSize: dimensions.fontSize.small,
      textColor: colors.contentColor,
      cellPadding: 4,
    },
    headStyles: {
      fontSize: dimensions.fontSize.small,
      fillColor: colors.background,
      textColor: colors.titleColor,
      fontStyle: "bold",
      cellPadding: 5,
    },
    head: [headers],
    body: data,
    theme: "plain",
    columnStyles: bodyStyles,
    didParseCell: (data) => {
      if (data.section === "head") {
        data.cell.styles.valign = "middle";
        data.cell.styles.halign = "center";
      }
    },
    didDrawCell: (data) => {
      if (data.section === "head") {
        const y = data.cell.y + data.cell.height;
        doc.setDrawColor(colors.primary);
        doc.setLineWidth(0.4);
        doc.line(data.cell.x, y, data.cell.x + data.cell.width, y);
        if (!colXPositions.includes(data.cell.x)) {
          colXPositions.push(data.cell.x);
        }
        if (data.column.index === data.table.columns.length - 1) {
          const rightX = data.cell.x + data.cell.width;
          if (!colXPositions.includes(rightX)) {
            colXPositions.push(rightX);
          }
        }
      }
    },
    didDrawPage: (data) => {
      if (data.pageNumber > 1) {
        drawPageHeader(doc, mergedConfig, layout, docTitle, svfe01, logo, logoWidth, logoHeight);
      }
    },
  });

  const itemsPageCount = doc.internal.pages.length - 1;
  const tableFinalY = (doc as unknown as { lastAutoTable: { finalY: number } })
    .lastAutoTable.finalY;
  const spaceLeftOnLastItemsPage =
    dimensions.pageHeight - layout.margin - tableFinalY;

  let bottomPageNumber: number;
  let bottomStartY: number;

  const absoluteBottomY =
    dimensions.pageHeight - layout.margin - bottomSectionHeight;

  if (spaceLeftOnLastItemsPage >= requiredBottomSpace) {
    bottomPageNumber = itemsPageCount;
    bottomStartY = absoluteBottomY;
  } else {
    doc.addPage();
    bottomPageNumber = itemsPageCount + 1;
    drawPageHeader(doc, mergedConfig, layout, docTitle, svfe01, logo, logoWidth, logoHeight);

    const itemsTableY = layout.headerY + HEADER_ON_PAGE_HEIGHT;

    autoTable(doc, {
      startY: itemsTableY,
      margin: {
        top: 0,
        left: layout.leftX,
        right: layout.margin,
        bottom: 0,
      },
      theme: "plain",
      styles: {
        fontSize: dimensions.fontSize.small,
        textColor: colors.contentColor,
        cellPadding: 4,
      },
      headStyles: {
        fontSize: dimensions.fontSize.small,
        fillColor: colors.background,
        textColor: colors.titleColor,
        fontStyle: "bold",
        cellPadding: 5,
      },
      head: [headers],
      body: [["", "", "", "", "", "", ""]],
      columnStyles: bodyStyles,
      didParseCell: (data) => {
        if (data.section === "head") {
          data.cell.styles.valign = "middle";
          data.cell.styles.halign = "center";
        }
      },
      didDrawCell: (data) => {
        if (data.section === "head") {
          const y = data.cell.y + data.cell.height;
          doc.setDrawColor(colors.primary);
          doc.setLineWidth(0.4);
          doc.line(data.cell.x, y, data.cell.x + data.cell.width, y);
        }
      },
    });

    bottomStartY = absoluteBottomY;
  }

  for (let i = 1; i <= itemsPageCount; i++) {
    doc.setPage(i);

    const rectTop = i === 1 ? itemsY : layout.headerY + HEADER_ON_PAGE_HEIGHT;
    const isLastItemsPageWithBottomHere =
      i === itemsPageCount && bottomPageNumber === itemsPageCount;
    const rectBottom = isLastItemsPageWithBottomHere
      ? absoluteBottomY - bottomGap
      : dimensions.pageHeight - layout.margin;

    doc.setDrawColor(colors.primary);
    doc.roundedRect(
      layout.leftX,
      rectTop,
      layout.contentWidth,
      rectBottom - rectTop,
      dimensions.cardRadius,
      dimensions.cardRadius,
      "S",
    );

    if (colXPositions.length > 2) {
      doc.setLineWidth(0.2);
      for (let j = 1; j < colXPositions.length - 1; j++) {
        doc.line(colXPositions[j], rectTop, colXPositions[j], rectBottom);
      }
    }
  }

  if (bottomPageNumber > itemsPageCount) {
    doc.setPage(bottomPageNumber);
    const rectTop = layout.headerY + HEADER_ON_PAGE_HEIGHT;
    const rectBottom = absoluteBottomY - bottomGap;

    doc.setDrawColor(colors.primary);
    doc.roundedRect(
      layout.leftX,
      rectTop,
      layout.contentWidth,
      rectBottom - rectTop,
      dimensions.cardRadius,
      dimensions.cardRadius,
      "S",
    );

    if (colXPositions.length > 2) {
      doc.setLineWidth(0.2);
      for (let j = 1; j < colXPositions.length - 1; j++) {
        doc.line(colXPositions[j], rectTop, colXPositions[j], rectBottom);
      }
    }
  }

  if (watermark !== "") {
    const wmWidth = 300;
    const wmHeight = 120;
    const wmX = (dimensions.pageWidth - wmWidth) / 2;
    const wmY = (dimensions.pageHeight - wmHeight) / 2;
    const adjustedImage = await adjustImageWatermark(watermark, wmWidth, wmHeight);

    for (let i = 1; i <= itemsPageCount; i++) {
      doc.setPage(i);
      doc.saveGraphicsState();
      doc.setGState(doc.GState({ opacity: 0.06 }));
      doc.addImage(
        adjustedImage.imageBase64,
        "PNG",
        wmX,
        wmY,
        adjustedImage.width,
        adjustedImage.height,
        "watermark" + i,
        "SLOW",
      );
      doc.restoreGraphicsState();
    }
    if (bottomPageNumber > itemsPageCount) {
      doc.setPage(bottomPageNumber);
      doc.saveGraphicsState();
      doc.setGState(doc.GState({ opacity: 0.06 }));
      doc.addImage(
        adjustedImage.imageBase64,
        "PNG",
        wmX,
        wmY,
        adjustedImage.width,
        adjustedImage.height,
        "watermark" + bottomPageNumber,
        "SLOW",
      );
      doc.restoreGraphicsState();
    }
  }

  doc.setPage(bottomPageNumber);

  const qrDataUrl = await generateQRWithColor(svfe01, colors.titleColor);
  drawBottomSection(doc, mergedConfig, layout, bottomStartY, qrDataUrl, svfe01);

  if (selloInvalidacion !== "") {
    doc.saveGraphicsState();
    doc.setGState(doc.GState({ opacity: 1 }));
    doc.setTextColor("red");
    doc.setFontSize(16);

    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const rectWidth = 600;
    const rectHeight = 20;
    const centerX = pageWidth / 2;
    const offsetY = pageHeight / 2;

    doc.setFillColor("#ffffff");
    doc.roundedRect(
      centerX - rectWidth / 2,
      offsetY,
      rectWidth,
      rectHeight,
      3,
      3,
      "F",
    );

    doc.text(
      "Documento invalidado: " + selloInvalidacion,
      centerX,
      offsetY + 14,
      { align: "center" },
    );

    doc.restoreGraphicsState();
  }

  return doc.output("arraybuffer");
};
