import jsPDF from "jspdf";
import { nunitoBold } from "./fonts/nunito";
import { nunitoSemibold } from "./fonts/nunito-semibold";
import { adjustImage, adjustImageWatermark, getHeightText } from "../utils";
import autoTable from "jspdf-autotable";

interface Props {
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
}

export const generatePayment = async ({
  tertiaryColor,
  darkTextColor,
  logo,
  logoHeight,
  logoWidth,
  borderColor,
  fillColor,
  lightTextColor,
  fillColor2,
  watermark = "",
}: Props) => {
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

  const data = [
    [
      "2026-09-14",
      "3C8D7207-68A1-43EE-91F3-A13E786665A2",
      "PENDIENTE",
      "$285",
      "$265",
      "$550",
      "-",
    ],
  ];

  autoTable(doc, {
    head: [
      [
        "Fecha",
        "Cod. referencia",
        "Estado",
        "Monto pagado",
        "Monto pendiente",
        "Total credito",
        "Proximo pago",
      ],
    ],
    foot: [["", "", "", "", "", ""]],
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
      1: { cellWidth: 350 },
      2: { cellWidth: 70, halign: "center", valign: "middle" },
      3: { cellWidth: 70, halign: "center", valign: "middle" },
      4: { cellWidth: 70, halign: "center", valign: "middle" },
      5: { cellWidth: 70, halign: "center", valign: "middle" },
      6: { cellWidth: 70, halign: "center", valign: "middle" },
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

  // Configuración general de las 4 cajas
  const startY = 900;
  const gap = 6;
  const startX = marginX + 10;
  const endX = doc.internal.pageSize.getWidth() - marginX - 8; // ajusta a tu margen derecho real

  const availableWidth = endX - startX;
  const boxCount = 3;
  const boxWidth = (availableWidth - gap * (boxCount - 1)) / boxCount;
  const boxHeight = 80;

  const boxes = [
    { label: "TOTAL CREDITO", value: "$1,250.00" },
    { label: "TOTAL PAGADO", value: "$800.00" },
    { label: "TOTAL PENDIENTE", value: "$450.00" },
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
    doc.text(box.label, x + boxWidth / 2,  startY + (boxHeight /2) -15, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(darkTextColor);
    doc.text(box.value, x + boxWidth / 2, startY + (boxHeight /2) + 5, { align: "center" });
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
    doc.line(445, i === 1 ? 420 : 170, 445, lineHeight);
    doc.line(515, i === 1 ? 420 : 170, 515, lineHeight);
    doc.line(585, i === 1 ? 420 : 170, 585, lineHeight);
    doc.line(655, i === 1 ? 420 : 170, 655, lineHeight);
    doc.line(725, i === 1 ? 420 : 170, 725, lineHeight);

    if (isLastPage) {
      doc.setFillColor(fillColor2);

      doc.roundedRect(
        25,
        doc.internal.pageSize.height - 198,
        769,
        20,
        20,
        20,
        "F",
      );
      doc.roundedRect(
        25,
        doc.internal.pageSize.height - 198,
        769,
        10,
        30,
        0,
        "F",
      );
      doc.setFontSize(11);
      doc.setTextColor(lightTextColor);
      doc.text("Suma de ventas:", 420, doc.internal.pageSize.height - 185, {
        align: "left",
      });
      doc.setDrawColor(lightTextColor);
      doc.line(
        515,
        doc.internal.pageSize.height - 198,
        515,
        doc.internal.pageSize.height - 178,
      );
      doc.setFontSize(10);
      doc.text("$100", 550, doc.internal.pageSize.height - 185, {
        align: "center",
      });
      doc.line(
        585,
        doc.internal.pageSize.height - 198,
        585,
        doc.internal.pageSize.height - 178,
      );
      doc.text("$100", 620, doc.internal.pageSize.height - 185, {
        align: "center",
      });
      doc.line(
        655,
        doc.internal.pageSize.height - 198,
        655,
        doc.internal.pageSize.height - 178,
      );
      doc.text("$100", 690, doc.internal.pageSize.height - 185, {
        align: "center",
      });
      doc.line(
        725,
        doc.internal.pageSize.height - 198,
        725,
        doc.internal.pageSize.height - 178,
      );
      doc.text("$100", 760, doc.internal.pageSize.height - 185, {
        align: "center",
      });
    }

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
            doc.text("ROCA SUNZAL, S.A. DE C.V.", data.cell.x + 10, lastY);
            lastY += 15;
            doc.setFontSize(10);
            doc.setTextColor(tertiaryColor);
            doc.text("N.I.T: ", data.cell.x + 10, lastY);
            doc.setFont("Nunito", "normal");
            doc.text("06142604061017", data.cell.x + 40, lastY);
            doc.setFont("Nunito", "bold");
            doc.text("N.R.C: ", data.cell.x + 150, lastY);
            doc.setFont("Nunito", "normal");
            doc.text("1715826", data.cell.x + 180, lastY);
            doc.setTextColor(darkTextColor);
            doc.setFont("Nunito", "bold");
            lastY += 15;
            doc.setFontSize(8);
            doc.setFont("Nunito", "normal");

            const address = doc.splitTextToSize(
              "La Libertad, LA LIBERTAD COSTA, TAMANIQUE, Carretera Litoral, playa Sunzal, km. 42 1/2, Tamanique, La Libertad.",
              700,
            );

            const textH = getHeightText(doc, address);

            doc.text(address, data.cell.x + 10, lastY);
            lastY += textH + 2;
            doc.text("info@rocasunzal.com", data.cell.x + 10, lastY);
            doc.text("www.rocasunzal.com", data.cell.x + 150, lastY);
          }
          if (data.column.index === 1) {
            doc.setFont("Nunito", "bold");
            doc.setFontSize(15);
            doc.setTextColor(tertiaryColor);
            doc.text("ESTADO DE CUENTAS", data.cell.x + 200, data.cell.y + 20, {
              align: "center",
            });
            doc.setFont("Nunito", "normal");
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
              doc.text(
                "CARLOS DANIEL CONTRERAS HERNANDEZ",
                paddingX + 100,
                lastY + 3,
              );
              lastY += 30;
              const actEco = doc.splitTextToSize("Actividad Economica: ", 100);
              doc.text("-", paddingX + 100, lastY);
              doc.text(actEco, paddingX, lastY);
              lastY += 35;
              doc.text("Dirección: ", paddingX, lastY);

              const address = doc.splitTextToSize(
                doc.splitTextToSize(
                  "La Libertad, LA LIBERTAD COSTA, TAMANIQUE, Carretera Litoral, playa Sunzal, km. 42 1/2, Tamanique, La Libertad.",
                  600,
                ),
                700,
              );
              doc.text(address, paddingX + 100, lastY);
              lastY += 40;
              doc.text(
                doc.splitTextToSize("Tipo de documento: ", 100),
                paddingX,
                lastY - 10,
              );
              doc.text("DUI", paddingX + 100, lastY);
              lastY += 30;
              doc.text(
                doc.splitTextToSize("Numero de documento: ", 100),
                paddingX,
                lastY - 5,
              );
              doc.text("062017584", paddingX + 100, lastY);
              lastY += 35;
              doc.text("Correo: ", paddingX, lastY);
              doc.text("contrerasdannnielgmail.com", paddingX + 100, lastY);
              lastY += 25;
              const nomCom = doc.splitTextToSize("NRC: ", 80);
              doc.text(nomCom, paddingX, lastY);
              doc.text("-", paddingX + 100, lastY);
            }
          }
        },
      });
    }
  }

  return doc.output("arraybuffer");
};
