# Seedcode-Facturacion-Electronica-PDF

**Seedcode-Facturación-Electrónica-PDF** es una biblioteca diseñada para la generación de documentos PDF para los diferentes tipos de DTE.

## Instalación

Para instalar la biblioteca, ejecuta el siguiente comando:

```bash
npm install seedcode-facturacion-electronica-pdf
```

## Uso

Para documentos DTE factura consumidor final

```typescript
import { generateSvfe01 } from "seedcode-facturacion-electronica-pdf"
```

Para documentos DTE comprobante de credito fiscal

```typescript
import { generateSvfe03 } from "seedcode-facturacion-electronica-pdf"
```

Para documentos DTE factura sujeto excluido

```typescript
import { generateSvfe14 } from "seedcode-facturacion-electronica-pdf"
```

## DTE 01: esquema versión 2

`DteFe` y `generateSvfe01` utilizan la versión 2 del esquema de Factura Electrónica:

- `identificacion.version` debe ser `2`.
- Las direcciones del emisor y receptor incluyen `distrito`.
- `resumen.ivaRete` reemplaza a `ivaRete1`; se eliminan `ivaPerci1` y `reteRenta`.
- `resumen.observaciones` reemplaza a `extension.observaciones`; se elimina `extension`.
- El emisor ya no incluye `tipoEstablecimiento`, `codEstableMH` ni `codPuntoVentaMH`.
- `otrosDocumentos` y `apendice` son arreglos o `null`; `receptor` también admite `null`.
- `ventaTercero` incluye `codDomiciliado`; `pagos[].periodo` es numérico o `null`.

`respuestaMH` y `firma` son metadatos opcionales de la biblioteca, ajenos al esquema de Hacienda. Los tipos se mantienen independientes de los demás DTE.

El catálogo instalado aún usa los municipios anteriores: para direcciones con distrito se muestran los códigos de municipio y distrito junto al nombre del departamento.

## DTE 03: esquema versión 4

`DteCcf` y `generateSvfe03` utilizan el nuevo esquema de crédito fiscal adjunto:

- `identificacion.version` debe ser `4` y `tipoDte` debe ser `"03"`.
- `resumen.ivaPerci` y `resumen.ivaRete` reemplazan a `ivaPerci1` e `ivaRete1`; se elimina `reteRenta`.
- `resumen.observaciones` reemplaza a `extension.observaciones`; se elimina `extension`.
- Las direcciones requieren `distrito`; el emisor ya no incluye `tipoEstablecimiento`, `codEstableMH` ni `codPuntoVentaMH`.
- El receptor tiene su propia estructura y ya no hereda los campos del emisor.
- `cuerpoDocumento[].tributos` reemplaza al campo incorrecto `tos`.
- `ventaTercero` incluye `codDomiciliado`; `pagos[].periodo` es numérico o `null`.
- `respuestaMH` y `firma` son metadatos opcionales, ajenos al esquema de Hacienda.

El PDF toma las observaciones de `resumen`, usa los importes renombrados y muestra los códigos de distrito y municipio con el catálogo actual. El DTE 05 conserva sus tipos anteriores mediante clases independientes del DTE 03.

## Parametros


```typescript
import { generateSvfe01, DteFe } from "seedcode-facturacion-electronica-pdf"


const pdfArrayBuffer = async(data: DteFe, isContingence: boolean) => {
    const arrayBuffer = await generateSvfe01(data, isContingence);

    return arrayBuffer;
}

```