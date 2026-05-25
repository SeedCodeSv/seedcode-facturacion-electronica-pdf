import jsPDF from "jspdf";
import { adjustImageByHeight, formatAddress, returnBoldText } from "../utils";
import autoTable from "jspdf-autotable";
import { getHeightText } from "../utils";
import { QuoteNormal } from "../../interfaces/quote.normal";
import { QuoteAdvance } from "../../interfaces/quote.advance.01";

export const headerDoc = async (
  quote: QuoteNormal,
  doc: jsPDF,
  logo: Uint8Array | string = "",
) => {
  const { imageBase64, width, height } = await adjustImageByHeight(logo, 10);

  autoTable(doc, {
    startY: 2,
    showHead: false,
    body: [["", ""]],
    theme: "plain",
    columnStyles: {
      0: { cellWidth: 40 },
      1: { cellWidth: "auto" },
    },
    margin: { top: 5, left: 5, right: 5 },
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
        } catch (error) {
          doc.text("error", data.cell.x + 2, data.cell.y + 5);
        }
      }
      if (data.column.index === 1 && data.row.index === 0) {
        const cellY = data.cell.y;
        const cellWidth = data.cell.width;

        doc.setFontSize(9);

        const name = doc.splitTextToSize(quote.transmitter.name, cellWidth - 4);
        returnBoldText(doc, name, 110, cellY + 5, "center");
        doc.setFontSize(7);

        const address = doc.splitTextToSize(
          quote.transmitter.address,
          cellWidth - 4,
        );

        const yName = getHeightText(doc, name);
        returnBoldText(doc, address, 110, yName + cellY + 7, "center");

        const yAddress = getHeightText(doc, address);

        returnBoldText(
          doc,
          "TELEFONO: " + quote.transmitter.phone,
          100,
          yAddress + yName + cellY + 8,
          "center",
        );
        returnBoldText(
          doc,
          "COTIZACION no. : " + quote.no,
          100,
          yAddress + yName + cellY + 12,
          "center",
        );
      }
    },
  });
};

