import jsPDF from "jspdf";
import { nunitoSemibold } from "./fonts/nunito-semibold";
import { nunitoBold } from "./fonts/nunito";
import autoTable from "jspdf-autotable";
import { Icons } from "./icons/icon";
import { DteFe } from "../../interfaces/dte01";
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
  svfe01: DteFe;
  logoWidth: number;
  logoHeight: number;
  logo: Uint8Array | string;
  selloInvalidacion: string;
  watermark: Uint8Array | string;
  socialMedia: {
    instagram: string;
    facebook: string;
    tiktok: string;
    whatsapp: string;
    phone: string;
  };
}
/**
 * Function to generate svfe01 template 2
 *
 * @async
 * @param {Props} param0
 * @param {string} param0.borderColor
 * @param {string} param0.fillColor
 * @param {string} param0.fillColor2
 * @param {string} param0.darkTextColor
 * @param {string} param0.lightTextColor
 * @param {DteFe} param0.svfe01
 * @param {number} param0.logoWidth
 * @param {number} param0.logoHeight
 * @param {{ instagram: string; facebook: string; tiktok: string; whatsapp: string; phone: string; }} param0.socialMedia
 * @param {*} [param0.logo=""]
 * @param {*} [param0.watermark=""]
 * @returns {unknown}
 */
