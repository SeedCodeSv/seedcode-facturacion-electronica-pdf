import jsPDF from "jspdf";
import { DteFse } from "../interfaces/dte14";
import { formatCurrency } from "./utils";
import { drawDesignSummary, generateDesignPdf, SummaryRow } from "./design";

// Keep the document's existing amounts separate from its visual presentation.
const summaryRows = (dte: DteFse): SummaryRow[] => {
  const { resumen } = dte;
  const totals = [
    resumen.subTotal.toFixed(2),
    (resumen.reteRenta ?? 0).toFixed(2),
    (resumen.ivaRete1 ?? 0).toFixed(2),
    resumen.subTotal.toFixed(2),
    resumen.totalPagar.toFixed(2),
  ];
  const labels = [
    "Suma Total de Operaciones:",
    "Retención renta:",
    "IVA retenido:",
    "Sub-Total:",
    "Total a Pagar:",
  ];
  return labels.map((label, index) => [label, totals[index]]);
};

export const generateSvfe14 = async (
  dte: DteFse,
  logo: Uint8Array | string = "",
  selloInvalidacion: string = "",
  contingence = false
) => {
  const products = dte.cuerpoDocumento.map(item => [
    item.cantidad,
    item.descripcion,
    formatCurrency(item.precioUni),
    formatCurrency(item.montoDescu),
    formatCurrency(item.compra),
  ]);
  return generateDesignPdf(dte, products, summaryRows(dte), { logo, selloInvalidacion, contingence });
};

export const footerDocument = (doc: jsPDF, rectMargin: number, dte: DteFse) => {
  drawDesignSummary(doc, rectMargin, dte, summaryRows(dte));
};
