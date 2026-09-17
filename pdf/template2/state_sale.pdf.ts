import jsPDF from "jspdf";
import { nunitoBold } from "./fonts/nunito";
import { nunitoSemibold } from "./fonts/nunito-semibold";
import { adjustImage, adjustImageWatermark, getHeightText } from "../utils";
import autoTable from "jspdf-autotable";
import { AccountStateEmisor, AccountStateReceptor, AccountStateResumen } from "./account_state.pdf";

export interface AccountStateSale {
  fecha: string;
  noPago: string;
  estado: string;
  metodoPago: string;
  montoAnterior: number;
  montoPago: number;
  nuevoMonto: number;
  proximoPago: string;
}

export interface AccountStateSaleProps {
  borderColor: string;
  fillColor: string;
  fillColor2: string;
  darkTextColor: string;
  lightTextColor: string;
  tertiaryColor: string;
  logoWidth: number;
  logoHeight: number;
  logo: Uint8Array | string;
  watermark: Uint8Array | string;
  emisor: AccountStateEmisor;
  receptor: AccountStateReceptor;
  movimientos: AccountStateSale[];
  resumen: AccountStateResumen;
  codGeneracion: string;
}

export const generateStateSale = async ({
  tertiaryColor,
  darkTextColor,
  logo,
  logoHeight,
  logoWidth,
  borderColor,
  fillColor,
  watermark = "",
  emisor,
  receptor,
  movimientos,
  resumen,
  codGeneracion,
}: AccountStateSaleProps) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    compress: true,
    format: [816.38, 1057.33],
  });

  doc.addFileToVFS("Nunito-bold.ttf", nunitoBold);
  doc.addFont("Nunito-bold.ttf", "Nunito", "bold");

  doc.addFileToVFS("Nunito-semibold.ttf", nunitoSemibold);
  doc.addFont("Nunito-semibold.ttf", "Nunito", "normal");

  const marginX = 15;
  const marginY = 15;
  const tableWidth = doc.internal.pageSize.width - marginX * 2;
  const tableHeight = doc.internal.pageSize.height - marginY * 2;
  const radius = 15;

  let lastY =
    (
      doc as unknown as {
        lastAutoTable: { finalY: number };
      }
    ).lastAutoTable?.finalY ?? 0;

  const data = movimientos.map((m) => [
    m.fecha,
    m.noPago,
    m.estado,
    m.metodoPago,
    `$${m.montoAnterior}`,
    `$${m.montoPago}`,
    `$${m.nuevoMonto}`,
    m.proximoPago,
  ]);

  autoTable(doc, {
    head: [
      [
        "Fecha",
        "No. pago",
        "Estado",
        "Método de pago",
        "Monto anterior",
        "Monto de pago",
        "Nuevo monto",
        "Próximo pago",
      ],
    ],
    foot: [["", "", "", "", "", "", "", ""]],
    body: [...data],
    showHead: true,
    theme: "plain",
    startY: 425,
    margin: {
      top: 175,
      left: marginX + 10,
      right: marginX + 10,
      bottom: doc.internal.pages.length > 1 ? 10 : 55,
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
      0: { cellWidth: 70, halign: "center", valign: "middle" },
      1: { cellWidth: 90, halign: "center", valign: "middle" },
      2: { cellWidth: 80, halign: "center", valign: "middle" },
      3: { cellWidth: 170, halign: "center", valign: "middle" },
      4: { cellWidth: 90, halign: "center", valign: "middle" },
      5: { cellWidth: 90, halign: "center", valign: "middle" },
      6: { cellWidth: 90, halign: "center", valign: "middle" },
      7: { cellWidth: 86, halign: "center", valign: "middle" },
    },
    didDrawPage: (data) => {
      doc.setLineWidth(1.2);
      doc.setDrawColor(borderColor);
      doc.line(
        25,
        data.pageNumber === 1 ? 460 : 210,
        793,
        data.pageNumber === 1 ? 460 : 210,
      );
    },
  });

  lastY = (
    doc as unknown as {
      lastAutoTable: { finalY: number };
    }
  ).lastAutoTable.finalY;

  const result = doc.internal.pageSize.height - lastY;

  if (result < 250) {
    doc.addPage();
    lastY = 20;
  }

  const startY = 900;
  const gap = 6;
  const startX = marginX + 10;
  const endX = doc.internal.pageSize.getWidth() - marginX - 8;

  const availableWidth = endX - startX;
  const boxCount = 3;
  const boxWidth = (availableWidth - gap * (boxCount - 1)) / boxCount;
  const boxHeight = 80;

  const boxes = [
    { label: "TOTAL CREDITO", value: `$${resumen.totalCredito.toFixed(2)}` },
    { label: "TOTAL PAGADO", value: `$${resumen.totalPagado.toFixed(2)}` },
    { label: "TOTAL PENDIENTE", value: `$${resumen.totalPendiente.toFixed(2)}` },
  ];

  boxes.forEach((box, index) => {
    const x = startX + index * (boxWidth + gap);

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);
    doc.setDrawColor(borderColor);
    doc.roundedRect(x, startY, boxWidth, boxHeight, 10, 10, "S");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(darkTextColor);
    doc.text(box.label, x + boxWidth / 2, startY + (boxHeight / 2) - 15, {
      align: "center",
    });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(darkTextColor);
    doc.text(box.value, x + boxWidth / 2, startY + (boxHeight / 2) + 5, {
      align: "center",
    });
  });

  const pageCounter = doc.internal.pages.length - 1;

  const { imageBase64, width, height } = await adjustImage(
    logo,
    logoWidth,
    logoHeight,
  );

  for (let i = 1; i <= pageCounter; i++) {
    doc.setPage(i);
    const isFirstPage = i === 1;
    const isLastPage = i === doc.internal.pages.length - 1;
    const hasMultiplePages = doc.internal.pages.length - 1 > 1;

    if (watermark !== "") {
      doc.saveGraphicsState();
      doc.setGState(doc.GState({ opacity: 0.1 }));

      const adjustedImage = await adjustImageWatermark(watermark, 300, 300);

      doc.addImage(
        adjustedImage.imageBase64,
        "PNG",
        doc.internal.pageSize.width / 2 - 150,
        isFirstPage
          ? hasMultiplePages
            ? doc.internal.pageSize.width / 2 + 100
            : doc.internal.pageSize.width / 2 + 50
          : doc.internal.pageSize.width / 2,
        adjustedImage.width,
        adjustedImage.height,
        "KEY" + i,
        "FAST",
      );
      doc.restoreGraphicsState();
    }

    doc.setLineWidth(1.2);
    doc.setDrawColor(borderColor);
    doc.roundedRect(
      marginX,
      marginY,
      tableWidth,
      tableHeight,
      radius,
      radius,
      "S",
    );

    doc.roundedRect(
      25,
      i === 1 ? 420 : 170,
      768,
      i === 1
        ? doc.internal.pages.length - 1 > 1
          ? 600
          : 450
        : i === doc.internal.pages.length - 1
          ? 700
          : doc.internal.pageSize.height - 200,
      15,
      15,
      "S",
    );

    let lineHeight: number;

    if (isFirstPage) {
      lineHeight = hasMultiplePages
        ? doc.internal.pageSize.height - 38
        : doc.internal.pageSize.height - 190;
    } else if (isLastPage) {
      lineHeight = doc.internal.pageSize.height - 198;
    } else {
      lineHeight = doc.internal.pageSize.height - 30;
    }

    doc.line(95, i === 1 ? 420 : 160, 95, lineHeight);
    doc.line(185, i === 1 ? 420 : 170, 185, lineHeight);
    doc.line(265, i === 1 ? 420 : 170, 265, lineHeight);
    doc.line(435, i === 1 ? 420 : 170, 435, lineHeight);
    doc.line(525, i === 1 ? 420 : 170, 525, lineHeight);
    doc.line(615, i === 1 ? 420 : 170, 615, lineHeight);
    doc.line(705, i === 1 ? 420 : 170, 705, lineHeight);

    autoTable(doc, {
      head: [["", ""]],
      showHead: true,
      startY: marginY + 3,
      theme: "plain",
      margin: { left: marginX + 3, right: marginX + 3 },
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
            doc.setTextColor(darkTextColor);

            let lastY = 110;
            doc.setFontSize(13);
            doc.text(emisor.nombre, data.cell.x + 10, lastY);
            lastY += 15;
            doc.setFontSize(10);
            doc.setTextColor(tertiaryColor);
            doc.text("N.I.T: ", data.cell.x + 10, lastY);
            doc.setFont("Nunito", "normal");
            doc.text(emisor.nit, data.cell.x + 40, lastY);
            doc.setFont("Nunito", "bold");
            doc.text("N.R.C: ", data.cell.x + 150, lastY);
            doc.setFont("Nunito", "normal");
            doc.text(emisor.nrc, data.cell.x + 180, lastY);
            doc.setTextColor(darkTextColor);
            doc.setFont("Nunito", "bold");
            lastY += 15;
            doc.setFontSize(8);
            doc.setFont("Nunito", "normal");

            const address = doc.splitTextToSize(emisor.direccion, 700);

            const textH = getHeightText(doc, address);

            doc.text(address, data.cell.x + 10, lastY);
            lastY += textH + 2;
            doc.text(emisor.correo, data.cell.x + 10, lastY);
            doc.text(emisor.web, data.cell.x + 150, lastY);
          }
          if (data.column.index === 1) {
            doc.setFont("Nunito", "bold");
            doc.setFontSize(15);
            doc.setTextColor(tertiaryColor);
            doc.text(
              "ESTADO DE CUENTAS",
              data.cell.x + 200,
              data.cell.y + 20,
              { align: "center" },
            );
            doc.setFont("Nunito", "normal");
            doc.setFontSize(10);
            doc.text("CODIGO DE GENERACION:", data.cell.x + 200, data.cell.y + 32, {
              align: "center",
            });
            doc.setFontSize(8.5);
            doc.text(codGeneracion, data.cell.x + 200, data.cell.y + 44, {
              align: "center",
            });
            doc.setFontSize(8);
          }
        }
      },
    });

    if (i === 1) {
      lastY = (
        doc as unknown as {
          lastAutoTable: { finalY: number };
        }
      ).lastAutoTable.finalY;
      autoTable(doc, {
        head: [[""]],
        showHead: true,
        startY: lastY + 110,
        theme: "plain",
        margin: { left: marginX + 3, right: marginX + 3 },
        didDrawCell: (data) => {
          if (data.section === "head") {
            if (data.column.index === 0) {
              doc.setLineWidth(1.2);
              doc.setDrawColor(borderColor);
              doc.roundedRect(
                data.cell.x + 5,
                data.cell.y + 15,
                data.cell.width - 10,
                245,
                15,
                15,
                "S",
              );
              doc.setFillColor(fillColor);
              doc.roundedRect(
                data.cell.x + 100,
                data.cell.y + 30,
                665,
                210,
                15,
                15,
                "F",
              );
              doc.setFont("Nunito", "normal");
              doc.setFontSize(11.5);
              doc.setTextColor(darkTextColor);
              let lastY = data.cell.y + 40;
              const paddingX = data.cell.x + 15;
              doc.text("Cliente: ", paddingX, lastY);
              doc.text(receptor.nombre, paddingX + 100, lastY + 3);
              lastY += 30;
              const actEco = doc.splitTextToSize("Actividad Economica: ", 100);
              doc.text(receptor.actividadEconomica, paddingX + 100, lastY);
              doc.text(actEco, paddingX, lastY);
              lastY += 35;
              doc.text("Dirección: ", paddingX, lastY);

              const address = doc.splitTextToSize(
                doc.splitTextToSize(receptor.direccion, 600),
                700,
              );
              doc.text(address, paddingX + 100, lastY);
              lastY += 40;
              doc.text(
                doc.splitTextToSize("Tipo de documento: ", 100),
                paddingX,
                lastY - 10,
              );
              doc.text(receptor.tipoDocumento, paddingX + 100, lastY);
              lastY += 30;
              doc.text(
                doc.splitTextToSize("Numero de documento: ", 100),
                paddingX,
                lastY - 5,
              );
              doc.text(receptor.numDocumento, paddingX + 100, lastY);
              lastY += 35;
              doc.text("Correo: ", paddingX, lastY);
              doc.text(receptor.correo, paddingX + 100, lastY);
              lastY += 25;
              const nomCom = doc.splitTextToSize("NRC: ", 80);
              doc.text(nomCom, paddingX, lastY);
              doc.text(receptor.nrc, paddingX + 100, lastY);
            }
          }
        },
      });
    }
  }

  return doc.output("arraybuffer");
};
