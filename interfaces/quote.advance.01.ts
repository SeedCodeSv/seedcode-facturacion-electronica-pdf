export interface QuoteAdvance {
  name: string;
  no: number;
  fecEmi: string;
  horEmi: string;
  totalPagar: number;
  condition: string;
  period: number;
  deadline: string;
  date: string;
  status: string;
  observaciones: string;
  customer: Customer;
  totalNoSuj: number;
  totalExenta: number;
  totalGravada: number;
  descuNoSuj: number;
  descuExenta: number;
  descuGravada: number;
  subTotal: number;
  ivaRete1: number;
  ivaPerci1: number;
  reteRenta: number;
  totalIva: number;
  montoTotalOperacion: number;
  totalNoGravado: number;
  quotationDetails: QuotationDetail[];
  transmitter: {
    phone: string;
    name: string;
    address: string;
    nit: string;
    nrc: string;
  };
}

export interface Customer {
  nombre: string;
  nombreComercial: string;
  nrc: string;
  nit: string;
  tipoDocumento: string;
  numDocumento: string;
  codActividad: string;
  descActividad: string;
  bienTitulo: string;
  telefono: string;
  correo: string;
  esContribuyente: boolean;
  isWithholdingAgent: boolean;
  latitude: string;
  longitude: string;
  tipoContribuyente: string;
  direccion: Direccion;
}

export interface Direccion {
  departamento: string;
  nombreDepartamento: string;
  municipio: string;
  nombreMunicipio: string;
  complemento: string;
}

export interface QuotationDetail {
  total: number;
  cantidadItem: number;
  precioUni: number;
  costoUni: number;
  description: string;
  montoDescu: number;
  ventaNoSuj: number;
  ventaExenta: number;
  ventaGravada: number;
  noGravado: number;
}
