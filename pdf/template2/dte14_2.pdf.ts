import jsPDF from "jspdf";
import { nunitoSemibold } from "./fonts/nunito-semibold";
import { nunitoBold } from "./fonts/nunito";
import autoTable from "jspdf-autotable";
import { Icons } from "./icons/icon";
import { DteFse } from "../../interfaces/dte14";
import {
  adjustImage,
  formatAddress,
  formatCurrency,
  generateQRWithColor,
  getHeightText,
  adjustImageWatermark,
} from "../utils";
import { formatDocumentType, formatNameTypeDocument } from "./utils";

interface Props {
  borderColor: string;
  fillColor: string;
  fillColor2: string;
  darkTextColor: string;
  lightTextColor: string;
  tertiaryColor: string;
  svfe14: DteFse;
  logoWidth: number;
  logoHeight: number;
  logo: Uint8Array | string;
  selloInvalidacion: string;
  watermark: Uint8Array | string;
  socialMedia: {
    ignore: boolean;
    instagram: string;
    facebook: string;
    tiktok: string;
    whatsapp: string;
    phone: string;
    website: string;
  };
  showDescActivity?: boolean

}
/**
 * Function to generate svfe14 template 2
 *
 * @async
 * @param {Props} param0
 * @param {string} param0.borderColor
 * @param {string} param0.fillColor
 * @param {string} param0.fillColor2
 * @param {string} param0.darkTextColor
 * @param {string} param0.lightTextColor
 * @param {DteFe} param0.svfe14
 * @param {number} param0.logoWidth
 * @param {number} param0.logoHeight
 * @param {{ instagram: string; facebook: string; tiktok: string; whatsapp: string; phone: string; }} param0.socialMedia
 * @param {*} [param0.logo=""]
 * @param {*} [param0.watermark=""]
 * @returns {unknown}
 */
