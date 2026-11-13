import { drawDeliveryFooter } from "./footer";
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
  canInvertName: boolean = false,
) => {
  const doc = new jsPDF();

  let finalYFirtsPage = 0;

  doc.setFontSize(6);
  secondHeader(doc, svfe03, selloInvalidacion, contingence);

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

  const { documentoRelacionado, ventaTercero, otrosDocumentos } =
    svfe03 as DteCcf;

  finalY = (
    doc as unknown as {
      lastAutoTable: { finalY: number };
    }
  ).lastAutoTable.finalY;

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
      body: otrosDocumentos.map((documento) => [
        documento.descDocumento ?? "-",
        documento.detalleDocumento ?? "-",
      ]),
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
      body: [[ventaTercero.nit ?? "-", ventaTercero.nombre]],
      startY: finalY + 2,
    });
  }

  finalY = (
    doc as unknown as {
      lastAutoTable: { finalY: number };
    }
  ).lastAutoTable.finalY;

  if (documentoRelacionado !== null && documentoRelacionado.length > 0) {
    returnBoldText(doc, "DOCUMENTOS RELACIONADOS", 100, finalY, "center");

    doc.roundedRect(
      5,
      finalY + 2,
      doc.internal.pageSize.width - 10,
      15,
      2,
      2,
      "S",
    );

    autoTable(doc, {
      head: [["Tipo de Documento", "N° de Documento", "Fecha de Documento"]],
      theme: "plain",
      headStyles: {
        fontSize: 7,
      },
      bodyStyles: {
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
          : [["-", "-", "-"]],
      startY: finalY + 2,
    });
  }

  finalY =
    (
      doc as unknown as {
        lastAutoTable: { finalY: number };
      }
    ).lastAutoTable.finalY + 10;

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
      "S",
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
      "S",
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
      "S",
    );
    //all
    doc.roundedRect(
      margin,
      i !== 1 ? 35 : finalYFirtsPage,
      rectWidth,
      rectHeight - (i !== 1 ? 0 : pageCount === 1 ? 0 : 50),
      radius,
      radius,
      "S",
    );

    doc.setFillColor("#ced4da");
    doc.roundedRect(
      margin,
      i !== 1 ? 35 : finalYFirtsPage,
      rectWidth,
      8,
      radius,
      radius,
      "FD",
    );
    autoTable(doc, {
      startY: i !== 1 ? 35 : finalYFirtsPage,
      theme: "plain",
      head: [tableHeaders],
      columnStyles: {
        0: { cellWidth: 15, halign: "center" },
        1: { cellWidth: 65 },
        2: {
          cellWidth: 20,
        },
        3: {
          cellWidth: 20,
        },
        4: {
          cellWidth: 20,
        },
        5: {
          cellWidth: 20,
        },
        6: { cellWidth: 20 },
        7: {},
      },
      headStyles: {
        textColor: [0, 0, 0],
        fontStyle: "bold",
        halign: "center",
        fontSize: 5,
      },
      bodyStyles: {
        cellPadding: 1,
      },
      body: [["", "", "", "", "", "", ""]],
      margin: {
        right: 5,
        left: 5,
      }
    });
    if (pageCount > 1 && i === pageCount) {
      doc.line(5, rectMargin, doc.internal.pageSize.getWidth() - 5, rectMargin);
      doc.line(
        5,
        rectMargin + 7,
        doc.internal.pageSize.getWidth() - 5,
        rectMargin + 7,
      );
      footerDocument(doc, rectMargin, svfe03);
      doc.setPage(i);
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
      footerDocument(doc, rectMargin, svfe03);
      doc.setPage(i);
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

export const footerDocument = (doc: jsPDF, rectMargin: number, ccf: DteCcf) => {
  const resumen = ccf.resumen;
  doc.text(resumen.totalLetras ?? "", 10, rectMargin + 4);
  doc.text("SUMA DE VENTAS:", 120, rectMargin + 4);
  doc.text(`$${" "} ${" "} ${resumen.totalNoSuj}`, 145, rectMargin + 4);
  doc.text(`$${" "} ${" "} ${resumen.totalExenta}`, 165, rectMargin + 4);
  doc.text(`$${" "} ${" "} ${resumen.totalGravada}`, 185, rectMargin + 4);
  doc.setFontSize(6);
  const totals: [string, number][] = [
    ["Suma Total de Operaciones:", resumen.subTotalVentas],
    ["Monto global Desc., Rebajas y otros a ventas no sujetas:", resumen.descuNoSuj],
    ["Monto global Desc., Rebajas y otros a ventas exentas:", resumen.descuExenta],
    ["Monto global Desc., Rebajas y otros a ventas gravadas:", resumen.descuGravada],
    ["IVA 13%:", (resumen.tributos ?? []).filter((tributo) => tributo.codigo === "20")
      .reduce((total, tributo) => total + tributo.valor, 0)],
    ["Sub-Total:", resumen.subTotal],
    ["IVA Percibido:", resumen.ivaPerci],
    ["IVA Retenido:", resumen.ivaRete],
    ["Monto Total de la Operación:", resumen.montoTotalOperacion],
    ["Total no gravado:", resumen.totalNoGravado],
    ["Total a Pagar:", resumen.totalPagar],
  ];

  totals.forEach(([label, total], index) => {
    const y = rectMargin + index * 3 + 10;
    doc.text(label, 127, y);
    doc.text("$", 185, y);
    doc.text(total.toFixed(2), 202.5, y, { align: "right" });
  });

  drawDeliveryFooter(doc, rectMargin, { observaciones: resumen.observaciones });
};
