import { readFileSync } from "fs";
import jsPDF from "jspdf";
import autoTable, { RowInput } from "jspdf-autotable";
import { join } from "path";
import { SeedcodeCatalogosMhService } from "seedcode-catalogos-mh";
import sharp from "sharp";
import * as QRCode from "qrcode";
import { $MH_QUERY } from "../utils/constants";
import { DteFe } from "../interfaces/dte01";
import { DteCcf } from "../interfaces/dte03";
import { DteFse } from "../interfaces/dte14";

export const formatAddress = (dep_code: string, mun_code: string) => {
  const service = new SeedcodeCatalogosMhService();

  const deparment = service
    .get012Departamento()
    .find((dep) => dep.codigo === dep_code);

  if (deparment) {
    const municipio = service.get013Municipio(dep_code);
    if (municipio) {
      const munici = municipio.find((mun) => mun.codigo === mun_code);
      if (munici) {
        return `${munici.valores}, ${deparment.valores}`;
      }
      return `${deparment.valores}`;
    }
    return `${deparment.valores}`;
  }
  return "";
};

export const returnWidthImgFromBuffer = async (
  imageBuffer: Buffer | Uint8Array,
  desiredHeight: number
): Promise<number> => {
  try {
    const image = sharp(imageBuffer);
    const metadata = await image.metadata();

    if (!metadata.width || !metadata.height) {
      return 20;
    }

    const originalWidth = metadata.width;
    const originalHeight = metadata.height;
    const aspectRatio = originalWidth / originalHeight;
    const newWidth = desiredHeight * aspectRatio;

    return newWidth;
  } catch {
    return 20;
  }
};

export const returnBoldText = (
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  alignContent: "left" | "center" | "right" = "left"
) => {
  doc.setFont("helvetica", "bold");
  doc.text(text, x, y, { align: alignContent });
  doc.setFont("helvetica", "normal");
};

export async function adjustImage(imageData: Uint8Array | string = "") {
  if (typeof imageData !== "string") {
    const imageBuffer = Buffer.from(imageData);
    const metadata = await sharp(imageBuffer).metadata();

    const imgWidth = metadata.width || 1;
    const imgHeight = metadata.height || 1;
    const maxWidth = 45; // mm
    const maxHeight = 20; // mm
    let width = maxWidth;
    let height = (imgHeight / imgWidth) * maxWidth;

    if (height > maxHeight) {
      height = maxHeight;
      width = (imgWidth / imgHeight) * maxHeight;
    }

    const resizedBuffer = await sharp(imageBuffer)
      .resize(Math.round(width * 3.779527), Math.round(height * 3.779527)) // Convert mm to px
      .toBuffer();

    const imageBase64 = `data:image/png;base64,${resizedBuffer.toString(
      "base64"
    )}`;

    return { imageBase64, width, height };
  } else {
    const desiredHeight = 20;
    const newWidth = await returnWidthImgFromBuffer(
      readFileSync(join(__dirname, "logos/logo.png")),
      desiredHeight
    );
    const logo = readFileSync(join(__dirname, "logos/logo.png")).toString(
      "base64"
    );

    return { imageBase64: logo, width: newWidth, height: desiredHeight };
  }
}

