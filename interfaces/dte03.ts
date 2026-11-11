import { Apendice, RespuestaMh, Tributo } from "./common";

/** Comprobante de crédito fiscal DTE 03, versión 4 del esquema adjunto. */
export class Identificacion03 {
  version: 4;
  ambiente: "00" | "01";
  tipoDte: "03";
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

export class DocumentoRelacionado03 {
  tipoDocumento: string;
  tipoGeneracion: number;
  numeroDocumento: string;
  fechaEmision: string;
}

export class Direccion03 {
  departamento: string;
  municipio: string;
  distrito: string;
  complemento: string;
}

export class Emisor03 {
  nit: string;
  nrc: string;
  nombre: string;
  codActividad: string;
  descActividad: string;
  nombreComercial: string | null;
  direccion: Direccion03;
  telefono: string;
  correo: string;
  codEstable: string | null;
  codPuntoVenta: string | null;
}

export class Receptor03 {
  nit: string;
  nrc: string | null;
  nombre: string;
  codActividad: string;
  descActividad: string;
  nombreComercial: string | null;
  direccion: Direccion03;
  telefono: string | null;
  correo: string | null;
}

export class Medico03 {
  nombre: string | null;
  nit: string | null;
  docIdentificacion: string | null;
  tipoServicio: number;
}

export class OtrosDocumentos03 {
  codDocAsociado: number | null;
  descDocumento: string | null;
  detalleDocumento: string | null;
  medico: Medico03 | null;
}

export class VentaTercero03 {
  nit: string | null;
  nombre: string;
  codDomiciliado: number | null;
}

export class CuerpoDocumento03 {
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
  ventaNoSuj: number;
  ventaExenta: number;
  ventaGravada: number;
  tributos: string[] | null;
  psv: number;
  noGravado: number;
}

export class Pago03 {
  codigo: string | null;
  montoPago: number;
  referencia: string | null;
  plazo: string | null;
  periodo: number | null;
}

export class Resumen03 {
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
  ivaPerci: number;
  ivaRete: number;
  montoTotalOperacion: number;
  totalNoGravado: number;
  totalPagar: number;
  totalLetras: string | null;
  saldoFavor: number;
  condicionOperacion: number;
  pagos: Pago03[] | null;
  numPagoElectronico: string | null;
  observaciones: string | null;
}

export class DteCcf {
  identificacion: Identificacion03;
  documentoRelacionado: DocumentoRelacionado03[] | null;
  emisor: Emisor03;
  receptor: Receptor03;
  otrosDocumentos: OtrosDocumentos03[] | null;
  ventaTercero: VentaTercero03 | null;
  cuerpoDocumento: CuerpoDocumento03[];
  resumen: Resumen03;
  apendice: Apendice[] | null;
  /** Metadatos de procesamiento; no forman parte del esquema del DTE. */
  respuestaMH?: RespuestaMh;
  firmaElectronica?: string;
}
