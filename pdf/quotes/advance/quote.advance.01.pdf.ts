import jsPDF from "jspdf";
import { advanceHeaderDoc, secondHeader } from "../utils";
import autoTable from "jspdf-autotable";
import { QuoteAdvance } from "../../../interfaces/quote.advance.01";
import {
  convertCurrencyFormat,
  formatCurrency,
  returnBoldText,
  writeBoldLabel,
} from "../../utils";

export const generateQuoteAdvance01 = async (
  quote: QuoteAdvance,
  logo: Uint8Array | string = "",
) => {
  const doc = new jsPDF({
    compress: true,
  });

  await secondHeader(quote, doc);

  let finalY = (doc as unknown as { lastAutoTable: { finalY: number } })
    .lastAutoTable.finalY;

  const startY = 38;
  const marginX = 5;
  const marginY = 5;
  const tableWidth = doc.internal.pageSize.width - marginX * 2;
  const tableHeight = finalY - startY + marginY * 2;
  const radius = 3;

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.1);
  doc.roundedRect(
    marginX,
    startY - marginY,
    tableWidth,
    tableHeight,
    radius,
    radius,
    "S",
  );

  const data = quote.quotationDetails.map((quote) => [
    quote.cantidadItem,
    quote.description,
    formatCurrency(quote.precioUni, 4),
    formatCurrency(quote.montoDescu, 4),
    formatCurrency(quote.noGravado, 4),
    formatCurrency(quote.ventaNoSuj, 4),
    formatCurrency(quote.ventaExenta, 4),
    formatCurrency(quote.ventaGravada, 4),
  ]);

  autoTable(doc, {
    theme: "plain",
    startY: finalY + 10,
    margin: {
      right: 5,
      left: 5,
      bottom: doc.internal.pages.length > 1 ? 10 : 55,
      top: 35,
    },
    head: [
      [
        "CANTIDAD",
        "DESCRIPCION",
        "PRECIO UNITARIO",
        "DESCUENTO POR ITEM",
        "OTROS MONTOS NO AFECTOS",
        "VENTAS NO SUJETAS",
        "VENTAS EXENTAS",
        "VENTAS GRAVADAS",
      ],
    ],
    showHead: true,
    body: data,
    columnStyles: {
      0: { cellWidth: 15, halign: "center", cellPadding: 2 },
      1: { cellWidth: "auto", cellPadding: 2 },
      2: {
        cellWidth: 20,
        cellPadding: 2,
      },
      3: {
        cellWidth: 20,
        cellPadding: 2,
      },
      4: {
        cellWidth: 20,
        cellPadding: 2,
      },
      5: {
        cellWidth: 20,
        cellPadding: 2,
      },
      6: {
        cellWidth: 20,
        cellPadding: 2,
      },
      7: {
        cellWidth: 20,
        cellPadding: 2,
      },
    },
    headStyles: {
      textColor: [0, 0, 0],
      fontStyle: "bold",
      halign: "center",
      fontSize: 5,
    },
    bodyStyles: {
      fontSize: 7,
      cellPadding: 1,
    },
    didDrawCell: (data) => {
      if (data.section === "body") {
        const { x, y, width, height } = data.cell;
        const doc = data.doc;

        doc.setDrawColor("#6c757d");
        doc.setLineWidth(0.1);

        const dashLength = 1;
        const gapLength = 1;
        let drawn = 0;

        while (drawn < width) {
          const startX = x + drawn;
          const endX = Math.min(x + drawn + dashLength, x + width);
          doc.line(startX, y + height, endX, y + height);
          drawn += dashLength + gapLength;
        }
      }
    },
  });

  let finalYFirstPage = 0;

  finalYFirstPage = finalY + 10;

  const pageCount = doc.internal.pages.length - 1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    await advanceHeaderDoc(quote, doc, logo);
    const margin = 5;
    const rectWidth = doc.internal.pageSize.getWidth() - 2 * margin;
    const radius = 2;
    const rectHeight =
      doc.internal.pageSize.getHeight() -
      (i > 1 ? 35 : finalYFirstPage) -
      margin +
      (i > 1 ? 0 : pageCount > 1 ? 50 : 0);

    const rectMargin = doc.internal.pageSize.getHeight() - 50 - margin;

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(0, 0, 0);
    doc.setFillColor("#ced4da");

    doc.line(
      20,
      i > 1 ? 35 : finalYFirstPage,
      20,
      i === 1
        ? doc.internal.pageSize.getHeight() - 55
        : i === pageCount
          ? doc.internal.pageSize.getHeight() - 55
          : doc.internal.pageSize.getHeight(),
    );
    let initial = 85;
    Array.from({ length: 6 }).forEach(() => {
      doc.line(
        initial,
        i > 1 ? 35 : finalYFirstPage,
        initial,
        i === 1
          ? doc.internal.pageSize.getHeight() - 55
          : i === pageCount
            ? doc.internal.pageSize.getHeight() - 55
            : doc.internal.pageSize.getHeight(),
      );
      initial += 20;
    });

    doc.roundedRect(
      margin,
      i !== 1 ? 35 : finalYFirstPage,
      rectWidth,
      8,
      radius,
      radius,
      "FD",
    );

    autoTable(doc, {
      startY: i !== 1 ? 35 : finalYFirstPage,
      theme: "plain",
      head: [
        [
          "CANTIDAD",
          "DESCRIPCION",
          "PRECIO UNITARIO",
          "DESCUENTO POR ITEM",
          "OTROS MONTOS NO AFECTOS",
          "VENTAS NO SUJETAS",
          "VENTAS EXENTAS",
          "VENTAS GRAVADAS",
        ],
      ],
      columnStyles: {
        0: { cellWidth: 15, halign: "center", cellPadding: 2 },
        1: { cellWidth: "auto", cellPadding: 2 },
        2: {
          cellWidth: 20,
          cellPadding: 2,
        },
        3: {
          cellWidth: 20,
          cellPadding: 2,
        },
        4: {
          cellWidth: 20,
          cellPadding: 2,
        },
        5: {
          cellWidth: 20,
          cellPadding: 2,
        },
        6: {
          cellWidth: 20,
          cellPadding: 2,
        },
        7: {
          cellWidth: 20,
          cellPadding: 2,
        },
      },
      headStyles: {
        textColor: [0, 0, 0],
        fontStyle: "bold",
        halign: "center",
        fontSize: 5,
      },
      body: [["", "", "", ""]],
      margin: {
        right: 5,
        left: 5,
      },
    });

    //all
    doc.roundedRect(
      margin,
      i !== 1 ? 35 : finalYFirstPage,
      rectWidth,
      rectHeight - (i !== 1 ? 0 : pageCount === 1 ? 0 : 30),
      radius,
      radius,
      "S",
    );
    // end all

    if (pageCount > 1 && i === pageCount) {
      doc.line(5, rectMargin, doc.internal.pageSize.getWidth() - 5, rectMargin);
      doc.line(
        5,
        rectMargin + 7,
        doc.internal.pageSize.getWidth() - 5,
        rectMargin + 7,
      );
      footerDocument(quote, doc, rectMargin);
    }

    if (pageCount === 1) {
      doc.line(5, rectMargin, doc.internal.pageSize.getWidth() - 5, rectMargin);
      doc.line(
        5,
        rectMargin + 7,
        doc.internal.pageSize.getWidth() - 5,
        rectMargin + 7,
      );
      footerDocument(quote, doc, rectMargin);

      doc.line(
        125,
        doc.internal.pageSize.height - 48,
        125,
        doc.internal.pageSize.height - 5,
      );
    }
  }

  return doc.output("arraybuffer");
};

