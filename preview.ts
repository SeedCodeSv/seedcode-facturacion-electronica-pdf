// import fs from "fs";
// import path from "path";
// import { generateSvfe01, generateSvfe01_2, generateSvfe03_2, generateSvfe14_2 } from "./dist/main"; // Ajusta la ruta si tu build está en otro lado
// import { generateSvfe05_2 } from "./pdf/template2/dte05_2.pdf";

// (async () => {
//     try {
//         const arrayBuffer = await generateSvfe05_2({
//             logo: 'https://facturacion-seed-code.nyc3.digitaloceanspaces.com/CLIENTS/LOGOS/06140803711184/logo_1_0.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=DO00XCTG77NFNGFZLWHF%2F20251006%2Fnyc3%2Fs3%2Faws4_request&X-Amz-Date=20251006T144110Z&X-Amz-Expires=900&X-Amz-Signature=f586de7a3e974fcd4aab3305484e4fffae515b80fb522e59fcbaac0206d55947&X-Amz-SignedHeaders=host&x-id=GetObject',
//             watermark: 'CLIENTS/LOGOS/06140612191016/watermark_12.png',
//             socialMedia: {
//                 ignore: false,
//                 instagram: 'instagram',
//                 facebook: "facebok",
//                 tiktok: '',
//                 whatsapp: '',
//                 phone: '',
//                 website: ''
//             },
//             selloInvalidacion: '',
//             custom: {
//                 typeResume: "detailed"
//             },
//             borderColor: "#4f96a4",
//             fillColor: "#232e62",
//             fillColor2: "#157386",
//             darkTextColor: "#157386",
//             lightTextColor: "#ffffff",
//             tertiaryColor: "#48bdb7",
//             svfe05: {
//                 identificacion: {
//                     version: 1,
//                     codigoGeneracion: "5BE2D117-73A8-450F-A853-FB902804618A",
//                     ambiente: "00",
//                     tipoDte: "06",
//                     numeroControl: "DTE-01-M001P006-000000000000007",
//                     tipoModelo: 1,
//                     tipoOperacion: 1,
//                     tipoContingencia: null,
//                     motivoContin: null,
//                     tipoMoneda: "USD",
//                     fecEmi: "2025-09-26",
//                     horEmi: "15:12:09"
//                 },
//                 emisor: {
//                     nit: "06140611610040",
//                     nrc: "1864097",
//                     nombre: "ALFARO GUZMAN, ARMIN ALFONSO",
//                     telefono: "00000000",
//                     correo: "correo@correo.com",
//                     nombreComercial: "BOCA OLAS",
//                     direccion: {
//                         departamento: "05",
//                         municipio: "27",
//                         complemento: "Carretera Litoral, playa Sunzal, km. 42 1/2, Tamanique, La Libertad."
//                     },
//                     codActividad: "55102",
//                     descActividad: "Venta al por menor de productos de panadería, repostería y galletas",
//                     tipoEstablecimiento: "02",
//                     codEstable: "M001",
//                     codEstableMH: "M001",
//                     codPuntoVenta: "P006",
//                     codPuntoVentaMH: null
//                 },
//                 receptor: {
//                     codEstable: "",
//                     tipoEstablecimiento: "",
//                     codEstableMH: "",
//                     codPuntoVenta: "",
//                     codPuntoVentaMH: "",
//                     nit: "056637180",
//                     nrc: "3165298",
//                     nombre: "José Manuel Márquez Hernández",
//                     codActividad: "62020",
//                     descActividad: "Consultorías y gestión de servicios informáticos",
//                     nombreComercial: "SeedCodeSv",
//                     // tipoDocumento: '',
//                     // numDocumento: "",
//                     direccion: {
//                         departamento: "05",
//                         municipio: "27",
//                         complemento: "Carretera Litoral, playa Sunzal, km. 42 1/2, Tamanique, La Libertad."
//                     },
//                     telefono: "00000000",
//                     correo: "alexandramoran9704@gmail.com"
//                 },
//                 otrosDocumentos: null,
//                 documentoRelacionado: null,
//                 ventaTercero: null,
//                 cuerpoDocumento: [
//                     {
//                         numItem: 1,
//                         tipoItem: 2,
//                         uniMedida: 59,
//                         numeroDocumento: null,
//                         cantidad: 1,
//                         codigo: "PV-000001",
//                         codTributo: null,
//                         descripcion: "CEVICHE TROPICAL CAMARON",
//                         precioUni: 13.5,
//                         montoDescu: 0,
//                         ventaNoSuj: 0,
//                         ventaExenta: 0,
//                         ventaGravada: 13.5,
//                         // ivaItem: 1.55,
//                         // tributos: null,
//                         psv: 0,
//                         noGravado: 0
//                         //compra: 0
//                     },
//                     // {
//                     //     numItem: 2,
//                     //     tipoItem: 2,
//                     //     uniMedida: 59,
//                     //     numeroDocumento: null,
//                     //     cantidad: 1,
//                     //     codigo: "PROPINAEXTRA",
//                     //     codTributo: null,
//                     //     descripcion: "PROPINA EXTRA",
//                     //     precioUni: 0,
//                     //     montoDescu: 0,
//                     //     ventaNoSuj: 0,
//                     //     ventaExenta: 0,
//                     //     ventaGravada: 0,
//                     //      ivaItem: 0,
//                     //     tributos: null,
//                     //     psv: 0,
//                     //     noGravado: 1.33
//                     // }
//                 ],
//                 resumen: {
//                     // totalCompra: 0,
//                     totalNoSuj: 0,
//                     // descu:0,
//                     // totalSuj: 0,
//                     // observaciones: "",
//                     totalExenta: 0,
//                     totalGravada: 13.5,
//                     subTotalVentas: 13.5,
//                     descuNoSuj: 0,
//                     descuExenta: 0,
//                     descuGravada: 0,
//                     porcentajeDescuento: 0,
//                     totalDescu: 0,
//                     // tributos: null,
//                     subTotal: 13.5,
//                     ivaRete1: 0,
//                     reteRenta: 0,
//                     montoTotalOperacion: 13.5,
//                     totalNoGravado: 1.33,
//                     totalPagar: 14.83,
//                     totalLetras: "CATORCE 83/100 DOLARES AMERICANOS",
//                     // totalIva: 1.55,
//                     saldoFavor: 0,
//                     ivaPerci1: 0,
//                     condicionOperacion: 1,
//                     pagos: [
//                         {
//                             codigo: "01",
//                             montoPago: 13.5,
//                             referencia: "",
//                             plazo: null,
//                             periodo: null
//                         },
//                         {
//                             codigo: "03",
//                             montoPago: 1.33,
//                             referencia: "EXTRA TIP",
//                             plazo: null,
//                             periodo: null
//                         }
//                     ],
//                     // numPagoElectronico: null
//                 },
//                 apendice: null,
//                 extension: null,
//                 respuestaMH: {
//                     version: 2,
//                     ambiente: "00",
//                     versionApp: 2,
//                     estado: "PROCESADO",
//                     codigoGeneracion: "5BE2D117-73A8-450F-A853-FB902804618A",
//                     selloRecibido: "2025A62F854B1B1B4180AF561E5D187B4B78AFNP",
//                     fhProcesamiento: "26/09/2025 15:12:10",
//                     clasificaMsg: "10",
//                     codigoMsg: "001",
//                     descripcionMsg: "RECIBIDO",
//                     observaciones: []
//                 },
//                 firma: "eyJhbGciOiJSUzUxMiJ9.ewogICJpZGVudGlmaWNhY2lvbiIgOiB7CiAgICAidmVyc2lvbiIgOiAxLAogICAgImNvZGlnb0dlbmVyYWNpb24iIDogIjVCRTJEMTE3LTczQTgtNDUwRi1BODUzLUZCOTAyODA0NjE4QSIsCiAgICAiYW1iaWVudGUiIDogIjAwIiwKICAgICJ0aXBvRHRlIiA6ICIwMSIsCiAgICAibnVtZXJvQ29udHJvbCIgOiAiRFRFLTAxLU0wMDFQMDA2LTAwMDAwMDAwMDAwMDAwNyIsCiAgICAidGlwb01vZGVsbyIgOiAxLAogICAgInRpcG9PcGVyYWNpb24iIDogMSwKICAgICJ0aXBvQ29udGluZ2VuY2lhIiA6IG51bGwsCiAgICAibW90aXZvQ29udGluIiA6IG51bGwsCiAgICAidGlwb01vbmVkYSIgOiAiVVNEIiwKICAgICJmZWNFbWkiIDogIjIwMjUtMDktMjYiLAogICAgImhvckVtaSIgOiAiMTU6MTI6MDkiCiAgfSwKICAiZW1pc29yIiA6IHsKICAgICJuaXQiIDogIjA2MTQwNjExNjEwMDQwIiwKICAgICJucmMiIDogIjE4NjQwOTciLAogICAgIm5vbWJyZSIgOiAiQUxGQVJPIEdVWk1BTiwgQVJNSU4gQUxGT05TTyIsCiAgICAidGVsZWZvbm8iIDogIjAwMDAwMDAwIiwKICAgICJjb3JyZW8iIDogImNvcnJlb0Bjb3JyZW8uY29tIiwKICAgICJub21icmVDb21lcmNpYWwiIDogIkJPQ0EgT0xBUyIsCiAgICAiZGlyZWNjaW9uIiA6IHsKICAgICAgImRlcGFydGFtZW50byIgOiAiMDUiLAogICAgICAibXVuaWNpcGlvIiA6ICIyNyIsCiAgICAgICJjb21wbGVtZW50byIgOiAiQ2FycmV0ZXJhIExpdG9yYWwsIHBsYXlhIFN1bnphbCwga20uIDQyIDEvMiwgVGFtYW5pcXVlLCBMYSBMaWJlcnRhZC4iCiAgICB9LAogICAgImNvZEFjdGl2aWRhZCIgOiAiNTUxMDIiLAogICAgImRlc2NBY3RpdmlkYWQiIDogIkhPVEVMRVMiLAogICAgInRpcG9Fc3RhYmxlY2ltaWVudG8iIDogIjAyIiwKICAgICJjb2RFc3RhYmxlIiA6ICJNMDAxIiwKICAgICJjb2RFc3RhYmxlTUgiIDogIk0wMDEiLAogICAgImNvZFB1bnRvVmVudGEiIDogIlAwMDYiLAogICAgImNvZFB1bnRvVmVudGFNSCIgOiBudWxsCiAgfSwKICAicmVjZXB0b3IiIDogewogICAgInRpcG9Eb2N1bWVudG8iIDogIjM3IiwKICAgICJudW1Eb2N1bWVudG8iIDogbnVsbCwKICAgICJucmMiIDogbnVsbCwKICAgICJub21icmUiIDogIkNMSUVOVEUgVkFSSU9TIiwKICAgICJjb2RBY3RpdmlkYWQiIDogbnVsbCwKICAgICJkZXNjQWN0aXZpZGFkIiA6IG51bGwsCiAgICAiZGlyZWNjaW9uIiA6IHsKICAgICAgImRlcGFydGFtZW50byIgOiAiMDUiLAogICAgICAibXVuaWNpcGlvIiA6ICIyNyIsCiAgICAgICJjb21wbGVtZW50byIgOiAiTGEgbGliZXJ0YWQiCiAgICB9LAogICAgInRlbGVmb25vIiA6ICIwMDAwMDAwMCIsCiAgICAiY29ycmVvIiA6ICJpbmZvYm9jYW9sYXNAZ21haWwuY29tIgogIH0sCiAgIm90cm9zRG9jdW1lbnRvcyIgOiBudWxsLAogICJkb2N1bWVudG9SZWxhY2lvbmFkbyIgOiBudWxsLAogICJ2ZW50YVRlcmNlcm8iIDogbnVsbCwKICAiY3VlcnBvRG9jdW1lbnRvIiA6IFsgewogICAgIm51bUl0ZW0iIDogMSwKICAgICJ0aXBvSXRlbSIgOiAyLAogICAgInVuaU1lZGlkYSIgOiA1OSwKICAgICJudW1lcm9Eb2N1bWVudG8iIDogbnVsbCwKICAgICJjYW50aWRhZCIgOiAxLAogICAgImNvZGlnbyIgOiAiUFYtMDAwMDAxIiwKICAgICJjb2RUcmlidXRvIiA6IG51bGwsCiAgICAiZGVzY3JpcGNpb24iIDogIkNFVklDSEUgVFJPUElDQUwgQ0FNQVJPTiIsCiAgICAicHJlY2lvVW5pIiA6IDEzLjUsCiAgICAibW9udG9EZXNjdSIgOiAwLAogICAgInZlbnRhTm9TdWoiIDogMCwKICAgICJ2ZW50YUV4ZW50YSIgOiAwLAogICAgInZlbnRhR3JhdmFkYSIgOiAxMy41LAogICAgIml2YUl0ZW0iIDogMS41NSwKICAgICJ0cmlidXRvcyIgOiBudWxsLAogICAgInBzdiIgOiAwLAogICAgIm5vR3JhdmFkbyIgOiAwCiAgfSwgewogICAgIm51bUl0ZW0iIDogMiwKICAgICJ0aXBvSXRlbSIgOiAyLAogICAgInVuaU1lZGlkYSIgOiA1OSwKICAgICJudW1lcm9Eb2N1bWVudG8iIDogbnVsbCwKICAgICJjYW50aWRhZCIgOiAxLAogICAgImNvZGlnbyIgOiAiUFJPUElOQUVYVFJBIiwKICAgICJjb2RUcmlidXRvIiA6IG51bGwsCiAgICAiZGVzY3JpcGNpb24iIDogIlBST1BJTkEgRVhUUkEiLAogICAgInByZWNpb1VuaSIgOiAwLAogICAgIm1vbnRvRGVzY3UiIDogMCwKICAgICJ2ZW50YU5vU3VqIiA6IDAsCiAgICAidmVudGFFeGVudGEiIDogMCwKICAgICJ2ZW50YUdyYXZhZGEiIDogMCwKICAgICJpdmFJdGVtIiA6IDAsCiAgICAidHJpYnV0b3MiIDogbnVsbCwKICAgICJwc3YiIDogMCwKICAgICJub0dyYXZhZG8iIDogMS4zMwogIH0gXSwKICAicmVzdW1lbiIgOiB7CiAgICAidG90YWxOb1N1aiIgOiAwLAogICAgInRvdGFsRXhlbnRhIiA6IDAsCiAgICAidG90YWxHcmF2YWRhIiA6IDEzLjUsCiAgICAic3ViVG90YWxWZW50YXMiIDogMTMuNSwKICAgICJkZXNjdU5vU3VqIiA6IDAsCiAgICAiZGVzY3VFeGVudGEiIDogMCwKICAgICJkZXNjdUdyYXZhZGEiIDogMCwKICAgICJwb3JjZW50YWplRGVzY3VlbnRvIiA6IDAsCiAgICAidG90YWxEZXNjdSIgOiAwLAogICAgInRyaWJ1dG9zIiA6IG51bGwsCiAgICAic3ViVG90YWwiIDogMTMuNSwKICAgICJpdmFSZXRlMSIgOiAwLAogICAgInJldGVSZW50YSIgOiAwLAogICAgIm1vbnRvVG90YWxPcGVyYWNpb24iIDogMTMuNSwKICAgICJ0b3RhbE5vR3JhdmFkbyIgOiAxLjMzLAogICAgInRvdGFsUGFnYXIiIDogMTQuODMsCiAgICAidG90YWxMZXRyYXMiIDogIkNBVE9SQ0UgODMvMTAwIERPTEFSRVMgQU1FUklDQU5PUyIsCiAgICAidG90YWxJdmEiIDogMS41NSwKICAgICJzYWxkb0Zhdm9yIiA6IDAsCiAgICAiY29uZGljaW9uT3BlcmFjaW9uIiA6IDEsCiAgICAicGFnb3MiIDogWyB7CiAgICAgICJjb2RpZ28iIDogIjAxIiwKICAgICAgIm1vbnRvUGFnbyIgOiAxMy41LAogICAgICAicmVmZXJlbmNpYSIgOiAiIiwKICAgICAgInBsYXpvIiA6IG51bGwsCiAgICAgICJwZXJpb2RvIiA6IG51bGwKICAgIH0sIHsKICAgICAgImNvZGlnbyIgOiAiMDMiLAogICAgICAibW9udG9QYWdvIiA6IDEuMzMsCiAgICAgICJyZWZlcmVuY2lhIiA6ICJFWFRSQSBUSVAiLAogICAgICAicGxhem8iIDogbnVsbCwKICAgICAgInBlcmlvZG8iIDogbnVsbAogICAgfSBdLAogICAgIm51bVBhZ29FbGVjdHJvbmljbyIgOiBudWxsCiAgfSwKICAiYXBlbmRpY2UiIDogbnVsbCwKICAiZXh0ZW5zaW9uIiA6IG51bGwKfQ.MDvZC-p0yloiNDNe2GTNZCGBCAaW3gOD8jICtnb9_bHpB9R-kuBE77EhLSbnXjhXzvcdB0erL6HVzto19eiSZKk2VjBQqHOalucznzIaNTBk2fAaWBB8bI2l9jiRALyZMm_HsDi8VZf-_yWGM8hjduNSbivvWNZAz85ab6jCcin6WDspA3Ibnmmno8M2nk359rmNUJZYeYYFufeygsFJ7ej265qdSbCJ5gKumSDmpLRQDlyqxxRvIdVtXgVqOoaaZKyLh8NBgPQ0ih-lyg8eFm7N3LEL1lSpQSw8STYgUN2QdKe6lfuvcjnbqANJ0lezDqBXu7ksrv3lFNVFMjznsQ"
//             },
//             logoWidth: 100,
//             logoHeight: 50,
//             showDescActivity: true
//         });

