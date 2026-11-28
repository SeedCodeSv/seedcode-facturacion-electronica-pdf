import { readFileSync } from "fs";
import jsPDF from "jspdf";
import { join } from "path";

export function addInvalidationWatermark(doc: jsPDF, selloInvalidacion = "") {
  if (!selloInvalidacion) return;

  const image = readFileSync(join(__dirname, "logos/invalidacion.png"));
  const { width: imageWidth, height: imageHeight } = doc.getImageProperties(image);
  const currentPage = doc.getCurrentPageInfo().pageNumber;

  for (let page = 1; page <= doc.getNumberOfPages(); page++) {
    doc.setPage(page);
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const scale = Math.min(pageWidth * 0.8 / imageWidth, pageHeight * 0.6 / imageHeight);
    const width = imageWidth * scale;
    const height = imageHeight * scale;

    doc.saveGraphicsState();
    doc.setGState(doc.GState({ opacity: 0.2 }));
    doc.addImage(
      image, "PNG", (pageWidth - width) / 2, (pageHeight - height) / 2,
      width, height, "invalidation-watermark", "FAST",
    );
    doc.restoreGraphicsState();
  }

  doc.setPage(currentPage);
}
