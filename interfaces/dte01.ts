import { Apendice, RespuestaMh, Tributo } from "./common";

/** Factura electrónica DTE 01, versión 2 del esquema adjunto. */
export interface Identificacion01 {
  version: 2;
  ambiente: "00" | "01";
  tipoDte: "01";
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

export interface DocumentoRelacionado01 {
  tipoDocumento: string;
  tipoGeneracion: number;
  numeroDocumento: string;
  fechaEmision: string;
}

export interface Direccion01 {
  departamento: string;
  municipio: string;
  distrito: string;
  complemento: string;
}

export interface Emisor01 {
  nit: string;
  nrc: string;
  nombre: string;
  codActividad: string;
  descActividad: string;
  nombreComercial: string | null;
  direccion: Direccion01;
  telefono: string;
  correo: string;
  codEstable: string | null;
  codPuntoVenta: string | null;
}

export interface Receptor01 {
  tipoDocumento: null | string;
  numDocumento: string | null;
  nrc: string | null;
  nombre: string | null;
  codActividad: string | null;
  descActividad: string | null;
  direccion: Direccion01 | null;
  telefono: string | null;
  correo: string | null;
}

export interface Medico01 {
  nombre: string | null;
  nit: string | null;
  docIdentificacion: string | null;
  tipoServicio: number | null;
}

export interface OtrosDocumentos01 {
  codDocAsociado: number | null;
  descDocumento: string | null;
  detalleDocumento: string | null;
  medico: Medico01 | null;
}

export interface VentaTercero01 {
  nit: string | null;
  nombre: string;
  codDomiciliado: number | null;
}

export interface CuerpoDocumento01 {
  numItem: number;
  tipoItem: number;
  numeroDocumento: string | null;
  cantidad: number;
  codigo: string | null;
  codTributo: string | null;
  uniMedida: number;
  descripcion: string;
  precioUni: number;
  montoDescu: number;
  ventaNoSuj: number;
  ventaExenta: number;
  ventaGravada: number;
  tributos: string[] | null;
  psv: number;
  noGravado: number;
  ivaItem: number;
}

export interface Pago01 {
  codigo: string | null;
  montoPago: number;
  referencia: string | null;
  plazo: string | null;
  periodo: number | null;
}

export interface Resumen01 {
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
  ivaRete: number;
  montoTotalOperacion: number;
  totalNoGravado: number;
  totalPagar: number;
  totalLetras: string | null;
  totalIva: number;
  saldoFavor: number;
  condicionOperacion: number;
  pagos: Pago01[] | null;
  numPagoElectronico: string | null;
  observaciones: string | null;
}

export interface DteFe {
  identificacion: Identificacion01;
  documentoRelacionado: DocumentoRelacionado01[] | null;
  emisor: Emisor01;
  receptor: Receptor01 | null;
  otrosDocumentos: OtrosDocumentos01[] | null;
  ventaTercero: VentaTercero01 | null;
  cuerpoDocumento: CuerpoDocumento01[];
  resumen: Resumen01;
  apendice: Apendice[] | null;
  /** Metadatos de procesamiento; no forman parte del esquema del DTE. */
  respuestaMH?: RespuestaMh;
  firmaElectronica?: string;
}