export const generateSvfe14_2 = async ({
  borderColor,
  fillColor,
  fillColor2,
  darkTextColor,
  lightTextColor,
  tertiaryColor,
  svfe14,
  logoWidth,
  logoHeight,
  socialMedia,
  logo = "",
  watermark = "",
  selloInvalidacion = "",
  showDescActivity = false
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

  const exclude = ["PROPINA", "PROPINA EXTRA"];
  let data = svfe14.cuerpoDocumento.filter(item => !exclude.includes(item.descripcion)).map((item) => [
      item.cantidad,
      item.descripcion,
      item.precioUni,
      item.compra,
    ]);

    if (data.length === 0) {
      data = [[
        "", 
        "       ", 
        "",
         "",
          "", 
          "",
           ""
      ]];
    }

  autoTable(doc, {
    head: [["Cantidad", "Descripción", "Precio unitario", "Total compra"]],
    foot: [["", "", "", "", "", ""]],
    body: [...data],
    showHead: true,
    theme: "plain",
    startY: 425,
    margin: {
      top: 175,
      left: marginX + 10,
      right: marginX + 10,
      bottom: doc.internal.pages.length > 1 ? 10 : 20,
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
      0: { cellWidth: 75, halign: "center", valign: "middle" },
      1: { cellWidth: 500 },
      2: { cellWidth: 90, halign: "center", valign: "middle" },
      3: { cellWidth: 90, halign: "center", valign: "middle" },
    },
    didDrawPage: (data) => {
      doc.setLineWidth(1.2);
      doc.setDrawColor(borderColor);
      doc.line(
        25,
        data.pageNumber === 1 ? 460 : 210,
        793,
        data.pageNumber === 1 ? 460 : 210
      );
    },
  });

  lastY = (
    doc as unknown as {
      lastAutoTable: { finalY: number };
    }
  ).lastAutoTable.finalY;

  const result = doc.internal.pageSize.height - lastY;

  if (result < 200) {
    doc.addPage();
    lastY = 20;
  }

  const icons = new Icons();

  icons.changeFillColor(tertiaryColor);

  const PHONE = await icons.returnBase64Icon("PHONE");
  const INSTAGRAM = await icons.returnBase64Icon("INSTAGRAM");
  const FACEBOOK = await icons.returnBase64Icon("FACEBOOK");
  const TIKTOK = await icons.returnBase64Icon("TIKTOK");
  const WHATSAPP = await icons.returnBase64Icon("WHATSAPP");

  const { resumen } = svfe14;

  autoTable(doc, {
    head: [["", ""]],
    startY: 900,
    theme: "plain",
    margin: { left: marginX + 10, right: marginX + 3 },
    didDrawCell: (data) => {
      if (data.section === "head") {
        if (data.column.index === 0) {
          doc.setLineWidth(1.2);
          doc.setDrawColor(borderColor);
          doc.roundedRect(data.cell.x + 10, data.cell.y, 250, 60, 5, 5, "S");
          doc.setFont("Nunito", "normal");
          doc.setTextColor(darkTextColor);

          const observations = doc.splitTextToSize(
            `Notas: ${resumen.observaciones ? resumen.observaciones : ""}`,
            240
          );
          doc.text(observations, data.cell.x + 15, data.cell.y + 15);

          doc.text("Cantidad en letras: ", data.cell.x + 10, data.cell.y + 80);
          doc.roundedRect(
            data.cell.x + 100,
            data.cell.y + 65,
            350,
            30,
            5,
            5,
            "S"
          );

          doc.text(resumen.totalLetras, data.cell.x + 110, data.cell.y + 85);

          doc.roundedRect(data.cell.x, data.cell.y + 160, 760, 50, 15, 15, "S");

          doc.setFontSize(9);

          doc.setTextColor(tertiaryColor);

          if (socialMedia.ignore === false) {
            const items = [
              { icon: INSTAGRAM, text: socialMedia.instagram },
              { icon: FACEBOOK, text: socialMedia.facebook },
              { icon: TIKTOK, text: socialMedia.tiktok },
              { icon: WHATSAPP, text: socialMedia.whatsapp },
              { icon: PHONE, text: socialMedia.phone },
            ];

            // Filtrar solo los que tienen texto
            const validItems = items.filter(
              (i) => i.text && i.text.trim() !== ""
            );

            // Medidas
            const iconWidth = 14;
            const spacing = 160; // espacio horizontal entre columnas (ajústalo)
            const baseYIcon = data.cell.y + 218;
            const baseYText = data.cell.y + 228;

            // Calcular ancho total para centrar
            const totalWidth = (validItems.length - 1) * spacing;
            const startX =
              data.cell.x + /* ancho de la celda */ (700 - totalWidth) / 2;

            validItems.forEach((item, index) => {
              const x = startX + index * spacing;

              doc.addImage(
                item.icon,
                "PNG",
                x,
                baseYIcon,
                iconWidth,
                iconWidth
              );
              doc.text(item.text, x + 20, baseYText);
            });
          }
          doc.setTextColor(darkTextColor);
        }
        if (data.column.index === 1) {
          doc.setFont("Nunito", "normal");
          doc.setFontSize(8);
          doc.setTextColor(darkTextColor);
          doc.text(
            "Suma total de operación:",
            data.cell.x + 215,
            data.cell.y + 35,
            {
              align: "right",
            }
          );

          let textY = data.cell.y + 50;
          doc.text("Total compra:", data.cell.x + 215, textY, {
            align: "right",
          });
          textY += 15;
          doc.text("IVA retenido:", data.cell.x + 215, textY, {
            align: "right",
          });
          textY += 15;
          doc.text("Retención renta:", data.cell.x + 215, textY, {
            align: "right",
          });
          textY += 15;
          doc.text("TOTAL A PAGAR:", data.cell.x + 215, textY, {
            align: "right",
          });

          doc.setFillColor(fillColor);
          doc.rect(data.cell.x + 220, data.cell.y + 20, 150, 80, "F");

          doc.text(
            String(resumen.subTotal),
            data.cell.x + 230,
            data.cell.y + 35
          );

          let textYTotals = data.cell.y + 50;
          doc.text(String(resumen.totalCompra), data.cell.x + 230, textYTotals);
          textYTotals += 15;
          doc.text(String(resumen.ivaRete1), data.cell.x + 230, textYTotals);
          textYTotals += 15;
          doc.text(String(resumen.reteRenta), data.cell.x + 230, textYTotals);
          textYTotals += 15;
          doc.text(String(resumen.totalPagar), data.cell.x + 230, textYTotals);
        }
      }
    },
  });

  lastY = (
    doc as unknown as {
      lastAutoTable: { finalY: number };
    }
  ).lastAutoTable.finalY;
  const pageCounter = doc.internal.pages.length - 1;

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
        "FAST"
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
      "S"
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
      "S"
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

    doc.line(100, i === 1 ? 420 : 170, 100, lineHeight);

    doc.line(600, i === 1 ? 420 : 170, 600, lineHeight);
    doc.line(700, i === 1 ? 420 : 170, 700, lineHeight);

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
      const offsetY = isFirstPage
        ? hasMultiplePages
          ? pageHeight / 2 + 200
          : pageHeight / 2 + 150
        : pageHeight / 2;

      doc.setFillColor("#ffffff");

      doc.roundedRect(
        centerX - rectWidth / 2,
        offsetY,
        rectWidth,
        rectHeight,
        3,
        3,
        "F"
      );

      doc.text(
        "Documento invalidado: " + selloInvalidacion,
        centerX,
        offsetY + 14,
        {
          align: "center",
        }
      );

      doc.restoreGraphicsState();
    }

    if (isLastPage) {
      doc.setFillColor(fillColor2);

      doc.roundedRect(
        25,
        doc.internal.pageSize.height - 198,
        769,
        20,
        20,
        20,
        "F"
      );
      doc.roundedRect(
        25,
        doc.internal.pageSize.height - 198,
        769,
        10,
        2,
        2,
        "F"
      );
      doc.setFontSize(11);
      doc.setTextColor(lightTextColor);
      doc.text("Suma de ventas:", 600, doc.internal.pageSize.height - 185, {
        align: "left",
      });
      doc.setDrawColor(lightTextColor);
      doc.setFontSize(10);
      doc.line(
        700,
        doc.internal.pageSize.height - 198,
        700,
        doc.internal.pageSize.height - 175
      );
      doc.text(
        String(resumen.totalCompra),
        750,
        doc.internal.pageSize.height - 185,
        {
          align: "center",
        }
      );
    }

    const QR = await generateQRWithColor(svfe14, darkTextColor);

    const { imageBase64, width, height } = await adjustImage(
      logo,
      logoWidth,
      logoHeight
    );

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
              "LOGO"
            );
            doc.setFont("Nunito", "bold");
            doc.setTextColor(darkTextColor);

            let lastY = 110;
            doc.setFontSize(13);
            doc.text(svfe14.emisor.nombre, data.cell.x + 10, lastY);
            lastY += 15;
            doc.setFontSize(10);
            doc.setTextColor(tertiaryColor);
            doc.text("N.I.T: ", data.cell.x + 10, lastY);
            doc.setFont("Nunito", "normal");
            doc.text(svfe14.emisor.nit, data.cell.x + 40, lastY);
            doc.setFont("Nunito", "bold");
            doc.text("N.R.C: ", data.cell.x + 150, lastY);
            doc.setFont("Nunito", "normal");
            doc.text(svfe14.emisor.nrc, data.cell.x + 180, lastY);
            doc.setTextColor(darkTextColor);
            doc.setFont("Nunito", "bold");
            lastY += 15;
            doc.setFontSize(8);
            doc.setFont("Nunito", "normal");
            if (showDescActivity) {
              doc.text(`Actividad económica: ${svfe14.emisor.descActividad}`, data.cell.x + 10, lastY);
              lastY += 10;
            }

            const address = doc.splitTextToSize(
              formatAddress(
                svfe14.emisor.direccion.departamento,
                svfe14.emisor.direccion.municipio
              ) +
              " " +
              svfe14.emisor.direccion.complemento,
              380
            );

            const textH = getHeightText(doc, address);

            doc.text(address, data.cell.x + 10, lastY);
            lastY += textH + 2;
            doc.text(svfe14.emisor.correo, data.cell.x + 10, lastY);
            doc.text(socialMedia.website, data.cell.x + 150, lastY);
          }
          if (data.column.index === 1) {
            doc.setLineWidth(1.2);
            doc.setDrawColor(borderColor);
            doc.roundedRect(
              data.cell.x - 5,
              data.cell.y + 5,
              data.cell.width,
              130,
              15,
              15,
              "S"
            );

            doc.setFont("Nunito", "bold");
            doc.setFontSize(15);
            doc.setTextColor(tertiaryColor);
            doc.text(
              "Documento Tributario Electrónico",
              data.cell.x + 200,
              data.cell.y + 20,
              { align: "center" }
            );
            doc.setFont("Nunito", "normal");
            doc.setFontSize(8);
            doc.text(
              formatDocumentType(svfe14.identificacion.tipoDte),
              data.cell.x + 200,
              data.cell.y + 32,
              { align: "center" }
            );
            doc.setTextColor(darkTextColor);
            doc.addImage(
              QR,
              "PNG",
              data.cell.x + 5,
              data.cell.y + 40,
              80,
              80,
              "QR",
              "FAST"
            );

            let lastY = data.cell.y + 25 + 18;
            doc.setFontSize(8);
            doc.setFont("Nunito", "normal");
            doc.setTextColor(darkTextColor);
            doc.text("Código de generación:", data.cell.x + 95, lastY);
            doc.setFillColor(fillColor);
            doc.rect(data.cell.x + 180, lastY - 8, 190, 13, "F");
            doc.setFontSize(7.5);
            doc.text(
              svfe14.identificacion.codigoGeneracion,
              data.cell.x + 185,
              lastY + 1
            );
            lastY += 21;
            doc.setFontSize(8);
            doc.text("Número de control de DTE:", data.cell.x + 95, lastY);
            doc.setFillColor(fillColor);
            doc.rect(data.cell.x + 197, lastY - 8, 173, 13, "F");
            doc.setFontSize(7.5);
            doc.text(
              svfe14.identificacion.numeroControl,
              data.cell.x + 200,
              lastY + 1
            );
            lastY += 21;
            doc.setFontSize(8);
            doc.text("Sello de recepción:", data.cell.x + 95, lastY);
            doc.setFillColor(fillColor);
            doc.rect(data.cell.x + 167, lastY - 8, 203, 13, "F");
            doc.setFontSize(7.5);
            doc.text(
              svfe14.respuestaMH.selloRecibido ?? "",
              data.cell.x + 170,
              lastY + 1
            );
            lastY += 18;
            doc.setFontSize(7);
            doc.setTextColor(darkTextColor);
            doc.text(
              "Tipo de transmisión             Modelo de facturación             Fecha y hora generación",
              data.cell.x + 240,
              lastY,
              { align: "center" }
            );
            doc.setFontSize(7.5);
            doc.text("Normal", data.cell.x + 125, lastY + 8);
            doc.text("Previo", data.cell.x + 225, lastY + 8);
            doc.text(
              `${svfe14.identificacion.fecEmi} - ${svfe14.identificacion.horEmi}`,
              data.cell.x + 293,
              lastY + 8
            );
            doc.setLineWidth(1);
            doc.line(
              data.cell.x + 185,
              lastY + 1,
              data.cell.x + 185,
              lastY + 12
            );
            doc.line(
              data.cell.x + 280,
              lastY + 1,
              data.cell.x + 280,
              lastY + 12
            );
            doc.setFillColor(fillColor);
            doc.rect(data.cell.x + 172, lastY + 12, 120, 13, "F");
            doc.setFontSize(7);
            doc.text("Moneda: ", data.cell.x + 195, lastY + 21);
            doc.text(
              svfe14.identificacion.tipoMoneda,
              data.cell.x + 225,
              lastY + 21
            );
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
                "S"
              );
              doc.setFillColor(fillColor);
              doc.roundedRect(
                data.cell.x + 100,
                data.cell.y + 30,
                665,
                210,
                15,
                15,
                "F"
              );
              doc.setFont("Nunito", "normal");
              doc.setFontSize(11.5);
              doc.setTextColor(darkTextColor);
              let lastY = data.cell.y + 40;
              const paddingX = data.cell.x + 15;
              doc.text("Cliente: ", paddingX, lastY);
              doc.text(svfe14.sujetoExcluido.nombre, paddingX + 100, lastY + 3);
              lastY += 30;
              const actEco = doc.splitTextToSize("Actividad Economica: ", 100);
              doc.text("-", paddingX + 100, lastY);
              doc.text(actEco, paddingX, lastY);
              lastY += 35;
              doc.text("Dirección: ", paddingX, lastY);
              const address = doc.splitTextToSize(
                doc.splitTextToSize(
                  svfe14.sujetoExcluido.direccion
                    ? formatAddress(
                      svfe14.sujetoExcluido.direccion.departamento,
                      svfe14.sujetoExcluido.direccion.municipio
                    ) +
                    ", " +
                    svfe14.sujetoExcluido.direccion.complemento
                    : "",
                  600
                ),
                700
              );
              doc.text(address, paddingX + 100, lastY);
              lastY += 40;
              doc.text(
                doc.splitTextToSize("Tipo de documento: ", 100),
                paddingX,
                lastY - 10
              );
              doc.text(
                svfe14.sujetoExcluido.tipoDocumento
                  ? formatNameTypeDocument(svfe14.sujetoExcluido.tipoDocumento)
                  : "-",
                paddingX + 100,
                lastY
              );
              lastY += 30;
              doc.text(
                doc.splitTextToSize("Numero de documento: ", 100),
                paddingX,
                lastY - 5
              );
              doc.text(
                svfe14.sujetoExcluido.numDocumento ?? "-",
                paddingX + 100,
                lastY
              );
              lastY += 35;
              doc.text("Correo: ", paddingX, lastY);
              doc.text(svfe14.sujetoExcluido.correo, paddingX + 100, lastY);
              lastY += 25;
              const nomCom = doc.splitTextToSize("NRC: ", 80);
              doc.text(nomCom, paddingX, lastY);
              doc.text("-", paddingX + 100, lastY);

              doc.setFillColor(fillColor2);
              doc.rect(data.cell.x + 60, data.cell.y + 243, 130, 17, "F");
              doc.setTextColor("#ffffff");
              doc.text(
                "Condiciones de pago: ",
                data.cell.x + 70,
                data.cell.y + 255
              );
              doc.setTextColor(darkTextColor);
              doc.text(
                resumen.condicionOperacion === 1 ? "Contado" : "Credito",
                data.cell.x + 200,
                data.cell.y + 255
              );
            }
          }
        },
      });
    }
  }

  return doc.output("arraybuffer");
};
