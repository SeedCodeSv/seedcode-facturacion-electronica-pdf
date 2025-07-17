import { SeedcodeCatalogosMhService } from "seedcode-catalogos-mh"

export const formatNameTypeDocument = (type: string) => {
    switch (type) {
        case "13":
            return "DUI"
        case "36":
            return "NIT"
        case "37":
            return "OTROS"
        default:
            return "OTROS"
    }
}

export const formatDocumentType = (type: string) => {
    switch (type) {
        case "01":
            return "COMPROBANTE DE FACTURA CONSUMIDOR FINAL"
        case "03":
            return "COMPROBANTE DE CRÉDITO FISCAL"
        case "04":
            return "COMPROBANTE DE NOTA DE REMISIÓN"
        default:
            return "OTROS"
    }
}

export const formatEconomicActivity = (code: string) => {
    const services = new SeedcodeCatalogosMhService()

    return services.get019CodigoDeActividaEcono("", 1, 100000).find((item) => item.codigo === code)?.valores
}