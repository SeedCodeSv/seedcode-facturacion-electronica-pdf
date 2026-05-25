import jsPDF from "jspdf";
import { headerDoc, secondHeader } from "../utils";
import autoTable from "jspdf-autotable";
import { returnBoldText } from "../../utils";
import { writeBoldLabel } from "../../utils";
import { QuoteNormal } from "../../../interfaces/quote.normal";

export const generateQuoteNormal = async (
  quote: QuoteNormal,
  logo: Uint8Array | string = "",
) => {
  const doc = new jsPDF({
    compress: true,
  });

  await secondHeader(quote, doc);

  let finalY = (doc as unknown as { lastAutoTable: { finalY: number } })
    .lastAutoTable.finalY;

  const startY = 28;
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
    quote.precioUni,
    quote.total,
  ]);

  autoTable(doc, {
    theme: "plain",
    startY: finalY + 13,
    margin: {
      right: 5,
      left: 5,
      bottom: doc.internal.pages.length > 1 ? 10 : 55,
      top: 35,
    },
    head: [["CANTIDAD", "DESCRIPCION", "PRECIO UNITARIO", "TOTAL"]],
    showHead: true,
    body: data,
    columnStyles: {
      0: { cellWidth: 15, halign: "center" },
      1: { cellWidth: "auto" },
      2: {
        cellWidth: 25,
        halign: "center",
      },
      3: {
        cellWidth: 25,
        halign: "center",
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
    await headerDoc(quote, doc, logo);

    const margin = 5;
    const rectWidth = doc.internal.pageSize.getWidth() - 2 * margin;
    const radius = 2;
    const rectHeight =
      doc.internal.pageSize.getHeight() -
      (i > 1 ? 35 : finalYFirstPage) -
      margin +
      (i > 1 ? 0 : pageCount > 1 ? 30 : 0);

    const rectMargin = doc.internal.pageSize.getHeight() - 30 - margin;

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(0, 0, 0);
    doc.setFillColor("#ced4da");

    doc.roundedRect(
      20,
      i > 1 ? 35 : finalYFirstPage,
      135,
      i === 1
        ? rectHeight - 30
        : i === pageCount
          ? rectHeight - 30
          : rectHeight,
      0,
      0,
      "S",
    );

    doc.line(
      180,
      i > 1 ? 35 : finalYFirstPage,
      180,
       i === 1 ?  doc.internal.pageSize.getHeight() - 5 : doc.internal.pageSize.getHeight() - 35,
    );

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
      head: [["CANTIDAD", "DESCRIPCION", "PRECIO UNITARIO", "TOTAL"]],
      columnStyles: {
        0: { cellWidth: 15, halign: "center", cellPadding: 2 },
        1: { cellWidth: "auto", cellPadding: 2 },
        2: {
          cellWidth: 25,
          cellPadding: 2,
        },
        3: {
          cellWidth: 25,
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
    }
  }

  return doc.output("arraybuffer");
};

export const footerDocument = (
  quote: QuoteNormal,
  doc: jsPDF,
  rectMargin: number,
) => {
  doc.setFontSize(7);
  doc.text(`ONCE 11/100 DOLARES AMERICANOS`, 10, rectMargin + 4);

  writeBoldLabel(
    doc,
    "Observaciones: ",
    "Condición de de la operación: Contado",
    10,
    rectMargin + 13,
    250,
  );
  doc.setFontSize(9);
  returnBoldText(doc, "Total: $4500", 10, rectMargin + 20);

  doc.setFontSize(8);
  returnBoldText(doc, "Firma: _______________________", 150, rectMargin + 25);
};