export const generateSvfe01_2 = async ({
  borderColor,
  fillColor,
  fillColor2,
  darkTextColor,
  lightTextColor,
  tertiaryColor,
  svfe01,
  logoWidth,
  logoHeight,
  socialMedia,
  logo = "",
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

  const data = svfe01.cuerpoDocumento
    .filter((item) => item.descripcion !== "PROPINA")
    .map((item) => [
      item.cantidad,
      item.descripcion,
      item.precioUni,
      item.ventaNoSuj,
      item.ventaExenta,
      item.ventaGravada,
    ]);

  autoTable(doc, {
    head: [
      [
        "Cantidad",
        "Descripción",
        "Precio unitario",
        "Ventas no sujetas",
        "Ventas exentas",
        "Ventas gravadas",
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
      0: { cellWidth: 75, halign: "center", valign: "middle" },
      1: { cellWidth: 380 },
      2: { cellWidth: 70, halign: "center", valign: "middle" },
      3: { cellWidth: 80, halign: "center", valign: "middle" },
      4: { cellWidth: 75, halign: "center", valign: "middle" },
      5: { cellWidth: 80, halign: "center", valign: "middle" },
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

  if (result < 250) {
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

  const { resumen, extension } = svfe01;

  autoTable(doc, {
    head: [["", ""]],
    startY: 800,
    theme: "plain",
    margin: { left: marginX + 10, right: marginX + 3 },
    didDrawCell: (data) => {
      if (data.section === "head") {
        if (data.column.index === 0) {
          doc.setLineWidth(1.2);
          doc.setDrawColor(borderColor);
          doc.roundedRect(data.cell.x, data.cell.y - 5, 250, 110, 15, 15, "S");
          doc.setFont("Nunito", "normal");
          doc.setTextColor(darkTextColor);
          const observations = doc.splitTextToSize(
            `Notas: ${extension ? extension.observaciones : ""}`,
            225
          );
          doc.text(observations, data.cell.x + 10, data.cell.y + 20);

          doc.text("Cantidad en letras: ", data.cell.x + 10, data.cell.y + 125);
          doc.roundedRect(
            data.cell.x + 100,
            data.cell.y + 110,
            350,
            30,
            5,
            5,
            "S"
          );

          doc.text(resumen.totalLetras, data.cell.x + 110, data.cell.y + 127);

          doc.roundedRect(data.cell.x, data.cell.y + 160, 760, 50, 15, 15, "S");

          doc.setFontSize(9);

          doc.text(
            `Nombre entrega: ${extension ? extension.nombEntrega : ""}`,
            data.cell.x + 10,
            data.cell.y + 179
          );
          doc.text(
            `Documento entrega: ${extension ? extension.docuEntrega : ""}`,
            data.cell.x + 10,
            data.cell.y + 195
          );
          doc.text(
            `Nombre recibe: ${extension ? extension.nombRecibe : ""}`,
            data.cell.x + 450,
            data.cell.y + 179
          );
          doc.text(
            `Documento recibe: ${extension ? extension.docuRecibe : ""}`,
            data.cell.x + 450,
            data.cell.y + 195
          );

          doc.setTextColor(tertiaryColor)

          doc.addImage(
            INSTAGRAM,
            "PNG",
            data.cell.x + 10,
            data.cell.y + 218,
            14,
            14
          );
          doc.text(socialMedia.instagram, data.cell.x + 30, data.cell.y + 228);
          doc.addImage(
            FACEBOOK,
            "PNG",
            data.cell.x + 159.2,
            data.cell.y + 218,
            14,
            14
          );
          doc.text(socialMedia.facebook, data.cell.x + 180, data.cell.y + 228);
          doc.addImage(
            TIKTOK,
            "PNG",
            data.cell.x + 318.4,
            data.cell.y + 218,
            14,
            14
          );
          doc.text(socialMedia.tiktok, data.cell.x + 339, data.cell.y + 228);
          doc.addImage(
            WHATSAPP,
            "PNG",
            data.cell.x + 474.6,
            data.cell.y + 218,
            14,
            14
          );
          doc.text(socialMedia.whatsapp, data.cell.x + 495, data.cell.y + 228);
          doc.addImage(
            PHONE,
            "PNG",
            data.cell.x + 633.8,
            data.cell.y + 218,
            14,
            14
          );
          doc.text(socialMedia.phone, data.cell.x + 654, data.cell.y + 228);
          doc.setTextColor(darkTextColor)
        }
        if (data.column.index === 1) {
          doc.setFont("Nunito", "normal");
          doc.setFontSize(8);
          doc.setTextColor(darkTextColor);
          doc.text(
            "Suma total de operación:",
            data.cell.x + 215,
            data.cell.y + 10,
            {
              align: "right",
            }
          );

          let textY = data.cell.y + 22;

          doc.text("Turismo 5%:", data.cell.x + 215, textY, {
            align: "right",
          });
          textY += 12;
          doc.text(
            "Impuesto al Valor Agregado 13%:",
            data.cell.x + 215,
            textY,
            {
              align: "right",
            }
          );
          textY += 12;
          doc.text("Sub-total:", data.cell.x + 215, textY, {
            align: "right",
          });
          textY += 12;
          doc.text("(+) IVA Percepción 1%:", data.cell.x + 215, textY, {
            align: "right",
          });
          textY += 12;
          doc.text("(-) IVA Retención 1%:", data.cell.x + 215, textY, {
            align: "right",
          });
          textY += 12;
          doc.text("Retención renta:", data.cell.x + 215, textY, {
            align: "right",
          });
          textY += 12;
          doc.text("Total operación:", data.cell.x + 215, textY, {
            align: "right",
          });
          textY += 12;
          doc.text("ADVALOREM:", data.cell.x + 215, textY, {
            align: "right",
          });
          textY += 12;
          doc.text("Propina 10%:", data.cell.x + 215, textY, {
            align: "right",
          });
          textY += 12;
          doc.text("Total otros montos no afectos:", data.cell.x + 215, textY, {
            align: "right",
          });
          textY += 12;
          doc.text("TOTAL A PAGAR:", data.cell.x + 215, textY, {
            align: "right",
          });

          doc.setFillColor(fillColor);
          doc.rect(data.cell.x + 220, data.cell.y, 150, 150, "F");

          let tourism = 0;

          if (resumen.tributos && resumen.tributos.length > 0) {
            tourism =
              resumen.tributos.find((tributo) => tributo.codigo === "59")
                ?.valor || 0;
          }

          let valorem = 0;

          if (resumen.tributos && resumen.tributos.length > 0) {
            valorem =
              resumen.tributos.find((tributo) => tributo.codigo === "C5")
                ?.valor || 0;
          }
          let propina =
            svfe01.cuerpoDocumento.find(
              (cuerpo) => cuerpo.descripcion === "PROPINA"
            )?.noGravado ?? 0;

          const noAfectos = resumen.totalExenta + resumen.totalNoSuj;
          doc.text(
            formatCurrency(resumen.subTotal),
            data.cell.x + 230,
            data.cell.y + 10
          );
          let textYTotals = data.cell.y + 22;
          doc.text(formatCurrency(tourism), data.cell.x + 230, textYTotals);
          textYTotals += 12;
          doc.text(
            formatCurrency(resumen.totalIva),
            data.cell.x + 230,
            textYTotals
          );
          textYTotals += 12;
          doc.text(
            formatCurrency(resumen.subTotalVentas),
            data.cell.x + 230,
            textYTotals
          );
          textYTotals += 12;
          doc.text(
            formatCurrency(resumen.ivaPerci1 ?? 0),
            data.cell.x + 230,
            textYTotals
          );
          textYTotals += 12;
          doc.text(
            formatCurrency(resumen.ivaRete1 ?? 0),
            data.cell.x + 230,
            textYTotals
          );
          textYTotals += 12;
          doc.text(
            formatCurrency(resumen.reteRenta),
            data.cell.x + 230,
            textYTotals
          );
          textYTotals += 12;
          doc.text(
            formatCurrency(resumen.montoTotalOperacion),
            data.cell.x + 230,
            textYTotals
          );
          textYTotals += 12;
          doc.text(formatCurrency(valorem), data.cell.x + 230, textYTotals);
          textYTotals += 12;
          doc.text(formatCurrency(propina), data.cell.x + 230, textYTotals);
          textYTotals += 12;
          doc.text(formatCurrency(noAfectos), data.cell.x + 230, textYTotals);
          textYTotals += 12;
          doc.text(
            formatCurrency(resumen.totalPagar),
            data.cell.x + 230,
            textYTotals
          );
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
          : 350
        : i === doc.internal.pages.length - 1
        ? 609
        : doc.internal.pageSize.height - 200,
      15,
      15,
      "S"
    );

    let lineHeight: number;

    if (isFirstPage) {
      lineHeight = hasMultiplePages
        ? doc.internal.pageSize.height - 38
        : doc.internal.pageSize.height - 288;
    } else if (isLastPage) {
      lineHeight = doc.internal.pageSize.height - 278;
    } else {
      lineHeight = doc.internal.pageSize.height - 30;
    }

    doc.line(100, i === 1 ? 420 : 170, 100, lineHeight);
    doc.line(487, i === 1 ? 420 : 170, 487, lineHeight);
    doc.line(553, i === 1 ? 420 : 170, 553, lineHeight);

    doc.line(633, i === 1 ? 420 : 170, 633, lineHeight);
    doc.line(713, i === 1 ? 420 : 170, 713, lineHeight);

    if (isLastPage) {
      doc.setFillColor(fillColor2);

      doc.roundedRect(
        25,
        doc.internal.pageSize.height - 298,
        769,
        20,
        20,
        20,
        "F"
      );
      doc.roundedRect(
        25,
        doc.internal.pageSize.height - 298,
        769,
        10,
        2,
        2,
        "F"
      );
      doc.setFontSize(11);
      doc.setTextColor(lightTextColor);
      doc.text("Suma de ventas:", 460, doc.internal.pageSize.height - 285, {
        align: "left",
      });
      doc.setDrawColor(lightTextColor);
      doc.line(
        553,
        doc.internal.pageSize.height - 298,
        553,
        doc.internal.pageSize.height - 278
      );
      doc.setFontSize(10);
      doc.text(
        formatCurrency(resumen.totalNoSuj),
        595,
        doc.internal.pageSize.height - 285,
        {
          align: "center",
        }
      );
      doc.line(
        633,
        doc.internal.pageSize.height - 298,
        633,
        doc.internal.pageSize.height - 278
      );
      doc.text(
        formatCurrency(resumen.totalExenta),
        670,
        doc.internal.pageSize.height - 285,
        {
          align: "center",
        }
      );
      doc.line(
        713,
        doc.internal.pageSize.height - 298,
        713,
        doc.internal.pageSize.height - 278
      );
      doc.text(
        formatCurrency(resumen.totalGravada),
        750,
        doc.internal.pageSize.height - 285,
        {
          align: "center",
        }
      );
    }

    const QR = await generateQRWithColor(svfe01, darkTextColor);

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
            doc.setFontSize(15);
            doc.text(svfe01.emisor.nombreComercial, data.cell.x + 10, lastY);
            lastY += 15;
            doc.setFontSize(10);
            doc.setTextColor(tertiaryColor);
            doc.text("N.I.T: ", data.cell.x + 10, lastY);
            doc.setFont("Nunito", "normal");
            doc.text(svfe01.emisor.nit, data.cell.x + 40, lastY);
            doc.setFont("Nunito", "bold");
            doc.text("N.R.C: ", data.cell.x + 150, lastY);
            doc.setFont("Nunito", "normal");
            doc.text(svfe01.emisor.nrc, data.cell.x + 180, lastY);
            doc.setTextColor(darkTextColor);
            doc.setFont("Nunito", "bold");
            lastY += 15;
            doc.setFontSize(8);
            doc.setFont("Nunito", "normal");

            const address = doc.splitTextToSize(
              formatAddress(
                svfe01.emisor.direccion.departamento,
                svfe01.emisor.direccion.municipio
              ) +
                " " +
                svfe01.emisor.direccion.complemento,
              380
            );

            const textH = getHeightText(doc, address);

            doc.text(address, data.cell.x + 10, lastY);
            lastY += textH + 2;
            doc.text(svfe01.emisor.correo, data.cell.x + 10, lastY);
            doc.text("www.mirasurf.com", data.cell.x + 150, lastY);
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
            doc.setTextColor(tertiaryColor)
            doc.text(
              "Documento Tributario Electrónico",
              data.cell.x + 200,
              data.cell.y + 20,
              { align: "center" }
            );
            doc.setFont("Nunito", "normal");
            doc.setFontSize(8);
            doc.text(
              formatDocumentType(svfe01.identificacion.tipoDte),
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
              svfe01.identificacion.codigoGeneracion,
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
              svfe01.identificacion.numeroControl,
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
              svfe01.respuestaMH.selloRecibido ?? "",
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
              `${svfe01.identificacion.fecEmi} - ${svfe01.identificacion.horEmi}`,
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
              svfe01.identificacion.tipoMoneda,
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
              doc.text(svfe01.receptor.nombre, paddingX + 100, lastY + 3);
              lastY += 30;
              const actEco = doc.splitTextToSize("Actividad Economica: ", 100);
              doc.text("-", paddingX + 100, lastY);
              doc.text(actEco, paddingX, lastY);
              lastY += 35;
              doc.text("Dirección: ", paddingX, lastY);
              const address = doc.splitTextToSize(
                doc.splitTextToSize(
                  svfe01.receptor.direccion
                    ? formatAddress(
                        svfe01.receptor.direccion.departamento,
                        svfe01.receptor.direccion.municipio
                      ) +
                        ", " +
                        svfe01.receptor.direccion.complemento
                    : "",
                  300
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
                svfe01.receptor.tipoDocumento
                  ? formatNameTypeDocument(svfe01.receptor.tipoDocumento)
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
                svfe01.receptor.numDocumento ?? "-",
                paddingX + 100,
                lastY
              );
              lastY += 35;
              doc.text("Correo: ", paddingX, lastY);
              doc.text(svfe01.receptor.correo, paddingX + 100, lastY);
              lastY += 25;
              const nomCom = doc.splitTextToSize("NRC: ", 80);
              doc.text(nomCom, paddingX, lastY);
              doc.text(svfe01.receptor.nrc ?? "-", paddingX + 100, lastY);

              doc.setFillColor(fillColor2);
              doc.rect(data.cell.x + 60, data.cell.y + 243, 130, 17, "F");
              doc.setTextColor("#ffffff");
              doc.text(
                "Condiciones de pago: ",
                data.cell.x + 70,
                data.cell.y + 255
              );
              doc.setTextColor(darkTextColor);
              doc.text("Contado", data.cell.x + 200, data.cell.y + 255);
            }
          }
        },
      });
    }
  }

  return doc.output("arraybuffer");
};