export const headerDoc = async (
  doc: jsPDF,
  dte: DteFe | DteCcf | DteFse,
  logo: Uint8Array | string = ""
) => {
  const dataQR = await generateQR(dte);
  const { imageBase64, width, height } = await adjustImage(logo);
  autoTable(doc, {
    startY: 5,
    showHead: false,
    body: [["", "", ""]],
    theme: "plain",
    didDrawCell: (data) => {
      if (data.column.index === 0 && data.row.index === 0) {
        try {
          doc.addImage(
            `data:image/png;base64,${imageBase64}`,
            "PNG",
            data.cell.x + 2,
            data.cell.y,
            width,
            height,
            "LOGO",
            "SLOW"
          );
        } catch (error) {
          doc.text("error", data.cell.x + 2, data.cell.y + 5);
        }
      }
      if (data.column.index === 1 && data.row.index === 0) {
        const cellX = data.cell.x;
        const cellY = data.cell.y;
        const cellWidth = data.cell.width;

        doc.setFontSize(7);
        const name = doc.splitTextToSize(
          `${dte.emisor.nombre} ${
            dte.identificacion.tipoDte === "01" ||
            dte.identificacion.tipoDte === "03"
              ? "," + (dte as DteFe).emisor.nombreComercial
              : ""
          }`,
          cellWidth - 4
        );
        const hName = getHeightText(doc, name);
        returnBoldText(doc, name, cellX + cellWidth / 2, cellY + 5, "center");
        const actEco = doc.splitTextToSize(
          `Actividad económica: ${dte.emisor.descActividad}`,
          cellWidth - 4
        );
        const hActEco = getHeightText(doc, actEco);
        returnBoldText(
          doc,
          actEco,
          cellX + cellWidth / 2,
          cellY + hName + 5.5,
          "center"
        );

        // Agregar dirección
        const address = doc.splitTextToSize(
          `DIRECCIÓN : ${dte.emisor.direccion.complemento} ${formatAddress(
            dte.emisor.direccion.departamento,
            dte.emisor.direccion.municipio
          )}`,
          cellWidth - 4
        );
        const hAddress = getHeightText(doc, address);
        returnBoldText(
          doc,
          address,
          cellX + cellWidth / 2,
          cellY + hName + hActEco + 6.5,
          "center"
        );

        // Agregar teléfono
        returnBoldText(
          doc,
          `TEL: ${dte.emisor.telefono}`,
          cellX + cellWidth / 2,
          cellY + hName + hActEco + hAddress + 7,
          "center"
        );
      }
      if (data.column.index === 2 && data.row.index === 0) {
        const cellX = data.cell.x;
        const cellY = data.cell.y;
        const cellWidth = 45;
        const cellHeight = 25;

        doc.setDrawColor(0, 0, 0);

        doc.roundedRect(
          cellX + 30,
          cellY + 2,
          cellWidth - 4,
          cellHeight - 4,
          2,
          2,
          "S"
        );

        doc.setFontSize(5);
        returnBoldText(
          doc,
          "DOCUMENTO TRIBUTARIO ELECTRÓNICO",
          cellX + 50,
          cellY + 5,
          "center"
        );

        const docName = doc.splitTextToSize(
          formatNameByTypeDte(dte.identificacion.tipoDte),
          30
        );
        doc.setFontSize(5);
        returnBoldText(doc, docName, cellX + 50, cellY + 9, "center");
        doc.setFontSize(6);
        returnBoldText(
          doc,
          `N.I.T. ${dte.emisor.nit}`,
          cellX + 50,
          cellY + 16,
          "center"
        );
        returnBoldText(
          doc,
          `NRC No. ${dte.emisor.nrc}`,
          cellX + 50,
          cellY + 20,
          "center"
        );

        doc.addImage(dataQR as Buffer, "PNG", cellX + 5, cellY + 1, 23, 23);
      }
    },
    columnStyles: {
      0: { cellWidth: 45 },
      1: { cellWidth: "auto" },
      2: { cellWidth: 70 },
    },
    margin: { top: 5, left: 5, right: 5 },
  });
};

export const getHeightText = (doc: jsPDF, text: string) => {
  const dimensions = doc.getTextDimensions(text);
  return dimensions.h;
};

export const formatNameByTypeDte = (typeDte: string) => {
  switch (typeDte) {
    case "01":
      return "COMPROBANTE DE FACTURA CONSUMIDOR FINAL";
    case "03":
      return "COMPROBANTE DE CRÉDITO FISCAL";
    case "05":
      return "COMPROBANTE DE NOTA DE CRÉDITO";
    case "06":
      return "COMPROBANTE DE NOTA DE DÉBITO";
    case "14":
      return "COMPROBANTE DE FACTURA DE SUJETO EXCLUIDO";
    default:
      return "";
  }
};

