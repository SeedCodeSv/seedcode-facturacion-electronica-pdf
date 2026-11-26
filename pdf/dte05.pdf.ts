import jsPDF from "jspdf";
import { DteNce } from "../interfaces/dte05";
import { formatCurrency } from "./utils";
import { drawDesignSummary, generateDesignPdf, SummaryRow } from "./design";

// Keep the document's existing amounts separate from its visual presentation.
const summaryRows = (dte: DteNce): SummaryRow[] => {
  const { resumen } = dte;
  const totals = [
    resumen.subTotalVentas.toFixed(2),
    resumen.totalDescu.toFixed(2),
    resumen.totalIva.toFixed(2),
    resumen.ivaPerci.toFixed(2),
    resumen.ivaRete.toFixed(2),
    resumen.montoTotalOperacion.toFixed(2),
    resumen.totalNoGravado.toFixed(2),
    resumen.totalPagar.toFixed(2),
  ];
  const labels = [
    "Suma Total de Operaciones:",
    "Total de Descuentos:",
    "IVA 13%:",
    "IVA Percibido:",
    "IVA Retenido:",
    "Monto Total de la Operación:",
    "Total Otros montos no afectos:",
    "Total a Pagar:",
  ];
  return labels.map((label, index) => [label, totals[index]]);
};

export const generateSvfe05 = async (
  dte: DteNce,
  logo: Uint8Array | string = "",
  selloInvalidacion: string = "",
  contingence: boolean = false,
  canInvertName: boolean = false
) => {
  const products = dte.cuerpoDocumento
    .filter(item => item.descripcion !== "PROPINA")
    .map(item => [
      item.cantidad,
      item.descripcion,
      formatCurrency(item.precioUni),
      formatCurrency(item.montoDescu),
      formatCurrency(item.noGravado),
      formatCurrency(item.ventaNoSuj),
      formatCurrency(item.ventaExenta),
      formatCurrency(item.ventaGravada),
    ]);
  return generateDesignPdf(dte, products, summaryRows(dte), { logo, selloInvalidacion, contingence, canInvertName });
};

export const footerDocument = (doc: jsPDF, rectMargin: number, dte: DteNce) => {
  drawDesignSummary(doc, rectMargin, dte, summaryRows(dte));
};
