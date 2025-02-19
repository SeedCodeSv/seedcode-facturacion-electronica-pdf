import {
    Apendice,
  DocumentoRelacionado,
  Emisor,
  Extension,
  Identificacion,
  OtrosDocumentos,
  Pago,
  RespuestaMh,
  Tributo,
  VentaTercero,
} from "./common";

export class Receptor03 extends Emisor {}

export class CuerpoDocumento03 {
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

export class DteCcf {
  identificacion: Identificacion;
  documentoRelacionado: DocumentoRelacionado[] | null;
  emisor: Emisor;
  receptor: Receptor03;
  otrosDocumentos: OtrosDocumentos[] | null;
  ventaTercero: VentaTercero | null;
  cuerpoDocumento: CuerpoDocumento03[];
  resumen: Resumen03;
  extension: Extension | null;
  apendice: Apendice[] | null;
  respuestaMH: RespuestaMh | null;
  firma: string;
}
