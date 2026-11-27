import jsPDF from "jspdf";
import { DteCcf } from "../interfaces/dte03";
import { formatCurrency } from "./utils";
import { drawDesignSummary, generateDesignPdf, SummaryRow } from "./design";

// Keep the document's existing amounts separate from its visual presentation.
const summaryRows = (dte: DteCcf): SummaryRow[] => {
  const { resumen } = dte;
  const propina = dte.cuerpoDocumento.find(item => item.descripcion === "PROPINA")?.noGravado ?? 0;
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
    (resumen.ivaPerci ?? resumen.ivaPerci1 ?? 0).toFixed(2),
    (resumen.ivaRete ?? resumen.ivaRete1 ?? 0).toFixed(2),
    (resumen.reteRenta ?? 0).toFixed(2),
    resumen.montoTotalOperacion.toFixed(2),
    propina.toFixed(2),
    "0.00",
    resumen.totalPagar.toFixed(2),
   
  ];
  const labels = [
    "Suma Total de Operaciones:",
    "Monto global Desc., Rebajas y otros a ventas no sujetas:",
    "Monto global Desc., Rebajas y otros a ventas exentas:",
    "Monto global Desc., Rebajas y otros a ventas gravadas:",
    "IVA 13%:",
    "Sub-Total:",
    "IVA Percibido:",
    "IVA Retenido:",
    "Retención Renta:",
    "Total no gravado:",
    "Monto Total de la Operación:",
    "Total Otros montos no afectos:",
    "Total a Pagar:",
  ];
  return labels.map((label, index) => [label, totals[index]]);
};

export const generateSvfe03 = async (
  dte: DteCcf,
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
      formatCurrency(0),
      formatCurrency(Number(item.ventaNoSuj) + Number(item.noGravado)),
      formatCurrency(item.ventaExenta),
      formatCurrency(item.ventaGravada),
    ]);
  return generateDesignPdf(dte, products, summaryRows(dte), { logo, selloInvalidacion, contingence, canInvertName });
};

export const footerDocument = (doc: jsPDF, rectMargin: number, dte: DteCcf) => {
  drawDesignSummary(doc, rectMargin, dte, summaryRows(dte));
};
