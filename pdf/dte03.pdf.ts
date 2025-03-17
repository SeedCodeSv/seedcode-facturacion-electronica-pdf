import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  headerDoc,
  returnBoldText,
  secondHeader,
  tableHeaders,
  tableProduct,
} from "./utils";
import { DteCcf } from "../interfaces/dte03";

export const generateSvfe03 = async (
  svfe03: DteCcf,
  logo: Uint8Array | string = "",
  selloInvalidacion: string = "",
  contingence: boolean = false,
  canInvertName: boolean = false
) => {
  const doc = new jsPDF();

  let finalYFirtsPage = 0;

  doc.setFontSize(6);
  secondHeader(doc, svfe03, selloInvalidacion, contingence);

  let finalY = (doc as unknown as { lastAutoTable: { finalY: number } })
    .lastAutoTable.finalY;

  const startY = 35;
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
    "S"
  );

  finalY = (
    doc as unknown as {
      lastAutoTable: { finalY: number };
    }
  ).lastAutoTable.finalY;

  returnBoldText(doc, "OTROS DOCUMENTOS ASOCIADOS", 100, finalY + 8, "center");

  doc.roundedRect(
    5,
    finalY + 10,
    doc.internal.pageSize.width - 10,
    10,
    2,
    2,
    "S"
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

  finalY = (
    doc as unknown as {
      lastAutoTable: { finalY: number };
    }
  ).lastAutoTable.finalY;

  returnBoldText(doc, "VENTA A CUENTA DE TERCEROS", 100, finalY, "center");

  doc.roundedRect(
    5,
    finalY + 2,
    doc.internal.pageSize.width - 10,
    10,
    2,
    2,
    "S"
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

  finalY = (
    doc as unknown as {
      lastAutoTable: { finalY: number };
    }
  ).lastAutoTable.finalY;

  returnBoldText(doc, "DOCUMENTOS RELACIONADOS", 100, finalY, "center");

  doc.roundedRect(
    5,
    finalY + 2,
    doc.internal.pageSize.width - 10,
    10,
    2,
    2,
    "S"
  );

  const { documentoRelacionado } = svfe03 as DteCcf;

  autoTable(doc, {
    head: [["Tipo de Documento", "N° de Documento", "Fecha de Documento"]],
    theme: "plain",
    headStyles: {
      fontSize: 7,
    },
    columnStyles: {
      0: {
        cellWidth: 60,
      },
      1: {
        cellWidth: "auto",
      },
      2: {
        cellWidth: 60,
      },
    },
    body:
    documentoRelacionado && documentoRelacionado.length > 0
        ? documentoRelacionado.map((prd) => [
            prd.tipoDocumento,
            prd.numeroDocumento,
            prd.fechaEmision,
          ])
        : [["", "", ""]],
    startY: finalY + 2,
  });

  finalY = (
    doc as unknown as {
      lastAutoTable: { finalY: number };
    }
  ).lastAutoTable.finalY;

  finalYFirtsPage = finalY;

  tableProduct(doc, svfe03, finalY);

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
    await headerDoc(doc, svfe03, logo, canInvertName);
    const margin = 5;
    const rectWidth = doc.internal.pageSize.getWidth() - 2 * margin;
    const radius = 2;
    const rectHeight =
      doc.internal.pageSize.getHeight() -
      (i > 1 ? 35 : finalYFirtsPage) -
      margin +
      (i > 1 ? 0 : pageCount > 1 ? 50 : 0);

    const rectMargin = doc.internal.pageSize.getHeight() - 50 - margin;

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(0, 0, 0);
    doc.setFillColor("#ced4da");
    doc.roundedRect(
      85,
      i > 1 ? 35 : finalYFirtsPage,
      20,
      i === 1
        ? rectHeight - 50
        : i === pageCount
        ? rectHeight - 50
        : rectHeight,
      0,
      0,
      "S"
    );
    doc.roundedRect(
      125,
      i > 1 ? 35 : finalYFirtsPage,
      20,
      i === 1
        ? rectHeight - 50
        : i === pageCount
        ? rectHeight - 50
        : rectHeight,
      0,
      0,
      "S"
    );
    doc.roundedRect(
      165,
      i !== 1 ? 35 : finalYFirtsPage,
      20,
      i === 1
        ? rectHeight - 50
        : i === pageCount
        ? rectHeight - 50
        : rectHeight,
      0,
      0,
      "S"
    );
    //all
    doc.roundedRect(
      margin,
      i !== 1 ? 35 : finalYFirtsPage,
      rectWidth,
      rectHeight - (i !== 1 ? 0 : pageCount === 1 ? 0 : 50),
      radius,
      radius,
      "S"
    );

    doc.setFillColor("#ced4da");
    doc.roundedRect(
      margin,
      i !== 1 ? 35 : finalYFirtsPage,
      rectWidth,
      8,
      radius,
      radius,
      "FD"
    );
    autoTable(doc, {
      startY: i !== 1 ? 35 : finalYFirtsPage,
      theme: "plain",
      head: [tableHeaders],
      columnStyles: {
        0: { cellWidth: 15, halign: "center", cellPadding: 2 },
        1: { cellWidth: 65, cellPadding: 2 },
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
        6: { cellWidth: 20, cellPadding: 2 },
        7: { cellPadding: 2 },
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
        rectMargin + 7
      );
      footerDocument(doc, rectMargin, svfe03);
      doc.line(125, rectHeight + 35, 125, rectMargin + 7);
    }

    if (pageCount === 1) {
      doc.line(5, rectMargin, doc.internal.pageSize.getWidth() - 5, rectMargin);
      doc.line(
        5,
        rectMargin + 7,
        doc.internal.pageSize.getWidth() - 5,
        rectMargin + 7
      );
      footerDocument(doc, rectMargin, svfe03);
      doc.line(
        125,
        doc.internal.pageSize.height - 48,
        125,
        doc.internal.pageSize.height - 5
      );
    }
  }

  return doc.output("arraybuffer");
};

export const footerDocument = (doc: jsPDF, rectMargin: number, ccf: DteCcf) => {
  const resumen = ccf.resumen;
  doc.text(`${resumen.totalLetras}`, 10, rectMargin + 4);
  doc.text("SUMA DE VENTAS:", 120, rectMargin + 4);
  doc.text(`$${" "} ${" "} ${resumen.totalNoSuj}`, 145, rectMargin + 4);
  doc.text(`$${" "} ${" "} ${resumen.totalExenta}`, 165, rectMargin + 4);
  doc.text(`$${" "} ${" "} ${resumen.totalGravada}`, 185, rectMargin + 4);
  doc.setFontSize(6);
  returnBoldText(doc, "Responsable por parte del emisor:", 10, rectMargin + 15);

  returnBoldText(doc, "N° de Documento:", 10, rectMargin + 25);
  returnBoldText(doc, "Observaciones:", 10, rectMargin + 35);
  returnBoldText(
    doc,
    "Responsable por parte del receptor:",
    65,
    rectMargin + 15
  );

  returnBoldText(doc, "N° de Documento:", 65, rectMargin + 25);

  doc.text("Suma Total de Operaciones:", 127, rectMargin + 10);
  doc.text(
    "Monto global Desc., Rebajas y otros a ventas no sujetas: ",
    127,
    rectMargin + 13
  );
  doc.text(
    "Monto global Desc., Rebajas y otros a ventas exentas:",
    127,
    rectMargin + 16
  );
  doc.text(
    "Monto global Desc., Rebajas y otros a ventas gravadas:",
    127,
    rectMargin + 19
  );
  doc.text("IVA 13%: ", 127, rectMargin + 22);
  doc.text("Sub-Total: ", 127, rectMargin + 25);
  doc.text("IVA Percibido: ", 127, rectMargin + 28);
  doc.text("IVA Retenido: ", 127, rectMargin + 31);
  doc.text("Retención Renta: ", 127, rectMargin + 34);
  doc.text("Monto Total de la Operación: ", 127, rectMargin + 37);
  doc.text("Total Otros montos no afectos: ", 127, rectMargin + 40);
  doc.text("Total a Pagar: ", 127, rectMargin + 43);

  for (let i = 0; i < 12; i++) {
    doc.text("$", 185, rectMargin + i * 3 + 10);
  }

  const totals = [
    resumen.descuGravada.toFixed(2),
    resumen.descuNoSuj.toFixed(2),
    resumen.descuExenta.toFixed(2),
    resumen.descuGravada.toFixed(2),
    resumen.tributos
      ? resumen.tributos
          .map((tr) => Number(tr.valor))
          .reduce((a, b) => a + b)
          .toFixed(2)
      : "0.00",
    resumen.subTotal.toFixed(2),
    resumen.ivaPerci1.toFixed(2),
    resumen.ivaRete1.toFixed(2),
    resumen.reteRenta.toFixed(2),
    resumen.montoTotalOperacion.toFixed(2),
    "0.00",
    resumen.totalPagar.toFixed(2),
  ];

  totals.forEach((total, index) => {
    doc.text(total, 202.5, rectMargin + index * 3 + 10, {
      align: "right",
    });
  });
};
