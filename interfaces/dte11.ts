import { Apendice, RespuestaMh, Tributo } from "./common";

/** Factura de exportación DTE 11, esquema versión 3 (normativa 2.0). */
export interface DteExpBase {
  identificacion: Identificacion11;
  documentoRelacionado: DocumentoRelacionado11[] | null;
  emisor: Emisor11;
  receptor: Receptor;
  otrosDocumentos: OtrosDocumentos11[] | null;
  cuerpoDocumento: CuerpoDocumento[];
  resumen: Resumen;
  apendice: Apendice[] | null;
  /** Metadatos de procesamiento; no forman parte del esquema del DTE. */
  respuestaMH?: RespuestaMh;
  firma?: string;
}

/** Venta y compra por cuenta de terceros son mutuamente excluyentes. */
export type DteExp = DteExpBase & (
  | { ventaTercero: VentaTercero11; compraTercero: null }
  | { ventaTercero: null; compraTercero: CompraTercero11 }
  | { ventaTercero: null; compraTercero: null }
);

export interface Identificacion11 {
  version: 3;
  codigoGeneracion: string;
  ambiente: "00" | "01";
  tipoDte: "11";
  numeroControl: string;
  tipoModelo: 1 | 2;
  tipoOperacion: 1 | 2;
  tipoContingencia: null | 1 | 2 | 3 | 4 | 5;
  motivoContin: string | null;
  tipoMoneda: "USD";
  fecEmi: string;
  horEmi: string;
}

export interface DocumentoRelacionado11 {
  tipoDocumento: string;
  tipoGeneracion: number;
  numeroDocumento: string;
  fechaEmision: string;
}

export interface Direccion11 {
  departamento: string;
  municipio: string;
  distrito: string;
  complemento: string;
}

export interface Emisor11 {
  nit: string;
  nrc: string;
  nombre: string;
  nombreComercial: string | null;
  codActividad: string;
  descActividad: string;
  direccion: Direccion11;
  telefono: string | null;
  correo: string;
  codEstable: string | null;
  codPuntoVenta: string | null;
  tipoItemExpor: number;
  recintoFiscal: string | null;
  tipoRegimen: string | null;
  regimen: string | null;
}

export interface Receptor {
  tipoDocumento: string;
  numDocumento: string;
  nombre: string;
  descActividad: string;
  telefono: string | null;
  correo: string | null;
  complemento: string;
  nombreComercial: string | null;
  tipoPersona: number;
  codPais: string;
  nombrePais: string;
}

export interface OtrosDocumentos11 {
  codDocAsociado: number | null;
  descDocumento: string | null;
  detalleDocumento: string | null;
  placaTrans: string | null;
  modoTransp: number | null;
  numConductor: string | null;
  nombreConductor: string | null;
}

export interface VentaTercero11 {
  nit: string | null;
  nombre: string;
  codDomiciliado: number | null;
}

export interface CompraTercero11 {
  numDocumento: string;
  nombre: string;
}

export interface CuerpoDocumento {
  numItem: number;
  tipoItem: number;
  numeroDocumento: string | null;
  codigo: string | null;
  codTributo: string | null;
  descripcion: string;
  cantidad: number;
  uniMedida: number;
  precioUni: number;
  montoDescu: number;
  ventaGravada: number;
  tributos: string[] | null;
  noGravado: number;
}

export interface Resumen {
  totalGravada: number;
  descuGravada: number;
  porcentajeDescuento: number;
  totalDescu: number;
  montoTotalOperacion: number;
  totalNoGravado: number;
  totalNoOnerosas: number;
  totalPagar: number;
  totalLetras: string | null;
  saldoFavor: number;
  condicionOperacion: number;
  pagos: Pago11[] | null;
  numPagoElectronico: string | null;
  codIncoterms: string | null;
  descIncoterms: string | null;
  flete: number | null;
  seguro: number;
  tributos: Tributo[] | null;
  observaciones: string | null;
}

export interface Pago11 {
  codigo: string | null;
  montoPago: number;
  plazo: string | null;
  periodo: number | null;
  referencia: string | null;
}
