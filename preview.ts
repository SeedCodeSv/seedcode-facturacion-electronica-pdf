// import fs from "fs";
// import path from "path";
// import { generateSvfe01, generateSvfe01_2, generateSvfe03, generateSvfe03_2, generateSvfe14_2 } from "./dist/main"; // Ajusta la ruta si tu build está en otro lado
// import { generateSvfe05_2 } from "./pdf/template2/dte05_2.pdf";
// import { DteCcf, generateSvfe03 } from "./main";

// (async () => {
//     try {

//         const svfe03 = {
//   identificacion: {
//     version: 3,
//     codigoGeneracion: "057AD891-1724-461E-8E75-53FDE126412D",
//     ambiente: "01",
//     tipoDte: "03",
//     numeroControl: "DTE-03-S001P001-000000000000044",
//     tipoModelo: 1,
//     tipoOperacion: 1,
//     tipoContingencia: null,
//     motivoContin: null,
//     tipoMoneda: "USD",
//     fecEmi: "2025-12-30",
//     horEmi: "13:10:56",
//   },

//   documentoRelacionado: null,

//   emisor: {
//     nit: "03152408791028",
//     nrc: "1612792",
//     nombre: "JOSE CARLOS ESCOBAR AYALA",
//     nombreComercial: "PUNTA DIAMANTES",
//     codActividad: "47739",
//     descActividad: "VENTA AL POR MENOR DE OTROS PRODUCTOS N.C.P",
//     tipoEstablecimiento: "01",
//     direccion: {
//       departamento: "12",
//       municipio: "12",
//       complemento: "12",
//     },
//     telefono: "00000000",
//     correo: "ramoshenry0709@gmail.com",
//     codEstable: "S001",
//     codEstableMH: "S001",
//     codPuntoVenta: "P001",
//     codPuntoVentaMH: null,
//   },

//   receptor: {
//     nit: "06142012881313",
//     nrc: "2992284",
//     nombre: "URRUTIA PALACIOS, MAURICIO ORLANDO",
//     codActividad: "69200",
//     descActividad:
//       "ACTIVIDADES DE CONTABILIDAD, TENEDURÍA DE LIBROS Y AUDITORÍA; ASESORAMIENTO EN MATERIA DE IMPUESTOS",
//     nombreComercial: "URRUTIA PALACIOS, MAURICIO ORLANDO",
//     direccion: {
//       departamento: "06",
//       municipio: "24",
//       complemento: "PSJ. A, URB. LOS ALPES II, #7, SAN MARCOS",
//     },
//     telefono: "77633395",
//     correo: "ramoshenry0709@gmail.com",
//   },

//   otrosDocumentos: null,
//   ventaTercero: null,

