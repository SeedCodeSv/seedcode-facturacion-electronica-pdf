import jsPDF from "jspdf";
import { DteExp } from "../interfaces/dte11";
import {
  formatCurrency,
  headerDoc,
  returnBoldText,
  secondHeaderExp,
} from "./utils";
import autoTable, { RowInput } from "jspdf-autotable";

export const generateSvfe11 = async (
  svfe11: DteExp,
  logo: Uint8Array | string = "",
  selloInvalidacion: string = "",
  contingence: boolean = false,
  canInvertName: boolean = false,
  splitNameInTwoLines: boolean = false,
  shortName: boolean = false,
) => {
  const doc = new jsPDF({
    compress: true,
  });
  let finalYFirstPage = 0;

  const { cuerpoDocumento } = svfe11 as DteExp;
  doc.setFontSize(6);

  secondHeaderExp(doc, svfe11, selloInvalidacion, contingence);

  let finalY = (doc as unknown as { lastAutoTable: { finalY: number } })
    .lastAutoTable.finalY;

  const startY = 42;
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
  finalY = (
    doc as unknown as {
      lastAutoTable: { finalY: number };
    }
  ).lastAutoTable.finalY;

  const { otrosDocumentos, ventaTercero } = svfe11 as DteExp;

  if (otrosDocumentos !== null && otrosDocumentos) {
    returnBoldText(
      doc,
      "OTROS DOCUMENTOS ASOCIADOS",
      100,
      finalY + 8,
      "center",
    );

    doc.roundedRect(
      5,
      finalY + 10,
      doc.internal.pageSize.width - 10,
      10,
      2,
      2,
      "S",
    );

    autoTable(doc, {
      head: [["Identificación del documento", "Descripción"]],
      theme: "plain",
      headStyles: {
        fontSize: 7,
      },
      columnStyles: {
        0: {
          cellWidth: 60,
        },
      },
      body: [["", ""]],
      startY: finalY + 10,
    });
  }

  finalY = (
    doc as unknown as {
      lastAutoTable: { finalY: number };
    }
  ).lastAutoTable.finalY;

  if (ventaTercero !== null && ventaTercero) {
    returnBoldText(doc, "VENTA A CUENTA DE TERCEROS", 100, finalY, "center");

    doc.roundedRect(
      5,
      finalY + 2,
      doc.internal.pageSize.width - 10,
      10,
      2,
      2,
      "S",
    );

    autoTable(doc, {
      head: [["NIT", "Nombre, denominación o razón social"]],
      theme: "plain",
      headStyles: {
        fontSize: 7,
      },
      columnStyles: {
        0: {
          cellWidth: 60,
        },
      },
      body: [["", ""]],
      startY: finalY + 2,
    });
  }

  finalY =
    (
      doc as unknown as {
        lastAutoTable: { finalY: number };
      }
    ).lastAutoTable.finalY + 10;

  finalYFirstPage = finalY;

  const array_object: unknown[] = [];
  cuerpoDocumento
    .filter((item) => item.descripcion !== "PROPINA")
    .map((prd) => {
      array_object.push(
        Object.values({
          qty: prd.cantidad,
          desc: prd.descripcion,
          price: formatCurrency(prd.precioUni),
          descu: formatCurrency(prd.montoDescu),
          noGrav: formatCurrency(prd.noGravado),
          vtGrav: formatCurrency(prd.ventaGravada),
        }),
      );
    });

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
        "PRECIO",
        "DESCUENTO",
        "NO GRAVADO",
        "GRAVADO",
      ],
    ],
    showHead: false,
    body: array_object as unknown as RowInput[],
    columnStyles: {
      0: { cellWidth: 20, halign: "center" },
      1: { cellWidth: 60 },
      2: {
        cellWidth: 30,
        halign: "right",
      },
      3: {
        cellWidth: 30,
        halign: "right",
      },
      4: {
        cellWidth: 30,
        halign: "right",
      },
      5: {
        halign: "right",
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

  finalY = (
    doc as unknown as {
      lastAutoTable: { finalY: number };
    }
  ).lastAutoTable.finalY;
  const result = doc.internal.pageSize.height - finalY;
  if (result < 50) {
    doc.addPage();
    finalY = 20;
  }

  const pageCount = doc.internal.pages.length - 1;

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    await headerDoc(
      doc,
      svfe11,
      logo,
      canInvertName,
      splitNameInTwoLines,
      shortName,
    );

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
    doc.roundedRect(
      85,
      i > 1 ? 35 : finalYFirstPage,
      30,
      i === 1
        ? rectHeight - 50
        : i === pageCount
          ? rectHeight - 50
          : rectHeight,
      0,
      0,
      "S",
    );
    doc.roundedRect(
      145,
      i > 1 ? 35 : finalYFirstPage,
      30,
      i === 1
        ? rectHeight - 50
        : i === pageCount
          ? rectHeight - 50
          : rectHeight,
      0,
      0,
      "S",
    );
    //all
    doc.roundedRect(
      margin,
      i !== 1 ? 35 : finalYFirstPage,
      rectWidth,
      rectHeight - (i !== 1 ? 0 : pageCount === 1 ? 0 : 50),
      radius,
      radius,
      "S",
    );
    // end all

    doc.setFillColor("#ced4da");
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
          "PRECIO",
          "DESCUENTO",
          "NO GRAVADO",
          "GRAVADO",
        ],
      ],
      columnStyles: {
        0: { cellWidth: 20, halign: "center" },
        1: { cellWidth: 70 },
        2: {
          cellWidth: 30,
          halign: "right",
        },
        3: {
          cellWidth: 30,
          halign: "right",
        },
        4: {
          cellWidth: 30,
          halign: "right",
        },
        5: {
          halign: "right",
        },
      },
      headStyles: {
        textColor: [0, 0, 0],
        fontStyle: "bold",
        halign: "center",
        fontSize: 5,
      },
      body: [["", "", "", "", "", "", ""]],
      margin: {
        right: 5,
        left: 5,
      },
    });
    if (pageCount > 1 && i === pageCount) {
      doc.line(5, rectMargin, doc.internal.pageSize.getWidth() - 5, rectMargin);
      doc.line(
        5,
        rectMargin + 7,
        doc.internal.pageSize.getWidth() - 5,
        rectMargin + 7,
      );
      footerDocument(doc, rectMargin, svfe11);
      doc.line(125, rectHeight + 35, 125, rectMargin + 7);
    }

    if (pageCount === 1) {
      doc.line(5, rectMargin, doc.internal.pageSize.getWidth() - 5, rectMargin);
      doc.line(
        5,
        rectMargin + 7,
        doc.internal.pageSize.getWidth() - 5,
        rectMargin + 7,
      );
      footerDocument(doc, rectMargin, svfe11);
      doc.line(
        125,
        doc.internal.pageSize.height - 48,
        125,
        doc.internal.pageSize.height - 5,
      );
    }

    if (contingence) {
      doc.setFontSize(20);
      doc.setTextColor(255, 0, 0);
      doc.text(
        "CONTINGENCIA",
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height / 2,
        { align: "center", angle: 45 },
      );
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(6);
    }
  }

  return doc.output("arraybuffer");
};

