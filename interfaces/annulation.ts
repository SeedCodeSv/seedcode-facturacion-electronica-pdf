import { RespuestaMh } from "./common";

export interface AnnulationIdentificacion {
  version: number;
  ambiente: string;
  codigoGeneracion: string;
  fecEmi: string;
  horEmi: string;
  fusion: string | null;
}

export interface AnnulationEmisor {
  nit: string;
  nombre: string;
  codEstableMH: string;
  codEstable: string;
  codPuntoVentaMH: string;
  codPuntoVenta: string;
  telefono: string;
  correo: string;
}

export interface AnnulationDocumento {
  tipoDte: string;
  codigoGeneracion: string;
  selloRecibido: string;
  numeroControl: string;
  fecEmi: string;
  codigoGeneracionR: string | null;
  tipoDocumento: string | null;
  numDocumento: string | null;
  nombre: string | null;
  telefono: string | null;
  correo: string | null;
}

export interface AnnulationMotivo {
  tipoAnulacion: string;
  motivoAnulacion: string | null;
  nombreResponsable: string;
  tipDocResponsable: string;
  numDocResponsable: string;
  nombreSolicita: string;
  tipDocSolicita: string;
  numDocSolicita: string;
}

export interface AnnulationSvfe {
  identificacion: AnnulationIdentificacion;
  emisor: AnnulationEmisor;
  documento: AnnulationDocumento;
  motivo: AnnulationMotivo;
  selloRecibido: string,
}
