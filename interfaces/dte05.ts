import {
  Apendice,
  DocumentoRelacionado,
  Emisor,
  Extension,
  Identificacion,
  RespuestaMh,
  VentaTercero,
  Pago,
  Tributo,
} from "./common";
export class Receptor05 extends Emisor {}

export class CuerpoDocumento05 {
  numItem: number;
  tipoItem: 1 | 2 | 3 | 4;
  numeroDocumento?: string | null;
  codigo?: string | null;
  codTributo?: string | null;
  descripcion: string;
  cantidad: number;
  uniMedida: number;
  precioUni: number;
  montoDescu: number;
  ventaNoSuj: number;
  ventaExenta: number;
  ventaGravada: number;
  tos?: string[] | null;
  psv: number;
  noGravado: number;
}

export class Resumen05 {
  totalNoSuj: number;
  totalExenta: number;
  totalGravada: number;
  subTotalVentas: number;
  descuNoSuj: number;
  descuExenta: number;
  descuGravada: number;
  porcentajeDescuento: number;
  totalDescu: number;
  tributos?: Tributo[] | null;
  subTotal: number;
  ivaPerci1: number;
  ivaRete1: number;
  reteRenta: number;
  montoTotalOperacion: number;
  totalNoGravado: number;
  totalPagar: number;
  totalLetras: string;
  saldoFavor: number;
  condicionOperacion: 1 | 2 | 3;
  pagos?: Pago[] | null;
  numPagoElectronico?: string | null;
}

export interface DteNce {
  identificacion: Identificacion;
  documentoRelacionado: DocumentoRelacionado[];
  emisor: Emisor;
  ventaTercero: VentaTercero | null;
  receptor: Receptor05;
  cuerpoDocumento: CuerpoDocumento05[];
  resumen: Resumen05;
  extension: Extension | null;
  apendice: Apendice[] | null;
  respuestaMH: RespuestaMh;
  firma: string;
}
