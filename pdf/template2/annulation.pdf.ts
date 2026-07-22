import jsPDF from "jspdf";
import { AnnulationSvfe } from "../../interfaces/annulation";
import { nunitoBold } from "./fonts/nunito";
import { nunitoSemibold } from "./fonts/nunito-semibold";
import {
  adjustImage,
  adjustImageWatermark,
  generateQRWithColorAnnulation,
} from "../utils";
import autoTable from "jspdf-autotable";
import {
  formatDocumentType,
  formatDocumentTypeAnnulation,
  formatNameTypeDocument,
  formatTypeAnnulation,
} from "./utils";
import { Icons } from "./icons/icon";

interface Props {
  /**
   * Hex or RGB string for the border color used in the PDF
   */
  borderColor: string;
  /**
   * Primary fill color for elements
   */
  fillColor: string;
  /**
   * Secondary fill color for elements
   */
  fillColor2: string;
  /**
   * Color used for primary (dark) text
   */
  darkTextColor: string;
  /**
   * Color used for lighter text accents
   */
  lightTextColor: string;
  /**
   * Color used for tertiary accents (icons, small text)
   */
  tertiaryColor: string;
  /**
   * Payload object representing an annulation (cancellation) in SVFe format
   */
  svfeAnnulation: AnnulationSvfe;
  /**
   * Desired logo width in points
   */
  logoWidth: number;
  /**
   * Desired logo height in points
   */
  logoHeight: number;
  /**
   * Logo image as a base64 string or Uint8Array
   */
  logo: Uint8Array | string;
  /**
   * Watermark image as a base64 string or Uint8Array
   */
  watermark: Uint8Array | string;
  socialMedia: {
    /**
     * If true, skip rendering social media icons/links
     */
    ignore: boolean;
    instagram: string;
    facebook: string;
    tiktok: string;
    whatsapp: string;
    phone: string;
    website: string;
  };
}

/**
 * Generate an SVFe annulation (cancellation) PDF document.
 * @param props - Configuration and data required to render the PDF
 * @returns A jsPDF document instance containing the generated PDF
 */
