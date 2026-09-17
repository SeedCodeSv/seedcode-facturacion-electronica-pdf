import jsPDF from "jspdf";
import { nunitoBold } from "./fonts/nunito";
import { nunitoSemibold } from "./fonts/nunito-semibold";
import { adjustImage, adjustImageWatermark, getHeightText } from "../utils";
import autoTable from "jspdf-autotable";
import type {
  AccountStateEmisor,
  AccountStateReceptor,
} from "./account_state.pdf";

export interface PaymentInfo {
  fecha: string;
  hora: string;
  formaPago: string;
  banco?: string | null;
  referencia?: string | null;
  monto: number;
  estado: string;
  fechaAnulacion?: string | null;
}

export interface PaymentSaldos {
  anterior: number;
  abonado: number;
  actual: number;
}

export interface PaymentProps {
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
  codReferencia: string;
  pago: PaymentInfo;
  saldos: PaymentSaldos;
}

const money = (n: number): string => `$${Number(n ?? 0).toFixed(2)}`;

/**
 * Comprobante de pago con datos reales: encabezado del emisor, tarjeta del
 * receptor, detalle del pago y saldos. Mismo estilo template2.
 */
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
  emisor,
  receptor,
  codReferencia,
  pago,
  saldos,
}: PaymentProps) => {
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

  const getFinalY = (): number =>
    (
      doc as unknown as {
        lastAutoTable: { finalY: number };
      }
    ).lastAutoTable?.finalY ?? 0;

  const { imageBase64, width, height } = await adjustImage(
    logo,
    logoWidth,
    logoHeight,
  );

  const isAnnulled = pago.estado.toUpperCase() === "ANULADO";
  const title = isAnnulled ? "COMPROBANTE DE PAGO ANULADO" : "COMPROBANTE DE PAGO";

  // ---------- Encabezado: logo + emisor | título ----------
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
          doc.setFontSize(13);
          doc.setTextColor(tertiaryColor);
          doc.text(title, data.cell.x + 200, data.cell.y + 20, {
            align: "center",
          });
          doc.setFont("Nunito", "normal");
          doc.setFontSize(8);
          doc.setTextColor(darkTextColor);
          doc.text(
            `Fecha: ${pago.fecha}   Hora: ${pago.hora}`,
            data.cell.x + 200,
            data.cell.y + 38,
            { align: "center" },
          );
        }
      }
    },
  });

  // ---------- Tarjeta del cliente + referencia ----------
  // La tarjeta mide 200 de alto fijo: el contenido sigue debajo de ella,
  // no del final de la tabla (que es casi 0 y encimaba todo).
  let lastY = getFinalY();
  const cardTop = lastY + 110;
  autoTable(doc, {
    head: [[""]],
    showHead: true,
    startY: cardTop,
    theme: "plain",
    margin: { left: marginX + 3, right: marginX + 3 },
    didDrawCell: (data) => {
      if (data.section === "head" && data.column.index === 0) {
        doc.setLineWidth(1.2);
        doc.setDrawColor(borderColor);
        doc.roundedRect(
          data.cell.x + 5,
          data.cell.y + 15,
          data.cell.width - 10,
          200,
          15,
          15,
          "S",
        );
        doc.setFillColor(fillColor);
        doc.roundedRect(
          data.cell.x + 100,
          data.cell.y + 30,
          665,
          165,
          15,
          15,
          "F",
        );
        doc.setFont("Nunito", "normal");
        doc.setFontSize(11.5);
        doc.setTextColor(darkTextColor);
        let y = data.cell.y + 40;
        const paddingX = data.cell.x + 15;
        doc.text("Cliente: ", paddingX, y);
        doc.text(receptor.nombre, paddingX + 100, y + 3);
        y += 30;
        doc.text(
          doc.splitTextToSize("Tipo de documento: ", 100),
          paddingX,
          y - 10,
        );
        doc.text(receptor.tipoDocumento, paddingX + 100, y);
        y += 30;
        doc.text(
          doc.splitTextToSize("Numero de documento: ", 100),
          paddingX,
          y - 5,
        );
        doc.text(receptor.numDocumento, paddingX + 100, y);
        y += 35;
        doc.text("Correo: ", paddingX, y);
        doc.text(receptor.correo, paddingX + 100, y);
        y += 25;
        doc.text("DTE: ", paddingX, y);
        doc.setFont("Nunito", "bold");
        doc.text(codReferencia, paddingX + 100, y);
        doc.setFont("Nunito", "normal");
        y += 25;
        doc.text("Referencia: ", paddingX, y);
        doc.text(pago.referencia || "—", paddingX + 100, y);
      }
    },
  });

  let y = cardTop + 15 + 200 + 25;

  // ---------- Monto del pago ----------
  if (y > doc.internal.pageSize.height - 320) {
    doc.addPage();
    y = 40;
  }

  doc.setFillColor(fillColor2);
  doc.roundedRect(marginX + 10, y, tableWidth - 20, 60, 10, 10, "F");
  doc.setFont("Nunito", "bold");
  doc.setFontSize(9);
  doc.setTextColor(lightTextColor);
  doc.text("MONTO DEL PAGO", marginX + 25, y + 20);
  doc.setFontSize(22);
  doc.text(money(pago.monto), marginX + 25, y + 45);
  doc.setFontSize(9);
  doc.setFont("Nunito", "normal");
  doc.text(
    pago.banco ? `${pago.formaPago} · ${pago.banco}` : pago.formaPago,
    marginX + 250,
    y + 30,
  );
  doc.setFont("Nunito", "bold");
  doc.text(`ESTADO: ${pago.estado}`, marginX + 250, y + 45);
  if (isAnnulled && pago.fechaAnulacion) {
    doc.setFont("Nunito", "normal");
    doc.setFontSize(8);
    doc.text(`Anulado: ${pago.fechaAnulacion}`, marginX + 250, y + 56);
  }

  y += 70;

  // ---------- Tabla detalle ----------
  const body: string[][] = [
    [
      pago.banco ? `${pago.formaPago} · ${pago.banco}` : pago.formaPago,
      pago.referencia || "—",
      money(pago.monto),
    ],
  ];

  if (isAnnulled) {
    body.push([
      "Anulación del pago",
      pago.fechaAnulacion || "—",
      `(${money(pago.monto)})`,
    ]);
  }

  autoTable(doc, {
    head: [["FORMA DE PAGO / BANCO", "REFERENCIA", "MONTO"]],
    body,
    showHead: true,
    theme: "plain",
    startY: y,
    margin: {
      top: 175,
      left: marginX + 10,
      right: marginX + 10,
      bottom: 60,
    },
    headStyles: {
      minCellHeight: 28,
      valign: "middle",
      halign: "center",
      fontStyle: "bold",
      textColor: darkTextColor,
      fontSize: 9,
      font: "Nunito",
    },
    bodyStyles: {
      textColor: darkTextColor,
      fontSize: 9,
      font: "Nunito",
    },
    columnStyles: {
      0: { cellWidth: 400 },
      1: { cellWidth: 200, halign: "center", valign: "middle" },
      2: { cellWidth: 166, halign: "right", valign: "middle" },
    },
    didDrawCell: (cell) => {
      if (cell.section === "body" && cell.column.index < 2) {
        doc.setLineWidth(0.2);
        doc.setDrawColor(borderColor);
        doc.line(
          cell.cell.x + cell.cell.width,
          cell.cell.y,
          cell.cell.x + cell.cell.width,
          cell.cell.y + cell.cell.height,
        );
      }
    },
  });

  y = getFinalY() + 18;

  // ---------- Saldos ----------
  if (y > doc.internal.pageSize.height - 160) {
    doc.addPage();
    y = 60;
  }

  const gap = 6;
  const startX = marginX + 10;
  const endX = doc.internal.pageSize.getWidth() - marginX - 8;
  const boxWidth = (endX - startX - gap * 2) / 3;
  const boxHeight = 80;

  const boxes = [
    { label: "SALDO ANTERIOR", value: money(saldos.anterior) },
    { label: "TOTAL ABONADO", value: money(saldos.abonado) },
    { label: "SALDO ACTUAL", value: money(saldos.actual) },
  ];

  boxes.forEach((box, index) => {
    const x = startX + index * (boxWidth + gap);

    doc.setLineWidth(0.3);
    doc.setDrawColor(borderColor);
    doc.roundedRect(x, y, boxWidth, boxHeight, 10, 10, "S");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(darkTextColor);
    doc.text(box.label, x + boxWidth / 2, y + boxHeight / 2 - 15, {
      align: "center",
    });

    doc.setFontSize(18);
    doc.text(box.value, x + boxWidth / 2, y + boxHeight / 2 + 5, {
      align: "center",
    });
  });

  // ---------- Marcos, marca de agua y pie en cada página ----------
  const pageCount = doc.internal.pages.length - 1;

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    if (watermark !== "") {
      doc.saveGraphicsState();
      doc.setGState(doc.GState({ opacity: 0.1 }));

      const adjustedImage = await adjustImageWatermark(watermark, 300, 300);

      doc.addImage(
        adjustedImage.imageBase64,
        "PNG",
        doc.internal.pageSize.width / 2 - 150,
        doc.internal.pageSize.width / 2 + 50,
        adjustedImage.width,
        adjustedImage.height,
        `KEY${i}`,
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

    doc.setFont("Nunito", "normal");
    doc.setFontSize(8);
    doc.setTextColor(tertiaryColor);
    doc.text(
      isAnnulled
        ? `Comprobante anulado · Sin validez fiscal · Pág ${i}/${pageCount}`
        : `Comprobante de pago · Sin validez fiscal · Pág ${i}/${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 22,
      { align: "center" },
    );
  }

  return doc.output("arraybuffer");
};