export const secondHeader = async (quote: QuoteNormal | QuoteAdvance, doc: jsPDF) => {
  autoTable(doc, {
    margin: {
      left: 10,
      right: 10,
    },
    showHead: false,
    startY: 33,
    columnStyles: { 0: { cellWidth: 115 }, 1: { cellWidth: 105 } },
    bodyStyles: {
      fontSize: 6.5,
      cellPadding: 0.3,
    },
    theme: "plain",
    body: [
      [
        { content: [`NOMBRE: ${quote.customer.nombre}`] },
        { content: [`NRC: -`] },
      ],
      [
        {
          content: [
            `DIRECCIÓN: ${
              quote.customer.direccion
                ? `${quote.customer.direccion.complemento}, ${formatAddress(
                    quote.customer.direccion.departamento,
                    quote.customer.direccion.municipio,
                  )}`
                : "No establecida"
            }`,
          ],
        },
        { content: [`FECHA HORA EMISION: ${quote.fecEmi} - ${quote.horEmi}`] },
      ],
      [
        {
          content: [
            `GIRO: ${quote.customer.descActividad !== "0" ? quote.customer.descActividad : "-"}`,
          ],
        },
        { content: [`NUMERO DOCUMENTO: ${quote.customer.numDocumento}`] },
      ],
      [
        { content: [`CORREO: ${quote.customer.correo}`] },
        { content: [`TELEFONO: ${quote.customer.telefono}`] },
      ],
      [
        {
          content: [
            `CONDICION DE LA OPERACION: ${quote.condition === "1" ? "CONTADO" : "CREDITO"}`,
          ],
        },
        { content: [``] },
      ],
    ],
    didParseCell: (data) => {
      const raw =
        typeof data.cell.raw === "object" &&
        data.cell.raw !== null &&
        "content" in data.cell.raw
          ? String(data.cell.raw.content)
          : "";

      if (
        raw.startsWith("NOMBRE:") ||
        raw.startsWith("NRC:") ||
        raw.startsWith("GIRO:") ||
        raw.startsWith("DIRECCIÓN:") ||
        raw.startsWith("NIT:") ||
        raw.startsWith("NUMERO DOCUMENTO:") ||
        raw.startsWith("CORREO:") ||
        raw.startsWith("TELEFONO:") ||
        raw.startsWith("FECHA HORA EMISION:") ||
        raw.startsWith("CONDICION DE LA OPERACION:")
      ) {
        data.cell.text = [""];

        if (raw.startsWith("DIRECCIÓN:")) {
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

        const valueLines = doc.splitTextToSize(
          value,
          availableWidth - labelWidth,
        );

        doc.text(valueLines[0], x + labelWidth, y);

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
      if (raw.startsWith("NRC:")) {
        drawLabel("NRC: ", raw.replace("NRC:", "").trim());
      }
      if (raw.startsWith("FECHA HORA EMISION:")) {
        drawLabel(
          "FECHA HORA EMISION: ",
          raw.replace("FECHA HORA EMISION:", "").trim(),
        );
      }
      if (raw.startsWith("GIRO:")) {
        drawLabel("GIRO: ", raw.replace("GIRO:", "").trim());
      }
      if (raw.startsWith("NUMERO DOCUMENTO:")) {
        drawLabel(
          "NUMERO DOCUMENTO: ",
          raw.replace("NUMERO DOCUMENTO:", "").trim(),
        );
      }
      if (raw.startsWith("CORREO:")) {
        drawLabel("CORREO: ", raw.replace("CORREO:", "").trim());
      }
      if (raw.startsWith("TELEFONO:")) {
        drawLabel("TELEFONO: ", raw.replace("TELEFONO:", "").trim());
      }
      if (raw.startsWith("DIRECCIÓN:")) {
        drawLabel("DIRECCIÓN: ", raw.replace("DIRECCIÓN:", "").trim());
      }
      if (raw.startsWith("CONDICION DE LA OPERACION:")) {
        drawLabel(
          "CONDICION DE LA OPERACION: ",
          raw.replace("CONDICION DE LA OPERACION:", "").trim(),
        );
      }
    },
  });
};

export const advanceHeaderDoc = async (
  quote: QuoteAdvance,
  doc: jsPDF,
  logo: Uint8Array | string = "",
) => {
  const { imageBase64, width, height } = await adjustImageByHeight(logo, 10);

  autoTable(doc, {
    startY: 2,
    showHead: false,
    body: [["", "", ""]],
    theme: "plain",
    columnStyles: {
      0: { cellWidth: 40 },
      1: { cellWidth: "auto" },
      2: { cellWidth: 90 },
    },
    margin: { top: 5, left: 5, right: 5 },
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
        } catch (error) {
          doc.text("error", data.cell.x + 2, data.cell.y + 5);
        }
      }
      if (data.column.index === 1 && data.row.index === 0) {
        const cellY = data.cell.y;
        const cellWidth = data.cell.width;

        doc.setFontSize(9);

        const name = doc.splitTextToSize(quote.transmitter.name, cellWidth - 4);
        returnBoldText(doc, name, 90, cellY + 5, "center");
        doc.setFontSize(7);

        const address = doc.splitTextToSize(
          quote.transmitter.address,
          cellWidth - 4,
        );

        const yName = getHeightText(doc, name);
        returnBoldText(doc, address, 90, yName + cellY + 7, "center");

        const yAddress = getHeightText(doc, address);

        returnBoldText(
          doc,
          "TELEFONO: " + quote.transmitter.phone,
          90,
          yAddress + yName + cellY + 8,
          "center",
        );
      }
      if (data.column.index === 2 && data.row.index === 0) {
        const cellX = data.cell.x;
        const cellY = data.cell.y;
        const cellHeight = 20;

        doc.setDrawColor(0, 0, 0);

        doc.roundedRect(cellX + 40, cellY + 2, 50, cellHeight, 2, 2, "S");

        doc.setFontSize(7);
        returnBoldText(
          doc,
          "COTIZACION",
          cellX + 65,
          cellY + 7,
          "center",
        );
        doc.setFontSize(6);
        returnBoldText(doc, quote.no.toString().padStart(5, '0'), cellX + 65, cellY + 11, "center");
        doc.setFontSize(6);
        returnBoldText(
          doc,
          `N.I.T. ${quote.transmitter.nit}`,
          cellX + 65,
          cellY + 15,
          "center",
        );
        returnBoldText(
          doc,
          `NRC No. ${quote.transmitter.nrc}`,
          cellX + 65,
          cellY + 20,
          "center",
        );
      }
    },
  });
};