export const footerDocument = (
  quote: QuoteAdvance,
  doc: jsPDF,
  rectMargin: number,
) => {
  doc.setFontSize(7);
  doc.text(
    convertCurrencyFormat(Number(quote.totalPagar).toString()),
    10,
    rectMargin + 4,
  );

  doc.text("SUMA DE VENTAS:", 120, rectMargin + 4);
  doc.text(`$${" "} ${" "} ${quote.totalNoSuj}`, 150, rectMargin + 4);
  doc.text(`$${" "} ${" "} ${quote.totalExenta}`, 170, rectMargin + 4);
  doc.text(`$${" "} ${" "} ${quote.totalGravada}`, 190, rectMargin + 4);

  writeBoldLabel(
    doc,
    "Observaciones: ",
    quote.observaciones,
    10,
    rectMargin + 13,
    250,
  );

  doc.setFontSize(8);
  returnBoldText(doc, "Firma: _______________________", 10, rectMargin + 45);

  doc.setFontSize(6);

  doc.text("Suma Total de Operaciones:", 127, rectMargin + 10);
  doc.text(
    "Monto global Desc., Rebajas y otros a ventas no sujetas: ",
    127,
    rectMargin + 13,
  );
  doc.text(
    "Monto global Desc., Rebajas y otros a ventas exentas:",
    127,
    rectMargin + 16,
  );
  doc.text(
    "Monto global Desc., Rebajas y otros a ventas gravadas:",
    127,
    rectMargin + 19,
  );
  doc.text("Total IVA: ", 127, rectMargin + 22);
  doc.text("Sub-Total: ", 127, rectMargin + 25);
  doc.text("IVA Percibido: ", 127, rectMargin + 28);
  doc.text("IVA Retenido: ", 127, rectMargin + 31);
  doc.text("Retención Renta: ", 127, rectMargin + 34);
  doc.text("Monto Total de la Operación: ", 127, rectMargin + 37);
  doc.text("Total no Gravado: ", 127, rectMargin + 40);
  doc.text("Total Otros montos no afectos: ", 127, rectMargin + 43);
  doc.text("Total a Pagar: ", 127, rectMargin + 46);

  for (let i = 0; i < 13; i++) {
    doc.text("$", 185, rectMargin + i * 3 + 10);
  }

  const totals = [
    (
      Number(quote.totalNoSuj) +
      Number(quote.totalExenta) +
      Number(quote.totalGravada)
    ).toFixed(2),
    quote.descuNoSuj.toFixed(2),
    quote.descuExenta.toFixed(2),
    quote.descuGravada.toFixed(2),
    quote.totalIva.toFixed(2),
    quote.subTotal.toFixed(2),
    quote.ivaPerci1.toFixed(2),
    quote.ivaRete1.toFixed(2),
    quote.reteRenta.toFixed(2),
    quote.montoTotalOperacion.toFixed(2),
    quote.totalNoGravado.toFixed(2),
    "0.00",
    quote.totalPagar.toFixed(2),
  ];

  totals.forEach((total, index) => {
    doc.text(total, 202.5, rectMargin + index * 3 + 10, {
      align: "right",
    });
  });
};
