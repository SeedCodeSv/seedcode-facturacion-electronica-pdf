// import { generateSvfe01_2 } from "./pdf/template2/dte01_2.pdf";
// import DTE from "./8644DDB8-2E14-4192-A21A-40C94291AC8F.json"
// import DTE01 from "./D4C35A71-07B5-4FD0-BDEE-F99681DC28FB.json"
// import { DteCcf, DteFe } from "./main";
// import { readFileSync } from "fs";
// import { join } from "path";
// import { generateSvfe03_2 } from "./pdf/template2/dte03_2.pdf";

// const getPdf = async () => {

//     const logoUint = readFileSync(join(__dirname, "logos/logo.png"));
//     const watermarkUint = readFileSync(join(__dirname, "logos/logo.png"));

//     const pdf = await generateSvfe03_2({
//         borderColor: "#d2c58d",
//         fillColor: "#f5f1e7",
//         fillColor2: "#947026",
//         darkTextColor: "#947026",
//         lightTextColor: "#ffffff",
//         logoWidth: 200,
//         logoHeight: 65,
//         logo: new Uint8Array(logoUint),
//         svfe01: DTE01 as unknown as DteCcf,
//         selloInvalidacion: "",
//         watermark: new Uint8Array(watermarkUint),
//         socialMedia:{
//             instagram: "https://www.instagram.com/mirasurf/",
//             facebook: "https://www.facebook.com/mirasurf/",
//             tiktok: "https://www.tiktok.com/@mirasurf",
//             whatsapp: "https://wa.me/584124800000",
//             phone: "+584124800000"
//         }
//     });
//     require('fs').writeFileSync('prueba.pdf', Buffer.from(pdf));
// }

// getPdf();
