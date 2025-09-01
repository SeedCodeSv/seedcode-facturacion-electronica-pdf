import { generateSvfe01_2 } from "./pdf/template2/dte01_2.pdf";
import { DteCcf, DteFe, DteFse, generateSvfe01 } from "./main";
import { readFileSync } from "fs";
import { join } from "path";
import { generateSvfe03_2 } from "./pdf/template2/dte03_2.pdf";
import { generateSvfe14_2 } from "./pdf/template2/dte14_2.pdf";
import DTE01 from './27A42185-0662-4AE3-ADA0-3A1429F5DC96.json'

const getPdf = async () => {
  const logoUint = readFileSync(join(__dirname, "logos/logo.png"));
  const watermarkUint = readFileSync(join(__dirname, "logos/logo.png"));

  const pdf = await generateSvfe01(DTE01 as DteFe, logoUint);
  require("fs").writeFileSync("prueba.pdf", Buffer.from(pdf));
};

getPdf();