//   cuerpoDocumento: [
//     {
//       numItem: 1,
//       tipoItem: 1,
//       uniMedida: 59,
//       numeroDocumento: null,
//       cantidad: 2,
//       codigo: "TIPI2172",
//       codTributo: null,
//       descripcion: "TIPICO SALVADOREÑO",
//       precioUni: 0,
//       montoDescu: 0,
//       ventaNoSuj: 0,
//       ventaExenta: 0,
//       ventaGravada: 0,
//       tributos: ["20"],
//       psv: 0,
//       noGravado: 0,
//     },
//     {
//       numItem: 2,
//       tipoItem: 1,
//       uniMedida: 59,
//       numeroDocumento: null,
//       cantidad: 1,
//       codigo: "CAFE0860",
//       codTributo: null,
//       descripcion: "CAFE (INCLUIDO)",
//       precioUni: 0,
//       montoDescu: 0,
//       ventaNoSuj: 0,
//       ventaExenta: 0,
//       ventaGravada: 0,
//       tributos: ["20"],
//       psv: 0,
//       noGravado: 0,
//     },
//     {
//       numItem: 3,
//       tipoItem: 1,
//       uniMedida: 59,
//       numeroDocumento: null,
//       cantidad: 1,
//       codigo: "AGUA5517",
//       codTributo: null,
//       descripcion: "AGUA",
//       precioUni: 0.885,
//       montoDescu: 0,
//       ventaNoSuj: 0,
//       ventaExenta: 0,
//       ventaGravada: 0.88,
//       tributos: ["20"],
//       psv: 0.4,
//       noGravado: 0,
//     },
//     {
//       numItem: 4,
//       tipoItem: 1,
//       uniMedida: 59,
//       numeroDocumento: null,
//       cantidad: 2,
//       codigo: "MARI9562",
//       codTributo: null,
//       descripcion: "MARISCADA CON CREMA",
//       precioUni: 15.4425,
//       montoDescu: 0,
//       ventaNoSuj: 0,
//       ventaExenta: 0,
//       ventaGravada: 30.88,
//       tributos: ["20"],
//       psv: 0,
//       noGravado: 0,
//     },
//     {
//       numItem: 5,
//       tipoItem: 1,
//       uniMedida: 59,
//       numeroDocumento: null,
//       cantidad: 2,
//       codigo: "PIÑA5222",
//       codTributo: null,
//       descripcion: "PIÑA COLADA SIN LICOR",
//       precioUni: 3.3186,
//       montoDescu: 0,
//       ventaNoSuj: 0,
//       ventaExenta: 0,
//       ventaGravada: 6.64,
//       tributos: ["20"],
//       psv: 0,
//       noGravado: 0,
//     },
//     {
//       numItem: 6,
//       tipoItem: 1,
//       uniMedida: 59,
//       numeroDocumento: null,
//       cantidad: 1,
//       codigo: "PROPINA",
//       codTributo: null,
//       descripcion: "PROPINA",
//       precioUni: 0,
//       montoDescu: 0,
//       ventaNoSuj: 0,
//       ventaExenta: 0,
//       ventaGravada: 0,
//       tributos: null,
//       psv: 0,
//       noGravado: 4.34,
//     },
//   ],

//   resumen: {
//     totalNoSuj: 0,
//     totalExenta: 0,
//     totalGravada: 38.41,
//     subTotalVentas: 38.41,
//     descuNoSuj: 0,
//     descuExenta: 0,
//     descuGravada: 0,
//     porcentajeDescuento: 0,
//     totalDescu: 0,
//     tributos: [
//       {
//         codigo: "20",
//         descripcion: "Impuesto al Valor Agregado 13%",
//         valor: 4.99,
//       },
//     ],
//     subTotal: 38.41,
//     ivaRete1: 0,
//     reteRenta: 0,
//     ivaPerci1: 0,
//     montoTotalOperacion: 43.4,
//     totalNoGravado: 4.34,
//     totalPagar: 47.74,
//     totalLetras: "CUARENTA Y SIETE 74/100 DOLARES AMERICANOS",
//     saldoFavor: 0,
//     condicionOperacion: 1,
//     pagos: [
//       {
//         codigo: "03",
//         plazo: null,
//         periodo: null,
//         montoPago: 47.74,
//         referencia: "",
//       },
//     ],
//     numPagoElectronico: null,
//   },

