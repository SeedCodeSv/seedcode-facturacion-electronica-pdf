import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { returnBoldText } from "./utils";

interface FooterDetails {
  observaciones?: string | null;
  nombEntrega?: string | null;
  docuEntrega?: string | null;
  nombRecibe?: string | null;
  docuRecibe?: string | null;
}

/** Bloque común de políticas, entrega, recepción y observaciones. */
export const drawDeliveryFooter = (
  doc: jsPDF,
  rectMargin: number,
  details: FooterDetails = {},
) => {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.5);
  doc.text(
    "-No se aceptan cambios ni devoluciones despues de 2 dias. Producto Chino no tiene cambio ni devolucion",
    10,
    rectMargin + 10,
  );
  doc.text(
    doc.splitTextToSize(
      "-Revisar bien su mercaderia, una vez recibidos los productos no se admitiran cambios ni devoluciones en producto abierto, usado, manipulado o fuera de su empaque",
      110,
    ),
    10,
    rectMargin + 14,
  );

  doc.setFontSize(6);
  const drawPerson = (
    x: number,
    title: string,
    name?: string | null,
    document?: string | null,
  ) => {
    returnBoldText(doc, title, x, rectMargin + 21);
    const fields = [
      ["NOMBRE:", name],
      ["DUI:", document],
      ["FIRMA:", null],
      ["TELEFONO:", null],
    ];
    fields.forEach(([label, value], index) => {
      const y = rectMargin + 25 + index * 4;
      returnBoldText(doc, label, x, y);
      if (value) {
        doc.text(value, x + 14, y, { maxWidth: 38 });
      } else {
        doc.line(x + 14, y + 0.3, x + 39, y + 0.3);
      }
    });
  };
  drawPerson(10, "ENTREGADO POR:", details.nombEntrega, details.docuEntrega);
  drawPerson(80, "RECIBIDO POR:", details.nombRecibe, details.docuRecibe);
  returnBoldText(doc, "Observaciones:", 10, rectMargin + 43);

  // Las observaciones extensas continúan en otra página sin invadir los totales.
  const page = doc.getCurrentPageInfo().pageNumber;
  autoTable(doc, {
    startY: rectMargin + 44,
    margin: {
      left: 10,
      right: doc.internal.pageSize.getWidth() - 120,
      bottom: 6,
      top: 35,
    },
    theme: "plain",
    styles: {
      font: "helvetica",
      fontSize: 6,
      cellPadding: 0,
      overflow: "linebreak",
    },
    body: [[details.observaciones || "N/A"]],
  });
  doc.setPage(page);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6);
};
