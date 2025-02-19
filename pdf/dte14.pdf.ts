import jsPDF from "jspdf";
import { DteFse } from "../interfaces/dte14";
import autoTable, { RowInput } from "jspdf-autotable";
import { adjustTextInRect, formatAddress, formatCurrency, headerDoc, returnBoldText } from "./utils";

export const generateSvfe14 = async (dte: DteFse, contingence = false) => {
  const doc = new jsPDF();

  doc.setFontSize(6);

  let finalYFirtsPage = 0;

  const { sujetoExcluido, identificacion, respuestaMH } = dte;
  autoTable(doc, {
    margin: {
      left: 10,
      right: 10,
    },
    showHead: false,
    startY: 35,
    body: [
      [`NOMBRE: ${sujetoExcluido.nombre}`, `NRC : ${"-"}`],
      [
        `DIRECCIÓN : ${sujetoExcluido.direccion.complemento} ${formatAddress(
          sujetoExcluido.direccion.departamento,
          sujetoExcluido.direccion.municipio
        )}, El Salvador`,
        `CÓDIGO GENERACIÓN : ${identificacion.codigoGeneracion}`,
      ],
      [`GIRO : ${"-"}`, `NUMERO DE CONTROL : ${identificacion.numeroControl}`],
      [
        `NUMERO DOCUMENTO : ${sujetoExcluido.numDocumento ?? "-"}`,
        `SELLO : ${respuestaMH.selloRecibido}`,
      ],
      [
        `CORREO : ${sujetoExcluido.correo ?? "-"}`,
        `FECHA HORA EMISION : ${identificacion.fecEmi} - ${identificacion.horEmi}`,
      ],
      [
        `TEL : ${sujetoExcluido.telefono ?? "-"}`,
        `MODELO DE FACTURACIÓN : ${contingence ? "Diferido" : "Previo"}`,
      ],
      [
        `CONDICIÓN DE LA OPERACIÓN: CONTADO`,
        `TIPO DE TRANSMISIÓN : ${contingence ? "Por contingencia" : "Normal"}`,
      ],
    ],
    columnStyles: { 0: { cellWidth: 115 }, 1: { cellWidth: 105 } },
    bodyStyles: {
      fontSize: 6.5,
      cellPadding: 0.3,
    },
    theme: "plain",
  });


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

  finalYFirtsPage = finalY + 10;

  const headers = [
    "CANTIDAD",
    "DESCRIPCIÓN",
    "PRECIO UNITARIO",
    "DESCUENTO POR ITEM",
    "COMPRAS",
  ];

  const array_object: unknown[] = [];
  dte.cuerpoDocumento.map((prd) => {
    array_object.push(
      Object.values({
        qty: prd.cantidad,
        desc: prd.descripcion,
        price: formatCurrency(prd.precioUni),
        descu: formatCurrency(prd.montoDescu),
        vtGrav: formatCurrency(prd.compra),
      })
    );
  });

  autoTable(doc, {
    theme: "plain",
    startY: finalYFirtsPage + 10,
    showHead: false,
    margin: {
      right: 5,
      left: 5,
      bottom: doc.internal.pages.length > 1 ? 10 : 55,
      top: 35,
    },
    head: [headers],
    body: array_object as unknown as RowInput[],
    columnStyles: {
      0: { cellWidth: 15, halign: "center", cellPadding: 2 },
      1: { cellWidth: 80, cellPadding: 2 },
      2: {
        cellWidth: 35,
        cellPadding: 2,
      },
      3: {
        cellWidth: 35,
        cellPadding: 2,
      },
      4: {
        cellWidth: "auto",
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
    },
  });

  finalY = (
    doc as unknown as {
      lastAutoTable: { finalY: number };
    }
  ).lastAutoTable.finalY;
  const result = doc.internal.pageSize.height - finalY;
  if (result < 35) {
    doc.addPage();
    finalY = 20;
  }

  const pageCount = doc.internal.pages.length - 1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    await headerDoc(doc, dte);
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
      100,
      i > 1 ? 35 : finalYFirtsPage,
      35,
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
      135,
      i > 1 ? 35 : finalYFirtsPage,
      35,
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
      head: [headers],
      columnStyles: {
        0: { cellWidth: 15, halign: "center", cellPadding: 2 },
        1: { cellWidth: 80, cellPadding: 2 },
        2: {
          cellWidth: 35,
          cellPadding: 2,
        },
        3: {
          cellWidth: 35,
          cellPadding: 2,
        },
        4: {
          cellWidth: "auto",
          cellPadding: 2,
        },
      },
      headStyles: {
        textColor: [0, 0, 0],
        fontStyle: "bold",
        halign: "center",
        fontSize: 5,
      },
      body: [["", "", "", "", "", ""]],
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
      footerDocument(doc, rectMargin, dte);
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
      footerDocument(doc, rectMargin, dte);
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

export const footerDocument = (doc: jsPDF, rectMargin: number, dte: DteFse) => {
  const { resumen } = dte;
  doc.text(`${resumen.totalLetras}`, 10, rectMargin + 4);
  doc.text("SUMA DE VENTAS:", 120, rectMargin + 4);
  doc.text(`$${" "} ${" "} ${resumen.totalCompra}`, 185, rectMargin + 4);
  doc.setFontSize(6);
  returnBoldText(doc, "Observaciones:", 10, rectMargin + 10);
  const { lines: linesObservaciones } = adjustTextInRect(
    doc,
    dte.resumen.observaciones,
    50,
    50,
    115,
    5
  );
  linesObservaciones.forEach((line, i) => {
    doc.text(line, 10, rectMargin + 13 + i * 3);
  });

  doc.text("Suma Total de Operaciones:", 127, rectMargin + 10);
  doc.text("Retención renta:", 127, rectMargin + 13);
  doc.text("IVA retenido 1%:", 127, rectMargin + 16);
  doc.text("Sub-Total:", 127, rectMargin + 19);
  doc.text("Total a Pagar:", 127, rectMargin + 22);

  for (let i = 0; i < 5; i++) {
    doc.text("$", 185, rectMargin + i * 3 + 10);
  }

  const totals = [
    resumen.subTotal.toFixed(2),
    resumen.reteRenta.toFixed(2),
    resumen.ivaRete1.toFixed(2),
    resumen.subTotal.toFixed(2),
    resumen.totalPagar.toFixed(2),
  ];

  totals.forEach((total, index) => {
    doc.text(total, 202.5, rectMargin + index * 3 + 10, {
      align: "right",
    });
  });
};
