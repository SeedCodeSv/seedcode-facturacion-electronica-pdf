// import { generateSvfe01_2 } from "./pdf/template2/dte01_2.pdf";
// import { DteCcf, DteFe, DteFse } from "./main";
// import { readFileSync } from "fs";
// import { join } from "path";
// import { generateSvfe03_2 } from "./pdf/template2/dte03_2.pdf";
// import { generateSvfe14_2 } from "./pdf/template2/dte14_2.pdf";
// import DTE01 from "./6343E922-7089-48C4-B9A9-0404B8BA3A96.json";

// const getPdf = async () => {
//   const logoUint = readFileSync(join(__dirname, "logos/logo.png"));
//   const watermarkUint = readFileSync(join(__dirname, "logos/logo.png"));

//   const pdf = await generateSvfe01_2({
//     borderColor: "#d2c58d",
//     fillColor: "#f5f1e7",
//     fillColor2: "#947026",
//     darkTextColor: "#947026",
//     lightTextColor: "#ffffff",
//     tertiaryColor: "#d2c58d",
//     logoWidth: 200,
//     logoHeight: 65,
//     logo: new Uint8Array(logoUint),
//     svfe01: DTE01 as unknown as DteFe,
//     selloInvalidacion: "20251CC7C4A6287A41F8BA0BC80C37AED987JVMS",
//     watermark: new Uint8Array(watermarkUint),
//     socialMedia: {
//       instagram: "mirasurf/",
//       facebook: "mirasurf/",
//       tiktok: "@mirasurf",
//       whatsapp: "584124800000",
//       phone: "+584124800000",
//       website: "https://mirasurf.com/",
//     },
//   });
//   require("fs").writeFileSync("prueba.pdf", Buffer.from(pdf));
// };

// getPdf();
