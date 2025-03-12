import {
    Apendice,
  Direccion,
  DocumentoRelacionado,
  Emisor,
  Extension,
  Identificacion,
  Tributo,
  VentaTercero,
} from "./common";

export interface Receptor04 {
  tipoDocumento: string;
  numDocumento: string;
  nrc: string | null;
  nombre: string;
  codActividad: string | null;
  descActividad: string | null;
  nombreComercial: string | null;
  direccion: Direccion;
  telefono: string | null;
  correo: string;
  bienTitulo: string;
}

export interface CuerpoDocumento04 {
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
}

export interface Resumen04 {
  totalNoSuj: number;
  totalExenta: number;
  totalGravada: number;
  subTotalVentas: number;
  descuNoSuj: number;
  descuExenta: number;
  descuGravada: number;
  porcentajeDescuento: number | null;
  totalDescu: number;
  tributos: Tributo[] | null;
  subTotal: number;
  montoTotalOperacion: number;
  totalLetras: string;
}

export interface DteNre {
  identificacion: Identificacion;
  documentoRelacionado: DocumentoRelacionado[] | null;
  emisor: Emisor;
  receptor: Receptor04;
  ventaTercero: VentaTercero | null;
  cuerpoDocumento: CuerpoDocumento04[];
  resumen: Resumen04;
  extension: Extension | null
  apendice: Apendice[] | null
}
