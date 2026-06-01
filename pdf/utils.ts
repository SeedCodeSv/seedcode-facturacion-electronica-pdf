import { readFileSync } from "fs";
import jsPDF from "jspdf";
import autoTable, { CellInput, RowInput } from "jspdf-autotable";
import { join } from "path";
import { SeedcodeCatalogosMhService } from "seedcode-catalogos-mh";
import sharp from "sharp";
import * as QRCode from "qrcode";
import { $MH_QUERY } from "../utils/constants";
import { DteFe } from "../interfaces/dte01";
import { DteCcf, Receptor03 } from "../interfaces/dte03";
import { DteFse } from "../interfaces/dte14";
import { DteNce } from "../interfaces/dte05";
import { DteNre } from "../interfaces/dte04";

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
  desiredHeight: number,
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
  alignContent: "left" | "center" | "right" = "left",
) => {
  doc.setFont("helvetica", "bold");
  doc.text(text, x, y, { align: alignContent });
  doc.setFont("helvetica", "normal");
};

export async function adjustImage(
  imageData: Uint8Array | string = "",
  maxWidth: number = 60,
  maxHeight: number = 35,
) {
  if (typeof imageData !== "string") {
    const imageBuffer = Buffer.from(imageData);
    const metadata = await sharp(imageBuffer).metadata();

    const imgWidth = metadata.width || 1;
    const imgHeight = metadata.height || 1;
    let width = maxWidth;
    let height = (imgHeight / imgWidth) * maxWidth;

    if (height > maxHeight) {
      height = maxHeight;
      width = (imgWidth / imgHeight) * maxHeight;
    }

    await sharp(imageBuffer)
      .resize(Math.round(width * 3.779527), Math.round(height * 3.779527))
      .png({ quality: 60 })
      .toBuffer();

    const imageBase64 = uint8ArrayToBase64(imageBuffer);

    return { imageBase64: imageBase64, width, height };
  } else {
    const desiredHeight = 20;
    const newWidth = await returnWidthImgFromBuffer(
      readFileSync(join(__dirname, "logos/logo.png")),
      desiredHeight,
    );
    const logo = readFileSync(join(__dirname, "logos/logo.png")).toString(
      "base64",
    );

    return { imageBase64: logo, width: newWidth, height: desiredHeight };
  }
}

export async function adjustImageByHeight(
  imageData: Uint8Array | string = "",
  maxHeight: number = 35,
) {
  if (typeof imageData !== "string") {
    const imageBuffer = Buffer.from(imageData);
    const metadata = await sharp(imageBuffer).metadata();

    const imgWidth = metadata.width || 1;
    const imgHeight = metadata.height || 1;
    const height = maxHeight;
    const width = (imgWidth / imgHeight) * maxHeight;

    const resizedBuffer = await sharp(imageBuffer)
      .resize(Math.round(width * 3.779527), Math.round(height * 3.779527))
      .png({ quality: 60 })
      .toBuffer();

    const imageBase64 = uint8ArrayToBase64(resizedBuffer);

    return { imageBase64, width, height };
  } else {
    const desiredHeight = maxHeight;
    const newWidth = await returnWidthImgFromBuffer(
      readFileSync(join(__dirname, "logos/logo.png")),
      desiredHeight,
    );
    const logo = readFileSync(join(__dirname, "logos/logo.png")).toString(
      "base64",
    );

    return { imageBase64: logo, width: newWidth, height: desiredHeight };
  }
}