//         // Guardar el PDF en disco
//         const outputPath = path.join(__dirname, "preview.pdf");
//         fs.writeFileSync(outputPath, Buffer.from(arrayBuffer));

//         console.log("✅ PDF generado:", outputPath);
//     } catch (error) {
//         console.error(error);
//     }
// })();


// // (async () => {
// //     try {
// //         const arrayBuffer = await generateSvfe01(
// //             {
// //                 identificacion: {
// //                     version: 1,
// //                     codigoGeneracion: "5BE2D117-73A8-450F-A853-FB902804618A",
// //                     ambiente: "00",
// //                     tipoDte: "01",
// //                     numeroControl: "DTE-01-M001P006-000000000000007",
// //                     tipoModelo: 1,
// //                     tipoOperacion: 1,
// //                     tipoContingencia: null,
// //                     motivoContin: null,
// //                     tipoMoneda: "USD",
// //                     fecEmi: "2025-09-26",
// //                     horEmi: "15:12:09"
// //                 },
// //                 emisor: {
// //                     nit: "06140611610040",
// //                     nrc: "1864097",
// //                     nombre: "ALFARO GUZMAN, ARMIN ALFONSO",
// //                     telefono: "00000000",
// //                     correo: "correo@correo.com",
// //                     nombreComercial: "BOCA OLAS",
// //                     direccion: {
// //                         departamento: "05",
// //                         municipio: "27",
// //                         complemento: "Carretera Litoral, playa Sunzal, km. 42 1/2, Tamanique, La Libertad."
// //                     },
// //                     codActividad: "55102",
// //                     descActividad: "Venta al por menor de productos de panadería, repostería y galletas",
// //                     tipoEstablecimiento: "02",
// //                     codEstable: "M001",
// //                     codEstableMH: "M001",
// //                     codPuntoVenta: "P006",
// //                     codPuntoVentaMH: null
// //                 },
// //                 receptor: {
// //                     nrc: "3165298",
// //                     nombre: "José Manuel Márquez Hernández",
// //                     codActividad: "62020",
// //                     descActividad: "Consultorías y gestión de servicios informáticos",
// //                     // nombreComercial: "SeedCodeSv",
// //                     tipoDocumento: '',
// //                     numDocumento: "",
// //                     direccion: {
// //                         departamento: "05",
// //                         municipio: "27",
// //                         complemento: "Carretera Litoral, playa Sunzal, km. 42 1/2, Tamanique, La Libertad."
// //                     },
// //                     telefono: "00000000",
// //                     correo: "alexandramoran9704@gmail.com"
// //                 },
// //                 otrosDocumentos: null,
// //                 documentoRelacionado: null,
// //                 ventaTercero: null,
// //                 cuerpoDocumento: [
// //                     {
// //                         numItem: 1,
// //                         tipoItem: 2,
// //                         uniMedida: 59,
// //                         numeroDocumento: null,
// //                         cantidad: 1,
// //                         codigo: "PV-000001",
// //                         codTributo: null,
// //                         descripcion: "CEVICHE TROPICAL CAMARON",
// //                         precioUni: 13.5,
// //                         montoDescu: 0,
// //                         ventaNoSuj: 0,
// //                         ventaExenta: 0,
// //                         ventaGravada: 13.5,
// //                         ivaItem: 1.55,
// //                         tributos: null,
// //                         psv: 0,
// //                         noGravado: 0

