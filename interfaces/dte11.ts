import { Apendice, Direccion, OtrosDocumentos, RespuestaMh, VentaTercero } from "./common";

export interface DteExp {
  identificacion: Identificacion11;
  emisor: Emisor11;
  receptor: Receptor;
  otrosDocumentos: OtrosDocumentos | null;
  ventaTercero: VentaTercero | null;
  cuerpoDocumento: CuerpoDocumento[];
  resumen: Resumen;
  apendice: Apendice | any;
  respuestaMH: RespuestaMh;
  firma: string;
}

export interface Identificacion11 {
  version: number;
  codigoGeneracion: string;
  ambiente: string;
  tipoDte: string;
  numeroControl: string;
  tipoModelo: number;
  tipoOperacion: number;
  tipoContingencia: string | any;
  motivoContigencia: string | any;
  tipoMoneda: string;
  fecEmi: string;
  horEmi: string;
}

export interface Emisor11 {
  nit: string;
  nrc: string;
  nombre: string;
  nombreComercial: string;
  codActividad: string;
  descActividad: string;
  tipoEstablecimiento: string;
  direccion: Direccion;
  telefono: string;
  correo: string;
  codEstable: string;
  codEstableMH: string;
  codPuntoVenta: string;
  codPuntoVentaMH: string;
  tipoItemExpor: number;
  recintoFiscal: string;
  regimen: string;
}

export interface Receptor {
  tipoDocumento: string;
  numDocumento: string;
  nombre: string;
  descActividad: string;
  telefono: string;
  correo: string;
  complemento: string;
  nombreComercial: string | any;
  tipoPersona: number;
  codPais: string;
  nombrePais: string;
}

export interface CuerpoDocumento {
  numItem: number;
  codigo: string;
  descripcion: string;
  cantidad: number;
  uniMedida: number;
  precioUni: number;
  montoDescu: number;
  ventaGravada: number;
  tributos: string[] | any;
  noGravado: number;
}

export interface Resumen {
  totalGravada: number;
  descuento: number;
  porcentajeDescuento: number;
  totalDescu: number;
  montoTotalOperacion: number;
  totalNoGravado: number;
  totalPagar: number;
  totalLetras: string;
  condicionOperacion: number;
  pagos: Pago11[];
  numPagoElectronico: string | any;
  codIncoterms: string;
  descIncoterms: string;
  flete: number;
  seguro: number;
  observaciones: string;
}

export interface Pago11 {
  codigo: string;
  montoPago: number;
  plazo: string | any;
  periodo: string | any;
  referencia: string;
}