export const footerDocument = (
  doc: jsPDF,
  rectMargin: number,
  svfe01: DteExp,
) => {
  const { resumen } = svfe01 as DteExp;

  doc.text(`${resumen.totalLetras}`, 10, rectMargin + 4);
  doc.text("SUMA DE VENTAS:", 120, rectMargin + 4);
  doc.text(`$${" "} ${" "} ${resumen.totalGravada}`, 195, rectMargin + 4);
  doc.setFontSize(5.5);
  doc.text(
    "-No se aceptan cambios ni devoluciones despues de 2 dias. Producto Chino no tiene cambio ni devolucion",
    10,
    rectMargin + 10,
  );

  const textBig =
    "-Revisar bien su mercaderia, una vez recibidos los productos no se admitiran cambios ni devoluciones en producto abierto, usado, manipulado o fuera de su empaque";

  doc.text(doc.splitTextToSize(textBig, 100), 10, rectMargin + 14);

  doc.setFontSize(6);

  returnBoldText(doc, "ENTREGADO POR:", 10, rectMargin + 20);
  returnBoldText(doc, "NOMBRE:  ________________________", 10, rectMargin + 24);
  returnBoldText(
    doc,
    "DUI:  _____________________________",
    10,
    rectMargin + 28,
  );
  returnBoldText(
    doc,
    "FIRMA: ___________________________",
    10,
    rectMargin + 32,
  );
  returnBoldText(doc, "TELEFONO: _______________________", 10, rectMargin + 36);

  returnBoldText(doc, "RECIBIDO POR:", 80, rectMargin + 20);
  returnBoldText(doc, "NOMBRE:  ________________________", 80, rectMargin + 26);
  returnBoldText(
    doc,
    "DUI:  _____________________________",
    80,
    rectMargin + 29,
  );
  returnBoldText(
    doc,
    "FIRMA: ___________________________",
    80,
    rectMargin + 32,
  );
  returnBoldText(doc, "TELEFONO: _______________________", 80, rectMargin + 35);

  returnBoldText(doc, "Observaciones:", 10, rectMargin + 43);

  const texts = [
    "Total gravada: ",
    "Descuento: ",
    "Total descuento: ",
    "Monto total operacion: ",
    "Total no gravado: ",
    "Total a pagar: ",
    "Flete: ",
    "Seguro: ",
  ];

  for (let i = 0; i < 8; i++) {
    doc.text("$", 185, rectMargin + i * 3 + 10);
  }

  for (let [i, text] of texts.entries()) {
    doc.text(text, 127, rectMargin + i * 3 + 10);
  }

  const totals = [
    resumen.totalGravada.toFixed(2),
    resumen.descuento.toFixed(2),
    resumen.totalDescu.toFixed(2),
    resumen.montoTotalOperacion.toFixed(2),
    resumen.totalNoGravado.toFixed(2),
    resumen.totalPagar.toFixed(2),
    resumen.flete.toFixed(2),
    resumen.seguro.toFixed(2),
  ];

  totals.forEach((total, index) => {
    doc.text(total, 202.5, rectMargin + index * 3 + 10, {
      align: "right",
    });
  });
};
