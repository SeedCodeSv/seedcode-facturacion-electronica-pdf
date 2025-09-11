import { generateSvfe01_2 } from "./pdf/template2/dte01_2.pdf";
import DTE01 from "./DTE-01-M001P002-000000000000058_document.json";
import { DteCcf, DteFe } from "./main";
import { readFileSync } from "fs";
import { join } from "path";
import { generateSvfe03_2 } from "./pdf/template2/dte03_2.pdf";

const getPdf = async () => {
  const logoUint = readFileSync(join(__dirname, "logos/logo.png"));
  const watermarkUint = readFileSync(join(__dirname, "logos/logo.png"));

  const pdf = await generateSvfe01_2({
    borderColor: "#232e62",
    fillColor: "#e1e1ee",
    fillColor2: "#737fa6",
    darkTextColor: "#232e62",
    lightTextColor: "#ffffff",
    tertiaryColor: "#0d90a4",
    logoWidth: 200,
    logoHeight: 65,
    logo: new Uint8Array(logoUint),
    custom:{
      typeResume: "simple",
    },
    svfe01: DTE01 as unknown as DteFe,
    selloInvalidacion: "",
    watermark: new Uint8Array(watermarkUint),
    socialMedia: {
      ignore: false,
      website: "www.bocaolas.com",
      instagram: "@bocaolas.exclusiveresort",
      facebook: "@bocaolas.exclusiveresort",
      tiktok: "@bocaolas",
      whatsapp: "(503) 7910 4529",
      phone: "(503) 23896333",
    },
  });
  require("fs").writeFileSync("prueba.pdf", Buffer.from(pdf));
};

getPdf();
