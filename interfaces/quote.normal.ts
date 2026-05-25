export interface QuoteNormal {
  name: string
  no: number,
  fecEmi: string
  horEmi: string
  totalPagar: string
  condition: string
  period: number
  deadline: string
  date: string
  status: string
  observaciones: string
  customer: Customer
  quotationDetails: QuotationDetail[]
  transmitter: {
    phone: string,
    name: string,
    address: string
  }
}

export interface Customer {
  nombre: string
  nombreComercial: string
  nrc: string
  nit: string
  tipoDocumento: string
  numDocumento: string
  codActividad: string
  descActividad: string
  bienTitulo: string
  telefono: string
  correo: string
  esContribuyente: boolean
  isWithholdingAgent: boolean
  latitude: string
  longitude: string
  tipoContribuyente: string
  direccion: Direccion
}

export interface Direccion {
  departamento: string
  nombreDepartamento: string
  municipio: string
  nombreMunicipio: string
  complemento: string
}

export interface QuotationDetail {
  total: string
  cantidadItem: string
  precioUni: string
  costoUni: string
  description: string
}
