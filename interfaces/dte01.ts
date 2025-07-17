import {
  Apendice,
  Direccion,
  DocumentoRelacionado,
  Emisor,
  Extension,
  Identificacion,
  OtrosDocumentos,
  Pago,
  RespuestaMh,
  Tributo,
} from "./common";

export class Receptor01 {
  tipoDocumento: string;
  numDocumento: string | null;
  nrc: string | null;
  nombre: string;
  codActividad: string | null;
  descActividad: string | null;
  direccion: Direccion | null;
  telefono: string;
  correo: string;
}

export class CuerpoDocumento01 {
  numItem: number;
  tipoItem: number;
  uniMedida: number;
  numeroDocumento: string | null;
  cantidad: number;
  codigo: string;
  codTributo: string | null;
  descripcion: string;
  precioUni: number;
  montoDescu: number;
  ventaNoSuj: number;
  ventaExenta: number;
  ventaGravada: number;
  ivaItem: number;
  tributos: string[] | null;
  psv: number;
  noGravado: number;
}

export class Resumen01 {
  totalNoSuj: number;
  totalExenta: number;
  totalGravada: number;
  subTotalVentas: number;
  descuNoSuj: number;
  descuExenta: number;
  descuGravada: number;
  porcentajeDescuento: number;
  totalDescu: number;
  tributos: Tributo[] | null;
  subTotal: number;
  ivaRete1: number;
  ivaPerci1: number;
  reteRenta: number;
  totalIva: number;
  montoTotalOperacion: number;
  totalNoGravado: number;
  totalPagar: number;
  totalLetras: string;
  saldoFavor: number;
  condicionOperacion: number;
  pagos: Pago[];
  numPagoElectronico: string | null;
}

export class DteFe {
  identificacion: Identificacion;
  documentoRelacionado: DocumentoRelacionado[] | null;
  emisor: Emisor;
  receptor: Receptor01;
  otrosDocumentos: OtrosDocumentos | null;
  ventaTercero: any;
  cuerpoDocumento: CuerpoDocumento01[];
  resumen: Resumen01;
  extension: Extension | null;
  apendice: Apendice | null;
  respuestaMH: RespuestaMh;
  firma: string;
}
