import { Apendice, RespuestaMh, Tributo } from "./common";

/** Nota de crédito DTE 05, versión 4 del esquema adjunto (normativa 2.0). */
export class Identificacion05 {
  version: 4;
  ambiente: "00" | "01";
  tipoDte: "05";
  numeroControl: string;
  codigoGeneracion: string;
  tipoModelo: 1 | 2;
  tipoOperacion: 1 | 2;
  tipoContingencia: null | 1 | 2 | 3 | 4 | 5;
  motivoContin: string | null;
  fecEmi: string;
  horEmi: string;
  tipoMoneda: "USD";
  fusion: string | null;
}

export class DocumentoRelacionado05 {
  tipoDocumento: string;
  tipoGeneracion: number;
  numeroDocumento: string;
  fechaEmision: string;
}

export class Direccion05 {
  departamento: string;
  municipio: string;
  distrito: string;
  complemento: string;
}

export class Emisor05 {
  nit: string;
  nrc: string | null;
  nombre: string;
  codActividad: string;
  descActividad: string;
  nombreComercial: string | null;
  direccion: Direccion05;
  telefono: string;
  correo: string;
}

export class Receptor05 {
  tipoDocumento: string;
  numDocumento: string;
  nrc: string | null;
  nombre: string;
  codActividad: string;
  descActividad: string;
  nombreComercial: string | null;
  direccion: Direccion05;
  telefono: string | null;
  correo: string | null;
}

export class VentaTercero05 {
  nit: string | null;
  nombre: string;
  codDomiciliado: number | null;
}

export class CuerpoDocumento05 {
  numItem: number;
  tipoItem: number;
  numeroDocumento: string;
  codigo: string | null;
  codTributo: string | null;
  descripcion: string;
  cantidad: number;
  uniMedida: number;
  precioUni: number;
  montoDescu: number;
  ventaNoSuj: number;
  ventaExenta: number;
  ventaGravada: number;
  tributos: string[] | null;
  noGravado: number;
  ivaPerci: number;
  totalIva: number;
  ivaRete: number;
}

export class Resumen05 {
  totalNoSuj: number;
  totalExenta: number;
  totalGravada: number;
  subTotalVentas: number;
  totalDescu: number;
  tributos: Tributo[] | null;
  montoTotalOperacion: number;
  ivaPerci: number;
  totalIva: number;
  ivaRete: number;
  totalNoGravado: number;
  totalPagar: number;
  totalLetras: string | null;
  condicionOperacion: number;
  observaciones: string | null;
  codigoRetencionMH: string | null;
}

export interface DteNce {
  identificacion: Identificacion05;
  documentoRelacionado: DocumentoRelacionado05[];
  emisor: Emisor05;
  ventaTercero: VentaTercero05 | null;
  receptor: Receptor05;
  cuerpoDocumento: CuerpoDocumento05[];
  resumen: Resumen05;
  apendice: Apendice[] | null;
  /** Metadatos de procesamiento; no forman parte del esquema del DTE. */
  respuestaMH?: RespuestaMh;
  firma?: string;
}