export const adjustImageWatermark = async (
  imageData: Uint8Array | string = "",
  maxWidth: number = 45,
  maxHeight: number = 20,
) => {
  if (typeof imageData !== "string") {
    const imageBuffer = Buffer.from(imageData);
    const metadata = await sharp(imageBuffer).metadata();

    const imgWidth = metadata.width || 1;
    const imgHeight = metadata.height || 1;
    let width = maxWidth;
    let height = (imgHeight / imgWidth) * maxWidth;

    if (height > maxHeight) {
      height = maxHeight;
      width = (imgWidth / imgHeight) * maxHeight;
    }

    const data = await sharp(imageBuffer)
      .resize(Math.round(width * 3.779527), Math.round(height * 3.779527))
      .png({ quality: 60 })
      .toBuffer();
    const imageBase64 = uint8ArrayToBase64(data);

    return { imageBase64, width, height };
  } else {
    const desiredHeight = 20;
    const newWidth = await returnWidthImgFromBuffer(
      readFileSync(join(__dirname, "logos/logo.png")),
      desiredHeight,
    );
    const logo = readFileSync(join(__dirname, "logos/logo.png")).toString(
      "base64",
    );

    return { imageBase64: logo, width: newWidth, height: desiredHeight };
  }
};

function uint8ArrayToBase64(uint8Array: Uint8Array): string {
  return Buffer.from(uint8Array).toString("base64");
}

const formatName = (
  name: string,
  nameComercial: string,
  canInvertName: boolean = false,
) => {
  if (nameComercial === name) {
    return name;
  } else {
    return canInvertName
      ? `${nameComercial}, ${name}`
      : `${name}, ${nameComercial}`;
  }
};

export const writeBoldLabel = (
  doc: jsPDF,
  label: string,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
) => {
  doc.setFont(undefined, "bold");

  const labelWidth = doc.getTextWidth(label);

  doc.text(label, x, y);

  doc.setFont(undefined, "normal");

  const textLines = doc.splitTextToSize(text, maxWidth - labelWidth);

  doc.text(textLines[0], x + labelWidth, y);

  if (textLines.length > 1) {
    const lineHeight = doc.getLineHeightFactor() * 2.5;

    doc.text(textLines.slice(1), x, y + lineHeight);
  }

  return textLines.length * 3;
};

export const headerDoc = async (
  doc: jsPDF,
  dte: DteFe | DteCcf | DteFse | DteNce | DteNre,
  logo: Uint8Array | string = "",
  canInvertName: boolean = false,
  splitNameInTwoLines: boolean = false,
  shortName: boolean = false,
) => {
  const dataQR = await generateQR(dte);

  const { imageBase64, width, height } = await adjustImageByHeight(logo, 10);
  autoTable(doc, {
    startY: 2,
    showHead: false,
    body: [["", "", ""]],
    theme: "plain",
    didDrawCell: (data) => {
      if (data.column.index === 0 && data.row.index === 0) {
        try {
          if (imageBase64 === "") {
            doc.addImage(
              logo,
              "PNG",
              5,
              data.cell.y + 3,
              width,
              height,
              "LOGO",
              "SLOW",
            );
          } else {
            doc.addImage(
              `data:image/jpeg;base64,${imageBase64}`,
              "JPEG",
              5,
              data.cell.y + 3,
              width,
              height,
              "LOGO",
              "SLOW",
            );
          }

          doc.setFontSize(7);
          const heightAddress = writeBoldLabel(
            doc,
            "DIRECCIÓN : ",
            `${dte.emisor.direccion.complemento} ${formatAddress(
              dte.emisor.direccion.departamento,
              dte.emisor.direccion.municipio,
            )}`,
            5,
            20,
            118,
          );

          const telHeight = writeBoldLabel(
            doc,
            "ACTIVIDAD ECONOMICA: ",
            dte.emisor.descActividad,
            5,
            21 + heightAddress,
            118,
          );

          writeBoldLabel(
            doc,
            "TEL: ",
            dte.emisor.telefono,
            5,
            22 + telHeight + heightAddress,
            118,
          );

          const logoBase64 = `data:image/png;base64,${logoWhatsApp()}`;

          doc.addImage(
            logoBase64,
            "PNG",
            25,
            19 + telHeight + heightAddress,
            4,
            4,
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

        let formattedName: string | string[];

        const tipoDte = dte.identificacion.tipoDte;
        const nombre = dte.emisor.nombre;
        const nombreComercial = (dte as DteFe).emisor.nombreComercial || "";

        if (
          (tipoDte === "01" || tipoDte === "03") &&
          splitNameInTwoLines &&
          nombreComercial
        ) {
          formattedName = canInvertName
            ? [nombreComercial, nombre]
            : [nombre, nombreComercial];
        } else {
          formattedName =
            tipoDte === "01" || tipoDte === "03"
              ? formatName(nombre, nombreComercial, canInvertName)
              : nombre;
        }

        const name = Array.isArray(formattedName)
          ? formattedName.flatMap((line) =>
              doc.splitTextToSize(line, cellWidth - 4),
            )
          : doc.splitTextToSize(formattedName, cellWidth - 4);
        returnBoldText(
          doc,
          name,
          cellX + cellWidth / 2 + 5,
          cellY + 5,
          "center",
        );
      }
      if (data.column.index === 2 && data.row.index === 0) {
        const cellX = data.cell.x;
        const cellY = data.cell.y;
        const cellHeight = 25;

        doc.setDrawColor(0, 0, 0);

        doc.roundedRect(cellX + 40, cellY + 2, 50, cellHeight, 2, 2, "S");

        doc.setFontSize(6);
        returnBoldText(
          doc,
          "DOCUMENTO TRIBUTARIO ELECTRÓNICO",
          cellX + 65,
          cellY + 7,
          "center",
        );

        const docName = doc.splitTextToSize(
          formatNameByTypeDte(dte.identificacion.tipoDte, shortName),
          shortName ? 20 : 30,
        );
        doc.setFontSize(6);
        returnBoldText(doc, docName, cellX + 65, cellY + 11, "center");
        doc.setFontSize(6);
        returnBoldText(
          doc,
          `N.I.T. ${dte.emisor.nit}`,
          cellX + 65,
          cellY + 20,
          "center",
        );
        returnBoldText(
          doc,
          `NRC No. ${dte.emisor.nrc}`,
          cellX + 65,
          cellY + 24,
          "center",
        );

        doc.addImage(
          dataQR as Buffer,
          "PNG",
          cellX + 2,
          cellY - 2,
          36,
          36,
          "QR",
          "SLOW",
        );
      }
    },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: "auto" },
      2: { cellWidth: 90 },
    },
    margin: { top: 5, left: 5, right: 5 },
  });
};

