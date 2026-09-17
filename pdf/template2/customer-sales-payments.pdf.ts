import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { nunitoBold } from './fonts/nunito';
import { nunitoSemibold } from './fonts/nunito-semibold';
import {
  adjustImage,
  adjustImageWatermark,
  getHeightText,
} from '../utils';
import type {
  AccountStateEmisor,
  AccountStateReceptor,
} from './account_state.pdf';

export interface SalesPaymentsPago {
  fecha: string;
  formaPago: string;
  banco?: string | null;
  referencia?: string | null;
  monto: number;
  saldo: number;
}

export interface SalesPaymentsVenta {
  fecha: string;
  codReferencia: string;
  estado: string;
  totalCredito: number;
  totalPagado: number;
  totalPendiente: number;
  proximoPago: string;
  pagos: SalesPaymentsPago[];
}

export interface SalesPaymentsResumen {
  totalCredito: number;
  totalPagado: number;
  totalPendiente: number;
}

export interface CustomerSalesPaymentsProps {
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
  ventas: SalesPaymentsVenta[];
  resumen: SalesPaymentsResumen;
}

const money = (n: number): string => `$${Number(n ?? 0).toFixed(2)}`;

/**
 * Plantilla estilo template2 de la librería: lista de ventas del cliente,
 * cada una con su lista de pagos/abonos, más resumen de totales.
 */