//   extension: null,
//   apendice: null,
//    respuestaMH: {
//     version: 2,
//     ambiente: "01",
//     versionApp: 2,
//     estado: "PROCESADO",
//     codigoGeneracion: "057AD891-1724-461E-8E75-53FDE126412D",
//     selloRecibido: "20256F9899A0525C4D9E9AE99F397D26F518BLAR",
//     fhProcesamiento: "30/12/2025 13:10:56",
//     clasificaMsg: "10",
//     codigoMsg: "001",
//     descripcionMsg: "RECIBIDO",
//     observaciones: []
//   },
//   firma: "eyJhbGciOiJSUzUxMiJ9.ewogICJpZGVudGlmaWNhY2lvbiIgOiB7CiAgICAidmVyc2lvbiIgOiAzLAogICAgImNvZGlnb0dlbmVyYWNpb24iIDogIjA1N0FEODkxLTE3MjQtNDYxRS04RTc1LTUzRkRFMTI2NDEyRCIsCiAgICAiYW1iaWVudGUiIDogIjAxIiwKICAgICJ0aXBvRHRlIiA6ICIwMyIsCiAgICAibnVtZXJvQ29udHJvbCIgOiAiRFRFLTAzLVMwMDFQMDAxLTAwMDAwMDAwMDAwMDA0NCIsCiAgICAidGlwb01vZGVsbyIgOiAxLAogICAgInRpcG9PcGVyYWNpb24iIDogMSwKICAgICJ0aXBvQ29udGluZ2VuY2lhIiA6IG51bGwsCiAgICAibW90aXZvQ29udGluIiA6IG51bGwsCiAgICAidGlwb01vbmVkYSIgOiAiVVNEIiwKICAgICJmZWNFbWkiIDogIjIwMjUtMTItMzAiLAogICAgImhvckVtaSIgOiAiMTM6MTA6NTYiCiAgfSwKICAiZG9jdW1lbnRvUmVsYWNpb25hZG8iIDogbnVsbCwKICAiZW1pc29yIiA6IHsKICAgICJuaXQiIDogIjAzMTUyNDA4NzkxMDI4IiwKICAgICJucmMiIDogIjE2MTI3OTIiLAogICAgIm5vbWJyZSIgOiAiSk9TRSBDQVJMT1MgRVNDT0JBUiBBWUFMQSIsCiAgICAibm9tYnJlQ29tZXJjaWFsIiA6ICJQVU5UQSBESUFNQU5URVMiLAogICAgImNvZEFjdGl2aWRhZCIgOiAiNDc3MzkiLAogICAgImRlc2NBY3RpdmlkYWQiIDogIlZFTlRBIEFMIFBPUiBNRU5PUiBERSBPVFJPUyBQUk9EVUNUT1MgTi5DLlAiLAogICAgInRpcG9Fc3RhYmxlY2ltaWVudG8iIDogIjAxIiwKICAgICJkaXJlY2Npb24iIDogewogICAgICAiZGVwYXJ0YW1lbnRvIiA6ICIxMiIsCiAgICAgICJtdW5pY2lwaW8iIDogIjEyIiwKICAgICAgImNvbXBsZW1lbnRvIiA6ICIxMiIKICAgIH0sCiAgICAidGVsZWZvbm8iIDogIjAwMDAwMDAwIiwKICAgICJjb3JyZW8iIDogImZhY3R1cmFjaW9ucHVudGFkaWFtYW50ZXNAZ21haWwuY29tIiwKICAgICJjb2RFc3RhYmxlIiA6ICJTMDAxIiwKICAgICJjb2RFc3RhYmxlTUgiIDogIlMwMDEiLAogICAgImNvZFB1bnRvVmVudGEiIDogIlAwMDEiLAogICAgImNvZFB1bnRvVmVudGFNSCIgOiBudWxsCiAgfSwKICAicmVjZXB0b3IiIDogewogICAgIm5pdCIgOiAiMDYxNDIwMTI4ODEzMTMiLAogICAgIm5yYyIgOiAiMjk5MjI4NCIsCiAgICAibm9tYnJlIiA6ICJVUlJVVElBIFBBTEFDSU9TLCBNQVVSSUNJTyBPUkxBTkRPICIsCiAgICAiY29kQWN0aXZpZGFkIiA6ICI2OTIwMCIsCiAgICAiZGVzY0FjdGl2aWRhZCIgOiAiQUNUSVZJREFERVMgREUgQ09OVEFCSUxJREFELCBURU5FRFVSw41BIERFIExJQlJPUyBZIEFVRElUT1LDjUE7IEFTRVNPUkFNSUVOVE8gRU4gTUFURVJJQSBERSBJTVBVRVNUT1MiLAogICAgIm5vbWJyZUNvbWVyY2lhbCIgOiAiVVJSVVRJQSBQQUxBQ0lPUywgTUFVUklDSU8gT1JMQU5ETyAiLAogICAgImRpcmVjY2lvbiIgOiB7CiAgICAgICJkZXBhcnRhbWVudG8iIDogIjA2IiwKICAgICAgIm11bmljaXBpbyIgOiAiMjQiLAogICAgICAiY29tcGxlbWVudG8iIDogIlBTSi4gQSwgVVJCLiBMT1MgQUxQRVMgSUksICM3LCBTQU4gTUFSQ09TIgogICAgfSwKICAgICJ0ZWxlZm9ubyIgOiAiNzc2MzMzOTUiLAogICAgImNvcnJlbyIgOiAibWF1bGFuZG8xNzIwQGdtYWlsLmNvbSIKICB9LAogICJvdHJvc0RvY3VtZW50b3MiIDogbnVsbCwKICAidmVudGFUZXJjZXJvIiA6IG51bGwsCiAgImN1ZXJwb0RvY3VtZW50byIgOiBbIHsKICAgICJudW1JdGVtIiA6IDEsCiAgICAidGlwb0l0ZW0iIDogMSwKICAgICJ1bmlNZWRpZGEiIDogNTksCiAgICAibnVtZXJvRG9jdW1lbnRvIiA6IG51bGwsCiAgICAiY2FudGlkYWQiIDogMiwKICAgICJjb2RpZ28iIDogIlRJUEkyMTcyIiwKICAgICJjb2RUcmlidXRvIiA6IG51bGwsCiAgICAiZGVzY3JpcGNpb24iIDogIlRJUElDTyBTQUxWQURPUkXDkU8iLAogICAgInByZWNpb1VuaSIgOiAwLAogICAgIm1vbnRvRGVzY3UiIDogMCwKICAgICJ2ZW50YU5vU3VqIiA6IDAsCiAgICAidmVudGFFeGVudGEiIDogMCwKICAgICJ2ZW50YUdyYXZhZGEiIDogMCwKICAgICJ0cmlidXRvcyIgOiBbICIyMCIgXSwKICAgICJwc3YiIDogMCwKICAgICJub0dyYXZhZG8iIDogMAogIH0sIHsKICAgICJudW1JdGVtIiA6IDIsCiAgICAidGlwb0l0ZW0iIDogMSwKICAgICJ1bmlNZWRpZGEiIDogNTksCiAgICAibnVtZXJvRG9jdW1lbnRvIiA6IG51bGwsCiAgICAiY2FudGlkYWQiIDogMSwKICAgICJjb2RpZ28iIDogIkNBRkUwODYwIiwKICAgICJjb2RUcmlidXRvIiA6IG51bGwsCiAgICAiZGVzY3JpcGNpb24iIDogIkNBRkUgKElOQ0xVSURPKSIsCiAgICAicHJlY2lvVW5pIiA6IDAsCiAgICAibW9udG9EZXNjdSIgOiAwLAogICAgInZlbnRhTm9TdWoiIDogMCwKICAgICJ2ZW50YUV4ZW50YSIgOiAwLAogICAgInZlbnRhR3JhdmFkYSIgOiAwLAogICAgInRyaWJ1dG9zIiA6IFsgIjIwIiBdLAogICAgInBzdiIgOiAwLAogICAgIm5vR3JhdmFkbyIgOiAwCiAgfSwgewogICAgIm51bUl0ZW0iIDogMywKICAgICJ0aXBvSXRlbSIgOiAxLAogICAgInVuaU1lZGlkYSIgOiA1OSwKICAgICJudW1lcm9Eb2N1bWVudG8iIDogbnVsbCwKICAgICJjYW50aWRhZCIgOiAxLAogICAgImNvZGlnbyIgOiAiQUdVQTU1MTciLAogICAgImNvZFRyaWJ1dG8iIDogbnVsbCwKICAgICJkZXNjcmlwY2lvbiIgOiAiQUdVQSIsCiAgICAicHJlY2lvVW5pIiA6IDAuODg1LAogICAgIm1vbnRvRGVzY3UiIDogMCwKICAgICJ2ZW50YU5vU3VqIiA6IDAsCiAgICAidmVudGFFeGVudGEiIDogMCwKICAgICJ2ZW50YUdyYXZhZGEiIDogMC44OCwKICAgICJ0cmlidXRvcyIgOiBbICIyMCIgXSwKICAgICJwc3YiIDogMC40LAogICAgIm5vR3JhdmFkbyIgOiAwCiAgfSwgewogICAgIm51bUl0ZW0iIDogNCwKICAgICJ0aXBvSXRlbSIgOiAxLAogICAgInVuaU1lZGlkYSIgOiA1OSwKICAgICJudW1lcm9Eb2N1bWVudG8iIDogbnVsbCwKICAgICJjYW50aWRhZCIgOiAyLAogICAgImNvZGlnbyIgOiAiTUFSSTk1NjIiLAogICAgImNvZFRyaWJ1dG8iIDogbnVsbCwKICAgICJkZXNjcmlwY2lvbiIgOiAiTUFSSVNDQURBIENPTiBDUkVNQSAiLAogICAgInByZWNpb1VuaSIgOiAxNS40NDI1LAogICAgIm1vbnRvRGVzY3UiIDogMCwKICAgICJ2ZW50YU5vU3VqIiA6IDAsCiAgICAidmVudGFFeGVudGEiIDogMCwKICAgICJ2ZW50YUdyYXZhZGEiIDogMzAuODgsCiAgICAidHJpYnV0b3MiIDogWyAiMjAiIF0sCiAgICAicHN2IiA6IDAsCiAgICAibm9HcmF2YWRvIiA6IDAKICB9LCB7CiAgICAibnVtSXRlbSIgOiA1LAogICAgInRpcG9JdGVtIiA6IDEsCiAgICAidW5pTWVkaWRhIiA6IDU5LAogICAgIm51bWVyb0RvY3VtZW50byIgOiBudWxsLAogICAgImNhbnRpZGFkIiA6IDIsCiAgICAiY29kaWdvIiA6ICJQScORQTUyMjIiLAogICAgImNvZFRyaWJ1dG8iIDogbnVsbCwKICAgICJkZXNjcmlwY2lvbiIgOiAiUEnDkUEgQ09MQURBIFNJTiBMSUNPUiIsCiAgICAicHJlY2lvVW5pIiA6IDMuMzE4NiwKICAgICJtb250b0Rlc2N1IiA6IDAsCiAgICAidmVudGFOb1N1aiIgOiAwLAogICAgInZlbnRhRXhlbnRhIiA6IDAsCiAgICAidmVudGFHcmF2YWRhIiA6IDYuNjQsCiAgICAidHJpYnV0b3MiIDogWyAiMjAiIF0sCiAgICAicHN2IiA6IDAsCiAgICAibm9HcmF2YWRvIiA6IDAKICB9LCB7CiAgICAibnVtSXRlbSIgOiA2LAogICAgInRpcG9JdGVtIiA6IDEsCiAgICAidW5pTWVkaWRhIiA6IDU5LAogICAgIm51bWVyb0RvY3VtZW50byIgOiBudWxsLAogICAgImNhbnRpZGFkIiA6IDEsCiAgICAiY29kaWdvIiA6ICJQUk9QSU5BIiwKICAgICJjb2RUcmlidXRvIiA6IG51bGwsCiAgICAiZGVzY3JpcGNpb24iIDogIlBST1BJTkEiLAogICAgInByZWNpb1VuaSIgOiAwLAogICAgIm1vbnRvRGVzY3UiIDogMCwKICAgICJ2ZW50YU5vU3VqIiA6IDAsCiAgICAidmVudGFFeGVudGEiIDogMCwKICAgICJ2ZW50YUdyYXZhZGEiIDogMCwKICAgICJ0cmlidXRvcyIgOiBudWxsLAogICAgInBzdiIgOiAwLAogICAgIm5vR3JhdmFkbyIgOiA0LjM0CiAgfSBdLAogICJyZXN1bWVuIiA6IHsKICAgICJ0b3RhbE5vU3VqIiA6IDAsCiAgICAidG90YWxFeGVudGEiIDogMCwKICAgICJ0b3RhbEdyYXZhZGEiIDogMzguNDEsCiAgICAic3ViVG90YWxWZW50YXMiIDogMzguNDEsCiAgICAiZGVzY3VOb1N1aiIgOiAwLAogICAgImRlc2N1RXhlbnRhIiA6IDAsCiAgICAiZGVzY3VHcmF2YWRhIiA6IDAsCiAgICAicG9yY2VudGFqZURlc2N1ZW50byIgOiAwLAogICAgInRvdGFsRGVzY3UiIDogMCwKICAgICJ0cmlidXRvcyIgOiBbIHsKICAgICAgImNvZGlnbyIgOiAiMjAiLAogICAgICAiZGVzY3JpcGNpb24iIDogIkltcHVlc3RvIGFsIFZhbG9yIEFncmVnYWRvIDEzJSIsCiAgICAgICJ2YWxvciIgOiA0Ljk5CiAgICB9IF0sCiAgICAic3ViVG90YWwiIDogMzguNDEsCiAgICAiaXZhUmV0ZTEiIDogMCwKICAgICJyZXRlUmVudGEiIDogMCwKICAgICJpdmFQZXJjaTEiIDogMCwKICAgICJtb250b1RvdGFsT3BlcmFjaW9uIiA6IDQzLjQsCiAgICAidG90YWxOb0dyYXZhZG8iIDogNC4zNCwKICAgICJ0b3RhbFBhZ2FyIiA6IDQ3Ljc0LAogICAgInRvdGFsTGV0cmFzIiA6ICJDVUFSRU5UQSBZIFNJRVRFIDc0LzEwMCBET0xBUkVTIEFNRVJJQ0FOT1MiLAogICAgInNhbGRvRmF2b3IiIDogMCwKICAgICJjb25kaWNpb25PcGVyYWNpb24iIDogMSwKICAgICJwYWdvcyIgOiBbIHsKICAgICAgImNvZGlnbyIgOiAiMDMiLAogICAgICAicGxhem8iIDogbnVsbCwKICAgICAgInBlcmlvZG8iIDogbnVsbCwKICAgICAgIm1vbnRvUGFnbyIgOiA0Ny43NCwKICAgICAgInJlZmVyZW5jaWEiIDogIiIKICAgIH0gXSwKICAgICJudW1QYWdvRWxlY3Ryb25pY28iIDogbnVsbAogIH0sCiAgImV4dGVuc2lvbiIgOiBudWxsLAogICJhcGVuZGljZSIgOiBudWxsCn0.WRrHuPzUl5SAzCSMP0JAAZiYf16MUfGEWx3-qT9eBkCV5wZLBg1YMT2iSTULhOMxjhZ2Gu95HaC47im-VREGwNUPjX_M2P7t2cKHpW8kVDBrt_jezyLzZ8k9hjyGLfBMalh0HEubI4WPHY-CeQruqapkV0aXRCDC9xXk_Axf0_VdjIF4S02suqeC3b3vvHFMZO-Bqee35MONceby1fOcz41yZfCtUELMvbdc9dFiX0FdxiazFRuwA8aJNZ2smOSALPOnp78d8jJutGkMobGqRt0zvQWZMj-_Wvf6I6xNvQfLWohnb89JlOPNHCoSaEb__lN9A77K2DqMsV0RLLlw7A"

// } as any;

//         const arrayBuffer = await generateSvfe03(
            
//     svfe03,"","",false,false

//         ) ;

//         // Guardar el PDF en disco
//         const outputPath = path.join(__dirname, "preview.pdf");
//         fs.writeFileSync(outputPath, Buffer.from(arrayBuffer));

//         console.log("✅ PDF generado:", outputPath);
//     } catch (error) {
//         console.error(error);
//     }
// })();



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
