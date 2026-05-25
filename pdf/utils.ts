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
    maximumFractionDigits: maxDigits
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
  const [amount, cents = '00'] = input.includes('.') ? input.split('.') : [input];

  const numberToWords = (num: number): string => {
    const units = [
      '',
      'UNO',
      'DOS',
      'TRES',
      'CUATRO',
      'CINCO',
      'SEIS',
      'SIETE',
      'OCHO',
      'NUEVE',
      'DIEZ',
      'ONCE',
      'DOCE',
      'TRECE',
      'CATORCE',
      'QUINCE',
      'DIECISEIS',
      'DIECISIETE',
      'DIECIOCHO',
      'DIECINUEVE',
    ];
    const tens = [
      '',
      '',
      'VEINTE',
      'TREINTA',
      'CUARENTA',
      'CINCUENTA',
      'SESENTA',
      'SETENTA',
      'OCHENTA',
      'NOVENTA',
    ];
    const hundreds = [
      '',
      'CIEN',
      'DOSCIENTOS',
      'TRESCIENTOS',
      'CUATROCIENTOS',
      'QUINIENTOS',
      'SEISCIENTOS',
      'SETECIENTOS',
      'OCHOCIENTOS',
      'NOVECIENTOS',
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
      const remainderInWords = remainder > 0 ? ` ${numberToWords(remainder)}` : '';

      let hundredInWords = hundreds[hundred];
      if (hundred === 1 && remainder > 0) {
        hundredInWords = 'CIENTO';
      }
      return hundredInWords + remainderInWords;
    }
    if (num < 1000000) {
      const thousands = Math.floor(num / 1000);
      const remainder = num % 1000;
      const thousandsInWords = thousands > 1 ? numberToWords(thousands) + ' MIL' : 'MIL';
      const remainderInWords = remainder > 0 ? ` ${numberToWords(remainder)}` : '';
      return thousandsInWords + remainderInWords;
    }
    return '';
  };

  const amountInWords = numberToWords(parseInt(amount));
  const centsFormatted = cents.padEnd(2, '0');

  return `${amountInWords} ${centsFormatted}/100 DOLARES AMERICANOS`;
}