export const generateCustomerSalesPayments = async ({
  tertiaryColor,
  darkTextColor,
  logo,
  logoHeight,
  logoWidth,
  borderColor,
  fillColor,
  lightTextColor,
  fillColor2,
  watermark = '',
  emisor,
  receptor,
  ventas,
  resumen,
}: CustomerSalesPaymentsProps): Promise<ArrayBuffer> => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    compress: true,
    format: [816.38, 1057.33],
  });

  doc.addFileToVFS('Nunito-bold.ttf', nunitoBold);
  doc.addFont('Nunito-bold.ttf', 'Nunito', 'bold');

  doc.addFileToVFS('Nunito-semibold.ttf', nunitoSemibold);
  doc.addFont('Nunito-semibold.ttf', 'Nunito', 'normal');

  const marginX = 15;
  const marginY = 15;
  const contentWidth = doc.internal.pageSize.width - marginX * 2;

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

  // ---------- Encabezado: logo + emisor | título ----------
  autoTable(doc, {
    head: [['', '']],
    showHead: true,
    startY: marginY + 3,
    theme: 'plain',
    margin: { left: marginX + 3, right: marginX + 3 },
    didDrawCell: (data) => {
      if (data.section === 'head') {
        if (data.column.index === 0) {
          doc.addImage(
            imageBase64,
            'PNG',
            data.cell.x + 10,
            data.cell.y + 10,
            width,
            height,
            'LOGO',
          );
          doc.setFont('Nunito', 'bold');
          doc.setTextColor(darkTextColor);

          let lastY = 110;
          doc.setFontSize(13);
          doc.text(emisor.nombre, data.cell.x + 10, lastY);
          lastY += 15;
          doc.setFontSize(10);
          doc.setTextColor(tertiaryColor);
          doc.text('N.I.T: ', data.cell.x + 10, lastY);
          doc.setFont('Nunito', 'normal');
          doc.text(emisor.nit, data.cell.x + 40, lastY);
          doc.setFont('Nunito', 'bold');
          doc.text('N.R.C: ', data.cell.x + 150, lastY);
          doc.setFont('Nunito', 'normal');
          doc.text(emisor.nrc, data.cell.x + 180, lastY);
          doc.setTextColor(darkTextColor);
          lastY += 15;
          doc.setFontSize(8);
          doc.setFont('Nunito', 'normal');

          const address = doc.splitTextToSize(emisor.direccion, 700);
          const textH = getHeightText(doc, address);

          doc.text(address, data.cell.x + 10, lastY);
          lastY += textH + 2;
          doc.text(emisor.correo, data.cell.x + 10, lastY);
          doc.text(emisor.web, data.cell.x + 150, lastY);
        }
        if (data.column.index === 1) {
          doc.setFont('Nunito', 'bold');
          doc.setFontSize(15);
          doc.setTextColor(tertiaryColor);
          doc.text('VENTAS Y PAGOS', data.cell.x + 200, data.cell.y + 20, {
            align: 'center',
          });
          doc.setFont('Nunito', 'normal');
          doc.setFontSize(8);
        }
      }
    },
  });

  // ---------- Tarjeta del cliente ----------
  let lastY = getFinalY();
  autoTable(doc, {
    head: [['']],
    showHead: true,
    startY: lastY + 110,
    theme: 'plain',
    margin: { left: marginX + 3, right: marginX + 3 },
    didDrawCell: (data) => {
      if (data.section === 'head' && data.column.index === 0) {
        doc.setLineWidth(1.2);
        doc.setDrawColor(borderColor);
        doc.roundedRect(
          data.cell.x + 5,
          data.cell.y + 15,
          data.cell.width - 10,
          245,
          15,
          15,
          'S',
        );
        doc.setFillColor(fillColor);
        doc.roundedRect(
          data.cell.x + 100,
          data.cell.y + 30,
          665,
          210,
          15,
          15,
          'F',
        );
        doc.setFont('Nunito', 'normal');
        doc.setFontSize(11.5);
        doc.setTextColor(darkTextColor);
        let y = data.cell.y + 40;
        const paddingX = data.cell.x + 15;
        doc.text('Cliente: ', paddingX, y);
        doc.text(receptor.nombre, paddingX + 100, y + 3);
        y += 30;
        doc.text(receptor.actividadEconomica, paddingX + 100, y);
        doc.text(
          doc.splitTextToSize('Actividad Economica: ', 100),
          paddingX,
          y,
        );
        y += 35;
        doc.text('Dirección: ', paddingX, y);
        const address = doc.splitTextToSize(
          doc.splitTextToSize(receptor.direccion, 600),
          700,
        );
        doc.text(address, paddingX + 100, y);
        y += 40;
        doc.text(
          doc.splitTextToSize('Tipo de documento: ', 100),
          paddingX,
          y - 10,
        );
        doc.text(receptor.tipoDocumento, paddingX + 100, y);
        y += 30;
        doc.text(
          doc.splitTextToSize('Numero de documento: ', 100),
          paddingX,
          y - 5,
        );
        doc.text(receptor.numDocumento, paddingX + 100, y);
        y += 35;
        doc.text('Correo: ', paddingX, y);
        doc.text(receptor.correo, paddingX + 100, y);
        y += 25;
        doc.text(doc.splitTextToSize('NRC: ', 80), paddingX, y);
        doc.text(receptor.nrc, paddingX + 100, y);
      }
    },
  });

  let y = getFinalY() + 25;

  // ---------- Ventas con su lista de pagos ----------
  ventas.forEach((venta, idx) => {
    if (y > doc.internal.pageSize.height - 220) {
      doc.addPage();
      y = 40;
    }

    const bandX = marginX + 10;
    const bandW = contentWidth - 20;

    doc.setFillColor(fillColor2);
    doc.roundedRect(bandX, y, bandW, 34, 8, 8, 'F');
    doc.setFont('Nunito', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(lightTextColor);
    doc.text(
      `VENTA ${idx + 1} · ${venta.codReferencia}`,
      bandX + 12,
      y + 14,
    );
    doc.setFont('Nunito', 'normal');
    doc.setFontSize(8.5);
    doc.text(
      `Fecha: ${venta.fecha}   ·   Estado: ${venta.estado}   ·   Total: ${money(venta.totalCredito)}   ·   Pagado: ${money(venta.totalPagado)}   ·   Saldo: ${money(venta.totalPendiente)}   ·   Próx: ${venta.proximoPago}`,
      bandX + 12,
      y + 26,
    );

    y += 40;

    const body =
      venta.pagos.length > 0
        ? venta.pagos.map((p) => [
            p.fecha,
            p.banco ? `${p.formaPago} · ${p.banco}` : p.formaPago,
            p.referencia || '—',
            money(p.monto),
            money(p.saldo),
          ])
        : [['—', 'Sin abonos registrados aún.', '—', '—', '—']];

    autoTable(doc, {
      head: [['FECHA', 'FORMA DE PAGO / BANCO', 'REFERENCIA', 'ABONO', 'SALDO']],
      body,
      showHead: true,
      theme: 'plain',
      startY: y,
      margin: {
        top: 175,
        left: marginX + 10,
        right: marginX + 10,
        bottom: 60,
      },
      headStyles: {
        minCellHeight: 28,
        valign: 'middle',
        halign: 'center',
        fontStyle: 'bold',
        textColor: darkTextColor,
        fontSize: 9,
        font: 'Nunito',
      },
      bodyStyles: {
        textColor: darkTextColor,
        fontSize: 9,
        font: 'Nunito',
      },
      columnStyles: {
        0: { cellWidth: 70, halign: 'center', valign: 'middle' },
        1: { cellWidth: 350 },
        2: { cellWidth: 116, halign: 'center', valign: 'middle' },
        3: { cellWidth: 115, halign: 'right', valign: 'middle' },
        4: { cellWidth: 115, halign: 'right', valign: 'middle' },
      },
      didDrawCell: (cell) => {
        if (cell.section === 'body' && cell.column.index < 4) {
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
  });

  // ---------- Resumen ----------
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
    { label: 'TOTAL CREDITO', value: money(resumen.totalCredito) },
    { label: 'TOTAL PAGADO', value: money(resumen.totalPagado) },
    { label: 'TOTAL PENDIENTE', value: money(resumen.totalPendiente) },
  ];

  boxes.forEach((box, index) => {
    const x = startX + index * (boxWidth + gap);

    doc.setLineWidth(0.3);
    doc.setDrawColor(borderColor);
    doc.roundedRect(x, y, boxWidth, boxHeight, 10, 10, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(darkTextColor);
    doc.text(box.label, x + boxWidth / 2, y + boxHeight / 2 - 15, {
      align: 'center',
    });

    doc.setFontSize(18);
    doc.text(box.value, x + boxWidth / 2, y + boxHeight / 2 + 5, {
      align: 'center',
    });
  });

  // ---------- Marcos, marca de agua y pie en cada página ----------
  const pageCount = doc.internal.pages.length - 1;

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    if (watermark !== '') {
      doc.saveGraphicsState();
      doc.setGState(doc.GState({ opacity: 0.1 }));

      const adjustedImage = await adjustImageWatermark(watermark, 300, 300);

      doc.addImage(
        adjustedImage.imageBase64,
        'PNG',
        doc.internal.pageSize.width / 2 - 150,
        doc.internal.pageSize.width / 2 + 50,
        adjustedImage.width,
        adjustedImage.height,
        `KEY${i}`,
        'FAST',
      );
      doc.restoreGraphicsState();
    }

    doc.setLineWidth(1.2);
    doc.setDrawColor(borderColor);
    doc.roundedRect(
      marginX,
      marginY,
      contentWidth,
      doc.internal.pageSize.height - marginY * 2,
      15,
      15,
      'S',
    );

    doc.setFont('Nunito', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(tertiaryColor);
    doc.text(
      `Detalle de ventas y pagos · Sin validez fiscal · Pág ${i}/${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 22,
      { align: 'center' },
    );
  }

  return doc.output('arraybuffer');
};
