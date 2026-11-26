import jsPDF from "jspdf";
import { DteNre } from "../interfaces/dte04";
import { formatCurrency } from "./utils";
import { drawDesignSummary, generateDesignPdf, SummaryRow } from "./design";

// Keep the document's existing amounts separate from its visual presentation.
const summaryRows = (dte: DteNre): SummaryRow[] => {
  const { resumen } = dte;
  const totals = [
    resumen.descuGravada.toFixed(2),
    resumen.descuNoSuj.toFixed(2),
    resumen.descuExenta.toFixed(2),
    resumen.descuGravada.toFixed(2),
    resumen.tributos
      ? resumen.tributos
          .map((tr) => Number(tr.valor))
          .reduce((a, b) => a + b)
          .toFixed(2)
      : "0.00",
    resumen.subTotal.toFixed(2),
    resumen.montoTotalOperacion.toFixed(2),
    "0.00",
    resumen.montoTotalOperacion.toFixed(2),
  ];
  const labels = [
    "Suma Total de Operaciones:",
    "Monto global Desc., Rebajas y otros a ventas no sujetas:",
    "Monto global Desc., Rebajas y otros a ventas exentas:",
    "Monto global Desc., Rebajas y otros a ventas gravadas:",
    "IVA 13%:",
    "Sub-Total:",
    "Monto Total de la Operación:",
    "Total Otros montos no afectos:",
    "Total a Pagar:",
  ];
  return labels.map((label, index) => [label, totals[index]]);
};

export const generateSvfe04 = async (
  dte: DteNre,
  logo: Uint8Array | string = "",
  selloInvalidacion: string = "",
  contingence: boolean = false,
  canInvertName: boolean = false
) => {
  const products = dte.cuerpoDocumento
    .map(item => [
      item.cantidad,
      item.descripcion,
      formatCurrency(item.precioUni),
      formatCurrency(item.montoDescu),
      formatCurrency(0),
      formatCurrency(item.ventaNoSuj),
      formatCurrency(item.ventaExenta),
      formatCurrency(item.ventaGravada),
    ]);
  return generateDesignPdf(dte, products, summaryRows(dte), { logo, selloInvalidacion, contingence, canInvertName });
};

export const footerDocument = (doc: jsPDF, rectMargin: number, dte: DteNre) => {
  drawDesignSummary(doc, rectMargin, dte, summaryRows(dte));
};