export const generateAnnulationSVfe = async ({
  borderColor,
  fillColor,
  fillColor2,
  darkTextColor,
  tertiaryColor,
  svfeAnnulation,
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

  const pageCounter = doc.internal.pages.length - 1;

  const icons = new Icons();

  icons.changeFillColor(tertiaryColor);

  const PHONE = await icons.returnBase64Icon("PHONE");
  const INSTAGRAM = await icons.returnBase64Icon("INSTAGRAM");
  const FACEBOOK = await icons.returnBase64Icon("FACEBOOK");
  const TIKTOK = await icons.returnBase64Icon("TIKTOK");
  const WHATSAPP = await icons.returnBase64Icon("WHATSAPP");

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

    const QR = await generateQRWithColorAnnulation(
      svfeAnnulation,
      darkTextColor,
    );

    const { imageBase64, width, height } = await adjustImage(
      logo,
      logoWidth,
      logoHeight,
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
              "LOGO",
            );
            doc.setFont("Nunito", "bold");
            doc.setTextColor(darkTextColor);

            let lastY = 110;
            doc.setFontSize(13);
            doc.text(svfeAnnulation.emisor.nombre, data.cell.x + 10, lastY);
            lastY += 15;
            doc.setFontSize(10);
            doc.setTextColor(tertiaryColor);
            doc.text("N.I.T: ", data.cell.x + 10, lastY);
            doc.setFont("Nunito", "normal");
            doc.text(svfeAnnulation.emisor.nit, data.cell.x + 40, lastY);
            doc.setFont("Nunito", "bold");
            doc.setTextColor(darkTextColor);
            doc.setFont("Nunito", "bold");
            lastY += 15;
            doc.setFontSize(8);
            doc.setFont("Nunito", "normal");

            lastY += 2;
            doc.text(svfeAnnulation.emisor.correo, data.cell.x + 10, lastY);
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
              "S",
            );

            doc.setFont("Nunito", "bold");
            doc.setFontSize(15);
            doc.setTextColor(tertiaryColor);
            doc.text(
              "Documento Tributario Electrónico",
              data.cell.x + 200,
              data.cell.y + 20,
              { align: "center" },
            );
            doc.setFont("Nunito", "normal");
            doc.setFontSize(8);
            doc.text(
              formatDocumentTypeAnnulation(svfeAnnulation.documento.tipoDte),
              data.cell.x + 200,
              data.cell.y + 32,
              { align: "center" },
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
              "FAST",
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
              svfeAnnulation.identificacion.codigoGeneracion,
              data.cell.x + 185,
              lastY + 1,
            );
            lastY += 21;
            doc.setFontSize(8);
            doc.text("Número de control de DTE:", data.cell.x + 95, lastY);
            doc.setFillColor(fillColor);
            doc.rect(data.cell.x + 197, lastY - 8, 173, 13, "F");
            doc.setFontSize(7.5);
            doc.text(
              svfeAnnulation.documento.numeroControl,
              data.cell.x + 200,
              lastY + 1,
            );
            lastY += 21;
            doc.setFontSize(8);
            doc.text("Sello de recepción:", data.cell.x + 95, lastY);
            doc.setFillColor(fillColor);
            doc.rect(data.cell.x + 167, lastY - 8, 203, 13, "F");
            doc.setFontSize(7.5);
            doc.text(
              svfeAnnulation.selloRecibido ?? "",
              data.cell.x + 170,
              lastY + 1,
            );
            lastY += 18;
            doc.setFontSize(7);
            doc.setTextColor(darkTextColor);
            doc.text(
              "Tipo de transmisión             Modelo de facturación             Fecha y hora generación",
              data.cell.x + 240,
              lastY,
              { align: "center" },
            );
            doc.setFontSize(7.5);
            doc.text("Normal", data.cell.x + 125, lastY + 8);
            doc.text("Previo", data.cell.x + 225, lastY + 8);
            doc.text(
              `${svfeAnnulation.identificacion.fecEmi} - ${svfeAnnulation.identificacion.horEmi}`,
              data.cell.x + 293,
              lastY + 8,
            );
            doc.setLineWidth(1);
            doc.line(
              data.cell.x + 185,
              lastY + 1,
              data.cell.x + 185,
              lastY + 12,
            );
            doc.line(
              data.cell.x + 280,
              lastY + 1,
              data.cell.x + 280,
              lastY + 12,
            );
            doc.setFillColor(fillColor);
            doc.rect(data.cell.x + 172, lastY + 12, 120, 13, "F");
            doc.setFontSize(7);
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
        startY: lastY + 125,
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
                400,
                15,
                15,
                "S",
              );
              doc.setFillColor(fillColor);
              doc.roundedRect(
                data.cell.x + 150,
                data.cell.y + 45,
                615,
                360,
                15,
                15,
                "F",
              );
              doc.setFont("Nunito", "normal");
              doc.setFontSize(11.5);
              doc.setTextColor(darkTextColor);
              let lastY = data.cell.y + 60;
              const paddingX = data.cell.x + 15;
              doc.text("Tipo de documento: ", paddingX, lastY + 10);
              doc.text(
                formatDocumentType(svfeAnnulation.documento.tipoDte),
                paddingX + 150,
                lastY + 10,
              );
              lastY += 45;
              const actEco = doc.splitTextToSize("Código de generación: ", 150);
              doc.text(actEco, paddingX, lastY);
              doc.text(
                svfeAnnulation.documento.codigoGeneracion,
                paddingX + 150,
                lastY,
              );
              lastY += 35;
              doc.text("Número de control: ", paddingX, lastY);
              doc.text(
                svfeAnnulation.documento.numeroControl ?? "-",
                paddingX + 150,
                lastY,
              );
              lastY += 35;
              doc.text(
                doc.splitTextToSize("Sello de recibido: ", 150),
                paddingX,
                lastY,
              );
              doc.text(
                svfeAnnulation.documento.selloRecibido,
                paddingX + 150,
                lastY,
              );
              lastY += 35;
              doc.text(
                doc.splitTextToSize("Fecha de emisión: ", 100),
                paddingX,
                lastY,
              );
              doc.text(svfeAnnulation.documento.fecEmi, paddingX + 150, lastY);
              lastY += 35;
              const codR = doc.splitTextToSize(
                "Cod. generación relacionado: ",
                150,
              );
              doc.text(codR, paddingX, lastY);
              doc.text(
                svfeAnnulation.documento.codigoGeneracionR ?? "-",
                paddingX + 150,
                lastY,
              );
              lastY += 35;
              const nomCom = doc.splitTextToSize("Nombre del receptor: ", 150);
              doc.text(nomCom, paddingX, lastY);
              doc.text(
                svfeAnnulation.documento.nombre ?? "-",
                paddingX + 150,
                lastY,
              );
              lastY += 35;
              const docRep = doc.splitTextToSize(
                "Documento del receptor: ",
                150,
              );
              doc.text(docRep, paddingX, lastY);
              doc.text(
                svfeAnnulation.documento.numDocumento ?? "-",
                paddingX + 150,
                lastY,
              );
              lastY += 35;
              doc.text("Telefono:", paddingX, lastY);
              doc.text(
                svfeAnnulation.documento.telefono ?? "-",
                paddingX + 150,
                lastY,
              );
              lastY += 35;
              doc.text("Correo:", paddingX, lastY);
              doc.text(
                svfeAnnulation.documento.correo ?? "-",
                paddingX + 150,
                lastY,
              );

              doc.setFillColor(fillColor2);
              doc.rect(data.cell.x + 60, data.cell.y + 15, 160, 17, "F");
              doc.setTextColor("#ffffff");
              doc.text(
                "Documento que se invalida",
                data.cell.x + 65,
                data.cell.y + 25,
              );
            }
          }
        },
      });

      autoTable(doc, {
        head: [[""]],
        showHead: true,
        startY: lastY + 550,
        theme: "plain",
        margin: { left: marginX + 3, right: marginX + 3 },
        didDrawCell: (data) => {
          if (data.section === "head") {
            if (data.column.index === 0) {
              doc.setFillColor(fillColor2);
              doc.rect(data.cell.x + 60, data.cell.y + 15, 160, 17, "F");
              doc.setTextColor("#ffffff");
              doc.text(
                "Motivo de la anulación",
                data.cell.x + 65,
                data.cell.y + 25,
              );

              doc.setLineWidth(1.2);
              doc.setDrawColor(borderColor);
              doc.roundedRect(
                data.cell.x + 5,
                data.cell.y + 15,
                data.cell.width - 10,
                110,
                15,
                15,
                "S",
              );
              doc.setFillColor(fillColor);
              doc.roundedRect(
                data.cell.x + 150,
                data.cell.y + 45,
                615,
                70,
                15,
                15,
                "F",
              );
              doc.setFont("Nunito", "normal");
              doc.setFontSize(11.5);
              doc.setTextColor(darkTextColor);
              let lastY = data.cell.y + 50;
              const paddingX = data.cell.x + 15;
              doc.text("Tipo de anulación: ", paddingX, lastY + 10);
              doc.text(
                formatTypeAnnulation(svfeAnnulation.motivo.tipoAnulacion),
                paddingX + 150,
                lastY + 10,
              );
              lastY += 45;
              doc.text("Motivo de anulación: ", paddingX, lastY);
              doc.text(
                svfeAnnulation.motivo.motivoAnulacion ?? "-",
                paddingX + 150,
                lastY,
              );
            }
          }
        },
      });

      autoTable(doc, {
        head: [["", ""]],
        body: [["", ""]],
        showHead: true,
        startY: lastY + 690,
        theme: "plain",
        columnStyles: {
          0: {
            cellWidth: "wrap",
          },
          1: {
            cellWidth: "wrap",
          },
        },
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
                205,
                15,
                15,
                "S",
              );
              doc.setFillColor(fillColor2);
              doc.rect(data.cell.x + 60, data.cell.y + 15, 160, 17, "F");
              doc.setTextColor("#ffffff");
              doc.text("Responsable", data.cell.x + 65, data.cell.y + 25);

              doc.setTextColor(darkTextColor);
              doc.setFont("Nunito", "bold");
              let lastY = data.cell.y + 50;
              doc.text("Nombre:", data.cell.x + 15, lastY);
              doc.setFont("Nunito", "normal");
              doc.text(
                svfeAnnulation.motivo.nombreResponsable ?? "-",
                data.cell.x + 15,
                lastY + 20,
              );
              lastY += 50;
              doc.setFont("Nunito", "bold");
              doc.text("Tipo de documento:", data.cell.x + 15, lastY);
              doc.setFont("Nunito", "normal");
              doc.text(
                formatNameTypeDocument(svfeAnnulation.motivo.tipDocResponsable ?? "00"),
                data.cell.x + 15,
                lastY + 20,
              );
              lastY += 50;
              doc.setFont("Nunito", "bold");
              doc.text("numero de documento:", data.cell.x + 15, lastY);
              doc.setFont("Nunito", "normal");
              doc.text(
                svfeAnnulation.motivo.numDocResponsable ?? "-",
                data.cell.x + 15,
                lastY + 20,
              );

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
                (i) => i.text && i.text.trim() !== "",
              );

              // Medidas
              const iconWidth = 14;
              const spacing = 160; // espacio horizontal entre columnas (ajústalo)
              const baseYIcon = data.cell.y + 258;
              const baseYText = data.cell.y + 268;

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
                  iconWidth,
                );
                doc.text(item.text, x + 20, baseYText);
              });
            }
            }
            if (data.column.index === 1) {
              doc.setLineWidth(1.2);
              doc.setDrawColor(borderColor);
              doc.roundedRect(
                data.cell.x + 5,
                data.cell.y + 15,
                data.cell.width - 10,
                205,
                15,
                15,
                "S",
              );
              doc.setFillColor(fillColor2);
              doc.rect(data.cell.x + 60, data.cell.y + 15, 160, 17, "F");
              doc.setTextColor("#ffffff");
              doc.text("Solicitante", data.cell.x + 65, data.cell.y + 25);
              doc.setTextColor(darkTextColor);
              doc.setFont("Nunito", "bold");
              let lastY = data.cell.y + 50;
              doc.text("Nombre:", data.cell.x + 15, lastY);
              doc.setFont("Nunito", "normal");
              doc.text(
                svfeAnnulation.motivo.nombreResponsable ?? "-",
                data.cell.x + 15,
                lastY + 20,
              );
              lastY += 50;
              doc.setFont("Nunito", "bold");
              doc.text("Tipo de documento:", data.cell.x + 15, lastY);
              doc.setFont("Nunito", "normal");
              doc.text(
                formatNameTypeDocument(svfeAnnulation.motivo.tipDocResponsable ?? "00"),
                data.cell.x + 15,
                lastY + 20,
              );
              lastY += 50;
              doc.setFont("Nunito", "bold");
              doc.text("Numero de documento:", data.cell.x + 15, lastY);
              doc.setFont("Nunito", "normal");
              doc.text(
                svfeAnnulation.motivo.numDocResponsable ?? "-",
                data.cell.x + 15,
                lastY + 20,
              );
            }
          }
        },
      });
    }
  }

  return doc.output("arraybuffer");
};
