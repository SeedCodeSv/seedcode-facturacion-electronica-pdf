import { exportToPdf } from "./pdf/template2/dte01_2.pdf";

const getPdf = async () => {
    const pdf = await exportToPdf();
    require('fs').writeFileSync('prueba.pdf', Buffer.from(pdf));
}

getPdf();
