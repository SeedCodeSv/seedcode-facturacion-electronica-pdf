import {
  Apendice,
  DocumentoRelacionado,
  Emisor,
  Extension,
  Identificacion,
  RespuestaMh,
  VentaTercero,
} from "./common";
import { Receptor03, Resumen03 } from "./dte03";
import { CuerpoDocumento03 } from "./dte03";

export class Receptor05 extends Receptor03 {}
export class CuerpoDocumento05 extends CuerpoDocumento03 {}
export class Resumen05 extends Resumen03 {}

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