export const formatCurrency = (value: number) => {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};

export const tableHeaders = [
  "CANTIDAD",
  "DESCRIPCIÓN",
  "PRECIO UNITARIO",
  "DESCUENTO POR ITEM",
  "OTROS MONTOS NO AFECTOS",
  "VENTAS NO SUJETAS",
  "VENTAS EXENTAS",
  "VENTAS GRAVADAS",
];

export const tableProduct = (doc, data: DteFe | DteCcf, finalY: number) => {
  const array_object: (string | number)[][] = [];
  data.cuerpoDocumento.map((prd) => {
    const values = Object.values({
      qty: prd.cantidad,
      desc: prd.descripcion,
      price: formatCurrency(prd.precioUni),
      descu: formatCurrency(prd.montoDescu),
      other: formatCurrency(0),
      vtSuj: formatCurrency(prd.ventaNoSuj),
      vtExe: formatCurrency(prd.ventaExenta),
      vtGrav: formatCurrency(prd.ventaGravada),
    });
    array_object.push(values);
  });

  autoTable(doc, {
    theme: "plain",
    startY: finalY,
    margin: {
      right: 5,
      left: 5,
      bottom: doc.internal.pages.length > 1 ? 10 : 55,
      top: 35,
    },
    head: [tableHeaders],
    body: array_object as unknown as RowInput[],
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
    bodyStyles: {
      fontSize: 7,
    },
  });
};

export const adjustTextInRect = (
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) => {
  const lines = doc.splitTextToSize(text, maxWidth);
  const textHeight = lines.length * lineHeight;

  return {
    lines,
    textHeight,
    adjustedY: y,
    adjustedX: x,
  };
};

export const generateQR = async (dte: DteFe | DteCcf | DteFse) => {
  try {
    const dataUrl = await QRCode.toBuffer(generateUrl(dte));
    return dataUrl;
  } catch (err) {
    return "";
  }
};

export const generateUrl = (dte: DteFe | DteCcf | DteFse) => {
  return (
    $MH_QUERY +
    "?ambiente=" +
    dte.identificacion.ambiente +
    "&codGen=" +
    dte.identificacion.codigoGeneracion +
    "&fechaEmi=" +
    dte.identificacion.fecEmi
  );
};

export const secondHeader = (
  doc: jsPDF,
  dte: DteFe | DteCcf,
  contingence: boolean = false
) => {
  const { receptor, identificacion, respuestaMH } = dte as DteFe;

  autoTable(doc, {
    margin: {
      left: 10,
      right: 10,
    },
    showHead: false,
    startY: 35,
    body: [
      [`NOMBRE: ${receptor.nombre}`, `NRC : ${receptor.nrc ?? "-"}`],
      [
        receptor.direccion
          ? `DIRECCIÓN :  ${receptor.direccion.complemento} ${formatAddress(
              receptor.direccion.departamento,
              receptor.direccion.municipio
            )}, El Salvador`
          : "No establecida",
        `CÓDIGO GENERACIÓN : ${identificacion.codigoGeneracion}`,
      ],
      [
        `GIRO : ${receptor.descActividad ?? "-"}`,
        `NUMERO DE CONTROL : ${identificacion.numeroControl}`,
      ],
      [
        `NUMERO DOCUMENTO : ${receptor.numDocumento ?? "-"}`,
        `SELLO : ${respuestaMH.selloRecibido}`,
      ],
      [
        `CORREO : ${receptor.correo ?? "-"}`,
        `FECHA HORA EMISION : ${identificacion.fecEmi} - ${identificacion.horEmi}`,
      ],
      [
        `TEL : ${receptor.telefono ?? "-"}`,
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
};