export const getHeightText = (doc: jsPDF, text: string) => {
  const dimensions = doc.getTextDimensions(text);
  return dimensions.h;
};

export const formatNameByTypeDte = (typeDte: string, short: boolean) => {
  switch (typeDte) {
    case "01":
      return short
        ? "Factura Consumidor Final"
        : "COMPROBANTE DE FACTURA CONSUMIDOR FINAL";
    case "03":
      return "COMPROBANTE DE CRÉDITO FISCAL";
    case "04":
      return "COMPROBANTE DE NOTA DE REMISIÓN";
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

export const formatCurrency = (value: number, maxDigits = 2) => {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: maxDigits,
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

export const tableProduct = (
  doc: jsPDF,
  data: DteFe | DteCcf | DteNce,
  finalY: number,
) => {
  const array_object: (string | number)[][] = [];
  data.cuerpoDocumento
    .filter((cuerpo) => cuerpo.descripcion !== "PROPINA")
    .map((prd) => {
      const values = Object.values({
        qty: prd.cantidad,
        desc: prd.descripcion,
        price: formatCurrency(prd.precioUni),
        descu: formatCurrency(prd.montoDescu),
        other: formatCurrency(0),
        vtSuj: formatCurrency(Number(prd.ventaNoSuj) + Number(prd.noGravado)),
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
    didDrawCell: (data) => {
      if (data.section === "body") {
        const { x, y, width, height } = data.cell;
        const doc = data.doc;

        doc.setDrawColor("#6c757d");
        doc.setLineWidth(0.1);

        const dashLength = 1;
        const gapLength = 1;
        let drawn = 0;

        while (drawn < width) {
          const startX = x + drawn;
          const endX = Math.min(x + drawn + dashLength, x + width);
          doc.line(startX, y + height, endX, y + height);
          drawn += dashLength + gapLength;
        }
      }
    },
  });
  
};

export const adjustTextInRect = (
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
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

export const generateQR = async (
  dte: DteFe | DteCcf | DteFse | DteNce | DteNre,
) => {
  try {
    const dataUrl = await QRCode.toBuffer(generateUrl(dte));
    return dataUrl;
  } catch (err) {
    return "";
  }
};

export const generateUrl = (dte: DteFe | DteCcf | DteFse | DteNce | DteNre) => {
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

export const generateQRWithColor = async (
  dte: DteFe | DteCcf | DteFse | DteNce | DteNre,
  color: string,
) => {
  try {
    const dataUrl = await QRCode.toBuffer(generateUrl(dte), {
      color: {
        dark: color,
        light: "#ffffff",
      },
    });
    return dataUrl;
  } catch (err) {
    return "";
  }
};

export const secondHeader = (
  doc: jsPDF,
  dte: DteFe | DteCcf | DteNce | DteNre,
  selloInvalidacion = "",
  _contingence: boolean = false,
) => {
  const { receptor, identificacion, respuestaMH, resumen } = dte as DteFe;

  autoTable(doc, {
    margin: {
      left: 10,
      right: 10,
    },
    showHead: false,
    startY: 40,
    body: [
      [
        { content: [`NOMBRE: ${receptor.nombre}`] },
        { content: [`NRC : ${receptor.nrc ?? "-"}`] },
      ],
      [
        {
          content: [
            receptor.direccion
              ? `DIRECCIÓN :  ${receptor.direccion.complemento} ${formatAddress(
                  receptor.direccion.departamento,
                  receptor.direccion.municipio,
                )}, El Salvador`
              : "No establecida",
          ],
        },
        {
          content: [`CÓDIGO GENERACIÓN : ${identificacion.codigoGeneracion}`],
        },
      ],
      [
        { content: [`GIRO : ${receptor.descActividad ?? "-"}`] },
        { content: [`NUMERO DE CONTROL : ${identificacion.numeroControl}`] },
      ],
      [
        {
          content: [
            `${identificacion.tipoDte === "03" ? "NIT : " : "NUMERO DOCUMENTO : "} ${
              identificacion.tipoDte === "03"
                ? (receptor as unknown as Receptor03).nit
                : (receptor.numDocumento ?? "-")
            }`,
          ],
        },
        { content: [`SELLO : ${respuestaMH.selloRecibido}`] },
      ],
      [
        { content: [`CORREO : ${receptor.correo ?? "-"}`] },
        {
          content: [
            `FECHA HORA EMISION : ${identificacion.fecEmi} - ${identificacion.horEmi}`,
          ],
        },
      ],
      [
        { content: [`TEL : ${receptor.telefono ?? "-"}`] },
        {
          content: [
            `MODELO DE FACTURACIÓN : ${
              identificacion.tipoModelo === 2 ? "Diferido" : "Previo"
            }`,
          ],
        },
      ],
      [
        {
          content: [
            dte.identificacion.tipoDte !== "04"
              ? `CONDICIÓN DE LA OPERACIÓN : ${
                  resumen.condicionOperacion === 1 ? "Contado" : "Crédito"
                }`
              : "",
          ],
        },
        {
          content: [
            `TIPO DE TRANSMISIÓN : ${
              identificacion.tipoOperacion === 2 ? "Por contingencia" : "Normal"
            }`,
          ],
        },
      ],
      selloInvalidacion !== ""
        ? [
            {
              content: "DTE INVALIDO CORRECTAMENTE",
              styles: { textColor: "red", fontSize: 8 },
            },
            {
              content: `SELLO DE ANULACIÓN : ${selloInvalidacion}`,
              styles: {
                textColor: "red",
                fontSize: 8,
                cellPadding: { right: 20 },
              },
            },
          ]
        : [],
    ].filter((row) => row.length > 0),
    columnStyles: { 0: { cellWidth: 115 }, 1: { cellWidth: 105 } },
    bodyStyles: {
      fontSize: 6.5,
      cellPadding: 0.3,
    },
    theme: "plain",
    didParseCell: (data) => {
      const raw =
        typeof data.cell.raw === "object" &&
        data.cell.raw !== null &&
        "content" in data.cell.raw
          ? String(data.cell.raw.content)
          : "";

      if (
        raw.startsWith("NOMBRE:") ||
        raw.startsWith("NRC :") ||
        raw.startsWith("GIRO :") ||
        raw.startsWith("DIRECCIÓN :") ||
        raw.startsWith("CÓDIGO GENERACIÓN :") ||
        raw.startsWith("NIT :") ||
        raw.startsWith("NUMERO DOCUMENTO :") ||
        raw.startsWith("CORREO :") ||
        raw.startsWith("TEL :") ||
        raw.startsWith("NUMERO DE CONTROL :") ||
        raw.startsWith("SELLO :") ||
        raw.startsWith("FECHA HORA EMISION :") ||
        raw.startsWith("MODELO DE FACTURACIÓN :") ||
        raw.startsWith("TIPO DE TRANSMISIÓN :") ||
        raw.startsWith("CONDICIÓN DE LA OPERACIÓN :")
      ) {
        data.cell.text = [""];

        if (raw.startsWith("DIRECCIÓN :")) {
          data.cell.styles.minCellHeight = 6;
        }
      }
    },

    didDrawCell: (data) => {
      const raw =
        typeof data.cell.raw === "object" &&
        data.cell.raw !== null &&
        "content" in data.cell.raw
          ? String(data.cell.raw.content)
          : "";

      const x = data.cell.x + data.cell.padding("left");
      const y = data.cell.y + 4;

      const drawLabel = (label: string, value: string) => {
        const availableWidth =
          data.cell.width -
          data.cell.padding("left") -
          data.cell.padding("right");

        doc.setFont(undefined, "bold");
        doc.text(label, x, y);
        const labelWidth = doc.getTextWidth(label);

        doc.setFont(undefined, "normal");

        // Dividir el valor en líneas respetando el ancho disponible
        const valueLines = doc.splitTextToSize(
          value,
          availableWidth - labelWidth,
        );

        // Primera línea va junto al label
        doc.text(valueLines[0], x + labelWidth, y);

        // Las líneas siguientes empiezan desde x (no x + labelWidth)
        if (valueLines.length > 1) {
          const lineHeight = doc.getLineHeight() / doc.internal.scaleFactor;
          for (let i = 1; i < valueLines.length; i++) {
            doc.text(valueLines[i], x, y + lineHeight * i);
          }
        }
      };

      if (raw.startsWith("NOMBRE:")) {
        drawLabel("NOMBRE: ", raw.replace("NOMBRE:", "").trim());
      }

      if (raw.startsWith("NRC :")) {
        drawLabel("NRC : ", raw.replace("NRC :", "").trim());
      }

      if (raw.startsWith("DIRECCIÓN :")) {
        drawLabel("DIRECCIÓN : ", raw.replace("DIRECCIÓN :", "").trim());
      }

      if (raw.startsWith("CÓDIGO GENERACIÓN :")) {
        drawLabel(
          "CÓDIGO GENERACIÓN : ",
          raw.replace("CÓDIGO GENERACIÓN :", "").trim(),
        );
      }
      if (raw.startsWith("GIRO :")) {
        drawLabel("GIRO : ", raw.replace("GIRO :", "").trim());
      }
      if (raw.startsWith("NIT :")) {
        drawLabel("NIT : ", raw.replace("NIT :", "").trim());
      }
      if (raw.startsWith("NUMERO DOCUMENTO :")) {
        drawLabel(
          "NUMERO DOCUMENTO : ",
          raw.replace("NUMERO DOCUMENTO :", "").trim(),
        );
      }
      if (raw.startsWith("CORREO :")) {
        drawLabel("CORREO : ", raw.replace("CORREO :", "").trim());
      }
      if (raw.startsWith("TEL :")) {
        drawLabel("TEL : ", raw.replace("TEL :", "").trim());
      }
      if (raw.startsWith("NUMERO DE CONTROL :")) {
        drawLabel(
          "NUMERO DE CONTROL : ",
          raw.replace("NUMERO DE CONTROL :", "").trim(),
        );
      }
      if (raw.startsWith("SELLO :")) {
        drawLabel("SELLO : ", raw.replace("SELLO :", "").trim());
      }
      if (raw.startsWith("FECHA HORA EMISION :")) {
        drawLabel(
          "FECHA HORA EMISION : ",
          raw.replace("FECHA HORA EMISION :", "").trim(),
        );
      }
      if (raw.startsWith("MODELO DE FACTURACIÓN :")) {
        drawLabel(
          "MODELO DE FACTURACIÓN : ",
          raw.replace("MODELO DE FACTURACIÓN :", "").trim(),
        );
      }
      if (raw.startsWith("TIPO DE TRANSMISIÓN :")) {
        drawLabel(
          "TIPO DE TRANSMISIÓN : ",
          raw.replace("TIPO DE TRANSMISIÓN :", "").trim(),
        );
      }
      if (raw.startsWith("CONDICIÓN DE LA OPERACIÓN :")) {
        drawLabel(
          "CONDICIÓN DE LA OPERACIÓN : ",
          raw.replace("CONDICIÓN DE LA OPERACIÓN :", "").trim(),
        );
      }
    },
  });
};

export function convertCurrencyFormat(input: string) {
  const [amount, cents = "00"] = input.includes(".")
    ? input.split(".")
    : [input];

  const numberToWords = (num: number): string => {
    const units = [
      "",
      "UNO",
      "DOS",
      "TRES",
      "CUATRO",
      "CINCO",
      "SEIS",
      "SIETE",
      "OCHO",
      "NUEVE",
      "DIEZ",
      "ONCE",
      "DOCE",
      "TRECE",
      "CATORCE",
      "QUINCE",
      "DIECISEIS",
      "DIECISIETE",
      "DIECIOCHO",
      "DIECINUEVE",
    ];
    const tens = [
      "",
      "",
      "VEINTE",
      "TREINTA",
      "CUARENTA",
      "CINCUENTA",
      "SESENTA",
      "SETENTA",
      "OCHENTA",
      "NOVENTA",
    ];
    const hundreds = [
      "",
      "CIEN",
      "DOSCIENTOS",
      "TRESCIENTOS",
      "CUATROCIENTOS",
      "QUINIENTOS",
      "SEISCIENTOS",
      "SETECIENTOS",
      "OCHOCIENTOS",
      "NOVECIENTOS",
    ];

    if (num < 20) return units[num];
    if (num < 100) {
      const unit = num % 10;
      const ten = Math.floor(num / 10);
      return unit === 0 ? tens[ten] : `${tens[ten]} Y ${units[unit]}`;
    }
    if (num < 1000) {
      const hundred = Math.floor(num / 100);
      const remainder = num % 100;
      const remainderInWords =
        remainder > 0 ? ` ${numberToWords(remainder)}` : "";

      let hundredInWords = hundreds[hundred];
      if (hundred === 1 && remainder > 0) {
        hundredInWords = "CIENTO";
      }
      return hundredInWords + remainderInWords;
    }
    if (num < 1000000) {
      const thousands = Math.floor(num / 1000);
      const remainder = num % 1000;
      const thousandsInWords =
        thousands > 1 ? numberToWords(thousands) + " MIL" : "MIL";
      const remainderInWords =
        remainder > 0 ? ` ${numberToWords(remainder)}` : "";
      return thousandsInWords + remainderInWords;
    }
    return "";
  };

  const amountInWords = numberToWords(parseInt(amount));
  const centsFormatted = cents.padEnd(2, "0");

  return `${amountInWords} ${centsFormatted}/100 DOLARES AMERICANOS`;
}

export const logoWhatsApp = () => {
  return "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";
};
