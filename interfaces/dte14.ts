import { Apendice, RespuestaMh } from "./common";

/** Factura de sujeto excluido DTE 14, esquema versión 2 (normativa 2.0). */
export interface Identificacion14 {
  version: 2;
  ambiente: "00" | "01";
  tipoDte: "14";
  numeroControl: string;
  codigoGeneracion: string;
  tipoModelo: 1 | 2;
  tipoOperacion: 1 | 2;
  tipoContingencia: null | 1 | 2 | 3 | 4 | 5;
  motivoContin: string | null;
  fecEmi: string;
  horEmi: string;
  tipoMoneda: "USD";
}

export interface Direccion14 {
  departamento: string;
  municipio: string;
  distrito: string;
  complemento: string;
}

export interface Emisor14 {
  nit: string;
  nrc: string | null;
  nombre: string;
  codActividad: string;
  descActividad: string;
  direccion: Direccion14;
  telefono: string;
  codEstable: string | null;
  codPuntoVenta: string | null;
  correo: string;
}

export interface Receptor14 {
  tipoDocumento: string;
  numDocumento: string;
  nombre: string;
  codActividad: string | null;
  descActividad: string | null;
  direccion: Direccion14;
  telefono: string | null;
  correo: string | null;
}

/** Alias del tipo de receptor para consumidores que usan el nombre anterior. */
export type SujetoExcluido14 = Receptor14;

export interface CuerpoDocumento14 {
  numItem: number;
  tipoItem: number;
  cantidad: number;
  codigo: string | null;
  uniMedida: number;
  descripcion: string;
  precioUni: number;
  montoDescu: number;
  compra: number;
}

export interface Pago14 {
  codigo: string | null;
  montoPago: number;
  referencia: string | null;
  plazo: string | null;
  periodo: number | null;
}

export interface Resumen14 {
  totalCompra: number;
  descu: number;
  totalDescu: number;
  subTotal: number;
  reteRenta: number;
  totalPagar: number;
  totalLetras: string | null;
  condicionOperacion: number;
  pagos: Pago14[] | null;
  observaciones: string | null;
}

export interface DteFse {
  identificacion: Identificacion14;
  emisor: Emisor14;
  receptor: Receptor14;
  cuerpoDocumento: CuerpoDocumento14[];
  resumen: Resumen14;
  apendice: Apendice[] | null;
  /** Metadatos de procesamiento; no forman parte del esquema del DTE. */
  respuestaMH?: RespuestaMh | null;
  firma?: string;
}