// //                     },
// //                     // {
// //                     //     numItem: 2,
// //                     //     tipoItem: 2,
// //                     //     uniMedida: 59,
// //                     //     numeroDocumento: null,
// //                     //     cantidad: 1,
// //                     //     codigo: "PROPINAEXTRA",
// //                     //     codTributo: null,
// //                     //     descripcion: "PROPINA EXTRA",
// //                     //     precioUni: 0,
// //                     //     montoDescu: 0,
// //                     //     ventaNoSuj: 0,
// //                     //     ventaExenta: 0,
// //                     //     ventaGravada: 0,
// //                     //      ivaItem: 0,
// //                     //     tributos: null,
// //                     //     psv: 0,
// //                     //     noGravado: 1.33
// //                     // }
// //                 ],
// //                 resumen: {
// //                     totalNoSuj: 0,
// //                     totalExenta: 0,
// //                     totalGravada: 13.5,
// //                     subTotalVentas: 13.5,
// //                     descuNoSuj: 0,
// //                     descuExenta: 0,
// //                     descuGravada: 0,
// //                     porcentajeDescuento: 0,
// //                     totalDescu: 0,
// //                     tributos: null,
// //                     subTotal: 13.5,
// //                     ivaRete1: 0,
// //                     reteRenta: 0,
// //                     montoTotalOperacion: 13.5,
// //                     totalNoGravado: 1.33,
// //                     totalPagar: 14.83,
// //                     totalLetras: "CATORCE 83/100 DOLARES AMERICANOS",
// //                     totalIva: 1.55,
// //                     saldoFavor: 0,
// //                     ivaPerci1: 0,
// //                     condicionOperacion: 1,
// //                     pagos: [
// //                         {
// //                             codigo: "01",
// //                             montoPago: 13.5,
// //                             referencia: "",
// //                             plazo: null,
// //                             periodo: null
// //                         },
// //                         {
// //                             codigo: "03",
// //                             montoPago: 1.33,
// //                             referencia: "EXTRA TIP",
// //                             plazo: null,
// //                             periodo: null
// //                         }
// //                     ],
// //                     numPagoElectronico: null
// //                 },
// //                 apendice: null,
// //                 extension: null,
// //                 respuestaMH: {
// //                     version: 2,
// //                     ambiente: "00",
// //                     versionApp: 2,
// //                     estado: "PROCESADO",
// //                     codigoGeneracion: "5BE2D117-73A8-450F-A853-FB902804618A",
// //                     selloRecibido: "2025A62F854B1B1B4180AF561E5D187B4B78AFNP",
// //                     fhProcesamiento: "26/09/2025 15:12:10",
// //                     clasificaMsg: "10",
// //                     codigoMsg: "001",
// //                     descripcionMsg: "RECIBIDO",
// //                     observaciones: []
// //                 },
// //                 firma: "eyJhbGciOiJSUzUxMiJ9.ewogICJpZGVudGlmaWNhY2lvbiIgOiB7CiAgICAidmVyc2lvbiIgOiAxLAogICAgImNvZGlnb0dlbmVyYWNpb24iIDogIjVCRTJEMTE3LTczQTgtNDUwRi1BODUzLUZCOTAyODA0NjE4QSIsCiAgICAiYW1iaWVudGUiIDogIjAwIiwKICAgICJ0aXBvRHRlIiA6ICIwMSIsCiAgICAibnVtZXJvQ29udHJvbCIgOiAiRFRFLTAxLU0wMDFQMDA2LTAwMDAwMDAwMDAwMDAwNyIsCiAgICAidGlwb01vZGVsbyIgOiAxLAogICAgInRpcG9PcGVyYWNpb24iIDogMSwKICAgICJ0aXBvQ29udGluZ2VuY2lhIiA6IG51bGwsCiAgICAibW90aXZvQ29udGluIiA6IG51bGwsCiAgICAidGlwb01vbmVkYSIgOiAiVVNEIiwKICAgICJmZWNFbWkiIDogIjIwMjUtMDktMjYiLAogICAgImhvckVtaSIgOiAiMTU6MTI6MDkiCiAgfSwKICAiZW1pc29yIiA6IHsKICAgICJuaXQiIDogIjA2MTQwNjExNjEwMDQwIiwKICAgICJucmMiIDogIjE4NjQwOTciLAogICAgIm5vbWJyZSIgOiAiQUxGQVJPIEdVWk1BTiwgQVJNSU4gQUxGT05TTyIsCiAgICAidGVsZWZvbm8iIDogIjAwMDAwMDAwIiwKICAgICJjb3JyZW8iIDogImNvcnJlb0Bjb3JyZW8uY29tIiwKICAgICJub21icmVDb21lcmNpYWwiIDogIkJPQ0EgT0xBUyIsCiAgICAiZGlyZWNjaW9uIiA6IHsKICAgICAgImRlcGFydGFtZW50byIgOiAiMDUiLAogICAgICAibXVuaWNpcGlvIiA6ICIyNyIsCiAgICAgICJjb21wbGVtZW50byIgOiAiQ2FycmV0ZXJhIExpdG9yYWwsIHBsYXlhIFN1bnphbCwga20uIDQyIDEvMiwgVGFtYW5pcXVlLCBMYSBMaWJlcnRhZC4iCiAgICB9LAogICAgImNvZEFjdGl2aWRhZCIgOiAiNTUxMDIiLAogICAgImRlc2NBY3RpdmlkYWQiIDogIkhPVEVMRVMiLAogICAgInRpcG9Fc3RhYmxlY2ltaWVudG8iIDogIjAyIiwKICAgICJjb2RFc3RhYmxlIiA6ICJNMDAxIiwKICAgICJjb2RFc3RhYmxlTUgiIDogIk0wMDEiLAogICAgImNvZFB1bnRvVmVudGEiIDogIlAwMDYiLAogICAgImNvZFB1bnRvVmVudGFNSCIgOiBudWxsCiAgfSwKICAicmVjZXB0b3IiIDogewogICAgInRpcG9Eb2N1bWVudG8iIDogIjM3IiwKICAgICJudW1Eb2N1bWVudG8iIDogbnVsbCwKICAgICJucmMiIDogbnVsbCwKICAgICJub21icmUiIDogIkNMSUVOVEUgVkFSSU9TIiwKICAgICJjb2RBY3RpdmlkYWQiIDogbnVsbCwKICAgICJkZXNjQWN0aXZpZGFkIiA6IG51bGwsCiAgICAiZGlyZWNjaW9uIiA6IHsKICAgICAgImRlcGFydGFtZW50byIgOiAiMDUiLAogICAgICAibXVuaWNpcGlvIiA6ICIyNyIsCiAgICAgICJjb21wbGVtZW50byIgOiAiTGEgbGliZXJ0YWQiCiAgICB9LAogICAgInRlbGVmb25vIiA6ICIwMDAwMDAwMCIsCiAgICAiY29ycmVvIiA6ICJpbmZvYm9jYW9sYXNAZ21haWwuY29tIgogIH0sCiAgIm90cm9zRG9jdW1lbnRvcyIgOiBudWxsLAogICJkb2N1bWVudG9SZWxhY2lvbmFkbyIgOiBudWxsLAogICJ2ZW50YVRlcmNlcm8iIDogbnVsbCwKICAiY3VlcnBvRG9jdW1lbnRvIiA6IFsgewogICAgIm51bUl0ZW0iIDogMSwKICAgICJ0aXBvSXRlbSIgOiAyLAogICAgInVuaU1lZGlkYSIgOiA1OSwKICAgICJudW1lcm9Eb2N1bWVudG8iIDogbnVsbCwKICAgICJjYW50aWRhZCIgOiAxLAogICAgImNvZGlnbyIgOiAiUFYtMDAwMDAxIiwKICAgICJjb2RUcmlidXRvIiA6IG51bGwsCiAgICAiZGVzY3JpcGNpb24iIDogIkNFVklDSEUgVFJPUElDQUwgQ0FNQVJPTiIsCiAgICAicHJlY2lvVW5pIiA6IDEzLjUsCiAgICAibW9udG9EZXNjdSIgOiAwLAogICAgInZlbnRhTm9TdWoiIDogMCwKICAgICJ2ZW50YUV4ZW50YSIgOiAwLAogICAgInZlbnRhR3JhdmFkYSIgOiAxMy41LAogICAgIml2YUl0ZW0iIDogMS41NSwKICAgICJ0cmlidXRvcyIgOiBudWxsLAogICAgInBzdiIgOiAwLAogICAgIm5vR3JhdmFkbyIgOiAwCiAgfSwgewogICAgIm51bUl0ZW0iIDogMiwKICAgICJ0aXBvSXRlbSIgOiAyLAogICAgInVuaU1lZGlkYSIgOiA1OSwKICAgICJudW1lcm9Eb2N1bWVudG8iIDogbnVsbCwKICAgICJjYW50aWRhZCIgOiAxLAogICAgImNvZGlnbyIgOiAiUFJPUElOQUVYVFJBIiwKICAgICJjb2RUcmlidXRvIiA6IG51bGwsCiAgICAiZGVzY3JpcGNpb24iIDogIlBST1BJTkEgRVhUUkEiLAogICAgInByZWNpb1VuaSIgOiAwLAogICAgIm1vbnRvRGVzY3UiIDogMCwKICAgICJ2ZW50YU5vU3VqIiA6IDAsCiAgICAidmVudGFFeGVudGEiIDogMCwKICAgICJ2ZW50YUdyYXZhZGEiIDogMCwKICAgICJpdmFJdGVtIiA6IDAsCiAgICAidHJpYnV0b3MiIDogbnVsbCwKICAgICJwc3YiIDogMCwKICAgICJub0dyYXZhZG8iIDogMS4zMwogIH0gXSwKICAicmVzdW1lbiIgOiB7CiAgICAidG90YWxOb1N1aiIgOiAwLAogICAgInRvdGFsRXhlbnRhIiA6IDAsCiAgICAidG90YWxHcmF2YWRhIiA6IDEzLjUsCiAgICAic3ViVG90YWxWZW50YXMiIDogMTMuNSwKICAgICJkZXNjdU5vU3VqIiA6IDAsCiAgICAiZGVzY3VFeGVudGEiIDogMCwKICAgICJkZXNjdUdyYXZhZGEiIDogMCwKICAgICJwb3JjZW50YWplRGVzY3VlbnRvIiA6IDAsCiAgICAidG90YWxEZXNjdSIgOiAwLAogICAgInRyaWJ1dG9zIiA6IG51bGwsCiAgICAic3ViVG90YWwiIDogMTMuNSwKICAgICJpdmFSZXRlMSIgOiAwLAogICAgInJldGVSZW50YSIgOiAwLAogICAgIm1vbnRvVG90YWxPcGVyYWNpb24iIDogMTMuNSwKICAgICJ0b3RhbE5vR3JhdmFkbyIgOiAxLjMzLAogICAgInRvdGFsUGFnYXIiIDogMTQuODMsCiAgICAidG90YWxMZXRyYXMiIDogIkNBVE9SQ0UgODMvMTAwIERPTEFSRVMgQU1FUklDQU5PUyIsCiAgICAidG90YWxJdmEiIDogMS41NSwKICAgICJzYWxkb0Zhdm9yIiA6IDAsCiAgICAiY29uZGljaW9uT3BlcmFjaW9uIiA6IDEsCiAgICAicGFnb3MiIDogWyB7CiAgICAgICJjb2RpZ28iIDogIjAxIiwKICAgICAgIm1vbnRvUGFnbyIgOiAxMy41LAogICAgICAicmVmZXJlbmNpYSIgOiAiIiwKICAgICAgInBsYXpvIiA6IG51bGwsCiAgICAgICJwZXJpb2RvIiA6IG51bGwKICAgIH0sIHsKICAgICAgImNvZGlnbyIgOiAiMDMiLAogICAgICAibW9udG9QYWdvIiA6IDEuMzMsCiAgICAgICJyZWZlcmVuY2lhIiA6ICJFWFRSQSBUSVAiLAogICAgICAicGxhem8iIDogbnVsbCwKICAgICAgInBlcmlvZG8iIDogbnVsbAogICAgfSBdLAogICAgIm51bVBhZ29FbGVjdHJvbmljbyIgOiBudWxsCiAgfSwKICAiYXBlbmRpY2UiIDogbnVsbCwKICAiZXh0ZW5zaW9uIiA6IG51bGwKfQ.MDvZC-p0yloiNDNe2GTNZCGBCAaW3gOD8jICtnb9_bHpB9R-kuBE77EhLSbnXjhXzvcdB0erL6HVzto19eiSZKk2VjBQqHOalucznzIaNTBk2fAaWBB8bI2l9jiRALyZMm_HsDi8VZf-_yWGM8hjduNSbivvWNZAz85ab6jCcin6WDspA3Ibnmmno8M2nk359rmNUJZYeYYFufeygsFJ7ej265qdSbCJ5gKumSDmpLRQDlyqxxRvIdVtXgVqOoaaZKyLh8NBgPQ0ih-lyg8eFm7N3LEL1lSpQSw8STYgUN2QdKe6lfuvcjnbqANJ0lezDqBXu7ksrv3lFNVFMjznsQ"

// //             },
// //             undefined, // logo
// //             undefined, // selloInvalidacion
// //             undefined, // contingence
// //             undefined, // canInvertName
// //             undefined, // splitNameInTwoLines
// //             true
// //         );

// //         // Guardar el PDF en disco
// //         const outputPath = path.join(__dirname, "preview.pdf");
// //         fs.writeFileSync(outputPath, Buffer.from(arrayBuffer));

// //         console.log("✅ PDF generado:", outputPath);
// //     } catch (error) {
// //         console.error(error);
// //     }
// // })();
