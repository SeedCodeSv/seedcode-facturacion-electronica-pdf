import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { nunitoBold } from "../template2/fonts/nunito";
import { nunitoSemibold } from "../template2/fonts/nunito-semibold";
import { formatDocumentType } from "../template2/utils";
import { adjustImage, generateQRFromText } from "../utils";

export const generateSvfe01_3 = async (logo: Uint8Array | string) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    compress: true,
    format: [816.38, 1057.33],
  });

  const lineColor = "#c8b6ff";
  const fillColor = "#edf2fb";

  doc.addFileToVFS("Nunito-bold.ttf", nunitoBold);
  doc.addFont("Nunito-bold.ttf", "Nunito", "bold");

  doc.addFileToVFS("Nunito-semibold.ttf", nunitoSemibold);
  doc.addFont("Nunito-semibold.ttf", "Nunito", "normal");

  const pageCounter = doc.internal.pages.length - 1;

  const marginX = 15;
  const marginY = 15;

  const QR = await generateQRFromText(
    "https://www.youtube.com/watch?v=gOMhN-hfMtY&list=RDgOMhN-hfMtY&start_radio=1",
    fillColor,
  );
  const { imageBase64, width, height } = await adjustImage(logo, 400, 400);

  autoTable(doc, {
    startY: 375,
    theme: "plain",
    margin: { left: marginX + 3, right: marginX + 3, top: 375, bottom: 400 },
    head: [
      [
        "CANT. ",
        "DESCRIPCIÓN",
        "PRECIO UNIT.",
        "DESC. ITEM",
        "OTROS MONTOS",
        "NO SUJETAS",
        "GRAVADAS",
      ],
    ],
    body: Array.from({ length: 20 }).map((_, index) => {
      return ["1", "JUGO DE NARANJA", "1", "1", "1", "1", "1"];
    }),
    headStyles: {
      minCellHeight: 10,
    },
    columnStyles: {
      0: {
        cellWidth: 50,
      },
      1: {
        cellWidth: 300,
      },
      2: {
        cellWidth: 85,
        valign: "middle",
        halign: "center",
      },
      3: {
        cellWidth: 85,
        valign: "middle",
        halign: "center",
      },
      4: {
        cellWidth: 85,
        valign: "middle",
        halign: "center",
      },
      5: {
        cellWidth: 85,
        valign: "middle",
        halign: "center",
      },
      6: {
        cellWidth: 85,
        valign: "middle",
        halign: "center",
      },
    },
    didDrawCell(data) {
      doc.setDrawColor(lineColor);
      const x = data.table.settings.margin.left;
      const w = data.table.columns.reduce((sum, col) => sum + col.width, 0);
      const y = data.table.settings.startY;
      doc.line(x, y + 30, w + 15, y + 30);
      doc.roundedRect(x, y - 10, w, 300, 15, 15, "S");
      doc.setFillColor(fillColor);
      doc.roundedRect(x, y + 280, w, 20, 20, 20, "F");
      doc.roundedRect(x, y + 280, w, 10, 30, 0, "F");

      doc.line(x + 50, y - 10, x + 50, y + 300);
      doc.line(x + 350, y - 10, x + 350, y + 300);
      doc.line(x + 435, y - 10, x + 435, y + 300);
      doc.line(x + 520, y - 10, x + 520, y + 300);
      doc.line(x + 605, y - 10, x + 605, y + 300);
      doc.line(x + 690, y - 10, x + 690, y + 300);

      if (data.section === "body") {
        doc.setDrawColor("#f8f9fa");
        doc.setLineWidth(0.3);

        doc.line(
          data.cell.x,
          data.cell.y + data.cell.height,
          data.cell.x + data.cell.width,
          data.cell.y + data.cell.height,
        );
      }
    },
    didDrawPage() {
      autoTable(doc, {
        showHead: "everyPage",
        head: [["", "", ""]],
        theme: "plain",
        margin: { left: marginX + 3, right: marginX + 3 },
        startY: 10,
        headStyles: {
          minCellHeight: 150,
        },
        columnStyles: {
          0: {
            cellWidth: "wrap",
          },
          1: {
            cellWidth: 400,
          },
        },
        didDrawCell: (data) => {
          if (data.section === "head") {
            if (data.column.index === 0) {
              doc.addImage(
                imageBase64,
                "PNG",
                data.cell.x + 10,
                data.cell.y + 10,
                width,
                height,
                "LOGO",
              );

              doc.setFont("Nunito", "bold");
              let lastY = 110;
              doc.setFontSize(13);
              doc.text(
                "GEES, SOCIEDAD ANÓNIMA DE CAPITAL VARIABLE",
                data.cell.x + 10,
                lastY,
              );
              lastY += 15;
              doc.setFontSize(10);
              doc.text("LEGENDS AT THE PIER", data.cell.x + 10, lastY);
              lastY += 15;
              doc.setFontSize(10);
              doc.text(
                "Actividad Económica: Restaurantes",
                data.cell.x + 10,
                lastY,
              );
              lastY += 15;
              doc.setFontSize(10);
              doc.text(
                "Dirección: Nuevo Muelle Turístico del Puerto de La Libertad, La Libertad Costa, La Libertad, El Salvador",
                data.cell.x + 10,
                lastY,
              );
              lastY += 15;
              doc.setFontSize(10);
              doc.text("Teléfono: 6859-7499", data.cell.x + 10, lastY);
            }
            if (data.column.index === 2) {
              doc.setDrawColor(lineColor);
              doc.roundedRect(
                data.cell.x - 5,
                data.cell.y + 25,
                data.cell.width,
                120,
                15,
                15,
                "S",
              );
              const centerX = data.cell.x + data.cell.width / 2;
              doc.setFont("Nunito", "bold");
              doc.setFontSize(15);

              doc.text(
                "Documento Tributario Electrónico",
                centerX,
                data.cell.y + 55,
                { align: "center" },
              );
              doc.setFont("Nunito", "normal");
              doc.setFontSize(8);
              doc.text(formatDocumentType("01"), centerX, data.cell.y + 70, {
                align: "center",
              });
              doc.setFont("Nunito", "bold");
              doc.setFontSize(12);
              doc.text("N.I.T:", data.cell.x + 10, data.cell.y + 90);
              doc.text("N.R.C:", data.cell.x + 10, data.cell.y + 120);
            }
          }
        },
      });

      let lastY = (
        doc as unknown as {
          lastAutoTable: { finalY: number };
        }
      ).lastAutoTable.finalY;

      autoTable(doc, {
        startY: lastY + 20,
        theme: "plain",
        margin: { left: marginX + 3, right: marginX + 3 },
        head: [[""]],
        didDrawCell(data) {
          if (data.section === "head") {
            if (data.column.index === 0) {
              doc.setLineWidth(1.2);
              doc.setDrawColor(lineColor);
              doc.roundedRect(
                data.cell.x + 5,
                data.cell.y + 15,
                data.cell.width - 10,
                150,
                15,
                15,
                "S",
              );
              doc.setFillColor(fillColor);
              const x = data.cell.x + 5;
              const y = data.cell.y + 15;
              const w = data.cell.width - 10;

              doc.roundedRect(x, y, w, 20, 20, 20, "F");
              doc.rect(x, y + 10, w, 10, "F");
              doc.setFont("Nunito", "bold");
              doc.setFontSize(11);
              doc.text("DATOS DEL RECEPTOR Y DOCUMENTO", x + 10, y + 15);

              autoTable(doc, {
                startY: data.cell.y + 40,
                theme: "plain",
                margin: { left: 30, right: 30 },
                bodyStyles: { fontSize: 10, cellPadding: 4 },
                body: [
                  [
                    { content: "Cliente:", styles: { fontStyle: "bold" } },
                    { content: "CLIENTE VARIOS" },
                    {
                      content: "Código Generación:",
                      styles: { fontStyle: "bold" },
                    },
                    { content: "D3FAFETE-6E5C-478B-ADA6-4C1A092A2BFF" },
                  ],
                  [
                    { content: "Dirección:", styles: { fontStyle: "bold" } },
                    { content: "SANTA ANA CENTRO, SANTA ANA, El Salvador" },
                    {
                      content: "Número de Control:",
                      styles: { fontStyle: "bold" },
                    },
                    { content: "DTE-01-M001P001-000000000010398" },
                  ],
                  [
                    {
                      content: "Correo Electrónico: ",
                      styles: { fontStyle: "bold" },
                    },
                    { content: "seedcode2025@gmail.com" },
                    {
                      content: "Sello de Recepción: ",
                      styles: { fontStyle: "bold" },
                    },
                    { content: "2026FB7E5B68628447E9AB346125CF20513BDHZU" },
                  ],
                  [
                    { content: "Teléfono: ", styles: { fontStyle: "bold" } },
                    { content: "00000000" },
                    {
                      content: "Fecha Emisión: ",
                      styles: { fontStyle: "bold" },
                    },
                    { content: "2026-07-21 12:17:01" },
                  ],
                  [
                    { content: "Modelo: ", styles: { fontStyle: "bold" } },
                    { content: "Previo" },
                    {
                      content: "Transmisión: ",
                      styles: { fontStyle: "bold" },
                    },
                    { content: "Normal" },
                  ],
                ],
              });
            }
          }
        },
      });

      const footerY = doc.internal.pageSize.height - 370;

      autoTable(doc, {
        startY: footerY,
        columnStyles: {
          0: { cellWidth: 480 },
          1: { cellWidth: 300 },
        },
        margin: { left: marginX + 3, right: marginX + 3 },
        head: [["", [""]]],
        theme: "plain",
        body: [["", ""]],
        didDrawCell(data) {
          if (data.section === "head") {
            if (data.column.index === 0) {
              const x = data.cell.x + 5;
              const y = data.cell.y + 10;
              const w = data.cell.width - 10;

              doc.setFillColor("#caf0f8");
              doc.roundedRect(x, y, w, 25, 0, 0, "F");
              doc.setFillColor(fillColor);
              doc.roundedRect(x, y, 2, 25, 0, 0, "F");
              doc.text("SON: OCHO 00/100 DÓLARES AMERICANOS", x + 10, y + 15);

              doc.addImage(
                QR,
                "PNG",
                data.cell.x + 5,
                data.cell.y + 40,
                140,
                140,
                "QR",
                "FAST",
              );
              doc.setFont("Nunito", "bold");
              doc.setFontSize(12);
              doc.text(
                "Consulta de Documento Tributario Electrónico",
                data.cell.x + 155,
                data.cell.y + 60,
              );
              const desct = doc.splitTextToSize(
                "Este documento es una representación gráfica de un Documento Tributario Electrónico (DTE) emitido según la normativa del Ministerio de Hacienda de El Salvador.",
                300,
              );
              doc.setFont("Nunito", "normal");
              doc.text(desct, data.cell.x + 155, data.cell.y + 90);

              // doc.text("Responsable por Receptor: ", 400, data.cell.y + 210, {
              //   align: "center",
              // });
              doc.setDrawColor(lineColor);
              doc.roundedRect(
                data.cell.x + 5,
                data.cell.y + 185,
                460,
                70,
                15,
                15,
                "S",
              );

              doc.setFillColor("#edf2fb");
              doc.roundedRect(
                data.cell.x + 5 + 480,
                data.cell.y + 10,
                290,
                250,
                5,
                5,
                "F",
              );
              doc.setDrawColor(lineColor);
              doc.roundedRect(
                data.cell.x + 5,
                data.cell.y + 185 + 90,
                765,
                70,
                15,
                15,
                "S",
              );
              //  doc.roundedRect(
              //   100,
              //   data.cell.y + 210,
              //   130,
              //   data.cell.y + 210,
              //   15,
              //   15,
              //   "S",
              // );
            }
          }
        },
      });
    },
  });

  for (let i = 1; i <= pageCounter; i++) {
    doc.setPage(i);
  }

  return doc.output("arraybuffer");
};
