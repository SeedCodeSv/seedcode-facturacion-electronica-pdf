export class Identificacion {
  version: number;
  codigoGeneracion: string;
  ambiente: string;
  tipoDte: string;
  numeroControl: string;
  tipoModelo: number;
  tipoOperacion: number;
  tipoContingencia: null | number;
  motivoContin: null | string;
  tipoMoneda: "USD";
  fecEmi: string;
  horEmi: string;
}

export class Direccion {
  departamento: string;
  municipio: string;
  complemento: string;
}

export class Emisor {
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
}

export class Medico {
  nombre: string;
  nit?: string | null;
  docIdentificacion?: string | null;
  tipoServicio: number;
}

export class OtrosDocumentos {
  codDocAsociado: number;
  descDocumento?: string | null;
  detalleDocumento?: string | null;
  medico?: Medico | null;
}

export class DocumentoRelacionado {
  tipoDocumento: "04" | "09";
  tipoGeneracion: 1 | 2;
  numeroDocumento: string;
  fechaEmision: string;
}

export class VentaTercero {
  nit: string;
  nombre: string;
}

export class Extension {
  nombEntrega: string | null;
  docuEntrega: string | null;
  nombRecibe: string | null;
  docuRecibe: string | null;
  observaciones: string | null;
  placaVehiculo: string | null;
}

export class Apendice {
  campo: string;
  etiqueta: string;
  valor: string;
}

export class RespuestaMh {
  version: number;
  ambiente: string;
  versionApp: number;
  estado: string;
  codigoGeneracion: string;
  selloRecibido: string;
  fhProcesamiento: string;
  clasificaMsg: string;
  codigoMsg: string;
  descripcionMsg: string;
  observaciones: string[];
}

export class Pago {
  codigo: string;
  montoPago: number;
  referencia?: string | null;
  plazo: string | null;
  periodo: string | null;
}

export class Tributo {
  codigo: string;
  descripcion: string;
  valor: number;
}
