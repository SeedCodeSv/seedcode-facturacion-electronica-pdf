import {
  Apendice,
  Direccion,
  Identificacion,
  Pago,
  RespuestaMh,
} from "./common";

export class Emisor14 {
  nit: string;
  nrc: string;
  nombre: string;
  codActividad: string;
  descActividad: string;
  direccion: Direccion;
  telefono: string;
  codEstable: string | null;
  codPuntoVenta: string | null;
  codPuntoVentaMH: string | null;
  correo: string;
}

export class SujetoExcluido14 {
  tipoDocumento: string;
  numDocumento: string;
  nombre: string;
  codActividad: string | null;
  descActividad: string | null;
  direccion: Direccion;
  telefono: string | null;
  correo: string | null;
}

export class CuerpoDocumento14 {
  numItem: number;
  tipoItem: number;
  cantidad: number;
  codigo: string | null;
  uniMedida: number;
  descripcion: string;
  precioUni: number;
  montoDescu: number;
  ventaNoSuj: number;
  compra: number;
}

export class Resumen14 {
  totalCompra: number;
  totalNoSuj: number;
  descu: number;
  totalSuj: number;
  totalExenta: number;
  totalDescu: number;
  subTotal: number;
  ivaRete1: number;
  reteRenta: number;
  totalPagar: number;
  totalLetras: string;
  condicionOperacion: number;
  pagos: Pago[];
  observaciones: string | null;
}

export class DteFse {
  identificacion: Identificacion;
  emisor: Emisor14;
  sujetoExcluido: SujetoExcluido14;
  cuerpoDocumento: CuerpoDocumento14[];
  resumen: Resumen14;
  apendice: Apendice[] | null;
  respuestaMH: RespuestaMh | null;
  firma: string;
}
