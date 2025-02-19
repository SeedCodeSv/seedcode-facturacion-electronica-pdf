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

## Parametros


```typescript
import { generateSvfe01, DteFe } from "seedcode-facturacion-electronica-pdf"


const pdfArrayBuffer = async(data: DteFe, isContingence: boolean) => {
    const arrayBuffer = await generateSvfe01(data, isContingence);

    return arrayBuffer;
}

```