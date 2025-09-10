// import { generateSvfe01_2 } from "./pdf/template2/dte01_2.pdf";
// import DTE01 from "./DTE-03-M001P001-000000000000024_document.json";
// import { DteCcf, DteFe } from "./main";
// import { readFileSync } from "fs";
// import { join } from "path";
// import { generateSvfe03_2 } from "./pdf/template2/dte03_2.pdf";

// const getPdf = async () => {
//   const logoUint = readFileSync(join(__dirname, "logos/logo.png"));
//   const watermarkUint = readFileSync(join(__dirname, "logos/logo.png"));

//   const pdf = await generateSvfe03_2({
//     borderColor: "#d2c58d",
//     fillColor: "#f5f1e7",
//     fillColor2: "#947026",
//     darkTextColor: "#947026",
//     lightTextColor: "#ffffff",
//     tertiaryColor: "#d2c58d",
//     logoWidth: 200,
//     logoHeight: 65,
//     logo: new Uint8Array(logoUint),
//     custom:{
//       typeResume: "simple",
//     },
//     svfe01: DTE01 as unknown as DteCcf,
//     selloInvalidacion: "",
//     watermark: new Uint8Array(watermarkUint),
//     socialMedia: {
//       ignore: false,
//       website: "www.bocaolas.com",
//       instagram: "@bocaolas.exclusiveresort",
//       facebook: "@bocaolas.exclusiveresort",
//       tiktok: "@bocaolas",
//       whatsapp: "(503) 7910 4529",
//       phone: "(503) 23896333",
//     },
//   });
//   require("fs").writeFileSync("prueba.pdf", Buffer.from(pdf));
// };

// getPdf();
