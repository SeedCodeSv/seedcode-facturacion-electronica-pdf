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

El PDF toma las observaciones de `resumen`, usa los importes renombrados y muestra los códigos de distrito y municipio con el catálogo actual.

## DTE 05: normativa 2.0, esquema versión 4

`DteNce` y `generateSvfe05` utilizan el esquema adjunto de Nota de Crédito Electrónica:

- `identificacion.version` debe ser `4`, `tipoDte` debe ser `"05"` y `fusion` es obligatorio (`string` o `null`).
- Las direcciones requieren `distrito`; el emisor tiene su propia estructura y su `nrc` admite `null`.
- El receptor usa `tipoDocumento` y `numDocumento`, con una estructura independiente del emisor.
- `ventaTercero` incluye `codDomiciliado` y su `nit` admite `null`.
- Cada ítem requiere `numeroDocumento`, `tributos`, `ivaPerci`, `totalIva` e `ivaRete`; se eliminan `tos` y `psv`.
- El resumen usa `ivaPerci`, `totalIva` e `ivaRete`, e incluye `observaciones` y `codigoRetencionMH` (ambos admiten `null`).
- Se eliminan `extension` y los campos de resumen `descuNoSuj`, `descuExenta`, `descuGravada`, `porcentajeDescuento`, `subTotal`, `ivaPerci1`, `ivaRete1`, `reteRenta`, `saldoFavor`, `pagos` y `numPagoElectronico`.
- `respuestaMH` y `firma` son metadatos opcionales de la biblioteca, ajenos al esquema de Hacienda.

El PDF usa los nuevos importes del resumen, toma las observaciones de `resumen` y muestra los montos no gravados en su propia columna.

## DTE 11: normativa 2.0, esquema versión 3

`DteExp` y `generateSvfe11` utilizan el esquema adjunto de Factura de Exportación Electrónica:

- `identificacion.version` debe ser `3`, `tipoDte` debe ser `"11"` y `motivoContin` reemplaza a `motivoContigencia`.
- La dirección del emisor requiere `distrito`; se agrega `tipoRegimen` y se eliminan `tipoEstablecimiento`, `codEstableMH` y `codPuntoVentaMH`.
- `documentoRelacionado`, `otrosDocumentos` y `apendice` son campos obligatorios de tipo arreglo o `null`. Los documentos asociados incluyen los datos de transporte y conductor.
- `ventaTercero` incluye `codDomiciliado` y se agrega `compraTercero`. Ambos campos son obligatorios, pero solo uno puede contener un objeto; también pueden ser ambos `null`.
- Cada ítem requiere `tipoItem`, `numeroDocumento` y `codTributo`.
- `resumen.descuGravada` reemplaza a `descuento`; se agregan `tributos`, `totalNoOnerosas` y `saldoFavor`.
- Se respetan los campos que admiten `null`, incluidos `flete`, `totalLetras` y `pagos`; `pagos[].periodo` es numérico o `null`.
- `respuestaMH` y `firma` son metadatos opcionales de la biblioteca, ajenos al esquema de Hacienda.

La exclusión entre `ventaTercero` y `compraTercero` se comprueba con `strictNullChecks` habilitado. Los tipos no validan en ejecución los formatos, longitudes, límites numéricos ni cantidades de elementos del esquema JSON.

## DTE 14: normativa 2.0, esquema versión 2

`DteFse` y `generateSvfe14` utilizan el esquema adjunto de Factura de Sujeto Excluido Electrónica:

- `identificacion.version` debe ser `2` y `tipoDte` debe ser `"14"`.
- `receptor` reemplaza a `sujetoExcluido`. El tipo se exporta como `Receptor14`, con `SujetoExcluido14` como alias.
- Las direcciones del emisor y receptor requieren `distrito`; `emisor.nrc` admite `null` y se elimina `codPuntoVentaMH`.
- Se elimina `cuerpoDocumento[].ventaNoSuj` y los campos de resumen `totalNoSuj`, `totalSuj`, `totalExenta` e `ivaRete1`.
- `resumen.totalLetras` y `resumen.pagos` admiten `null`; `pagos[].codigo` admite `null`, `referencia` es obligatorio y `periodo` es numérico o `null`.
- `respuestaMH` y `firma` son metadatos opcionales de la biblioteca, ajenos al esquema de Hacienda.

El PDF usa `receptor`, incluye el distrito en la dirección y muestra los descuentos y la retención de renta del nuevo resumen. Los tipos no validan en ejecución los formatos, longitudes, límites numéricos ni cantidades de elementos del esquema JSON.

## Parametros


```typescript
import { generateSvfe01, DteFe } from "seedcode-facturacion-electronica-pdf"


const pdfArrayBuffer = async(data: DteFe, isContingence: boolean) => {
    const arrayBuffer = await generateSvfe01(data, isContingence);

    return arrayBuffer;
}

```
