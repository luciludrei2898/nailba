# Nailba Studio

Aplicacion web sencilla para el cobro interno de una tienda de unas.

## Incluye

- Pantalla de cobro con ticket en tiempo real
- Gestion de servicios desde la propia interfaz
- Registro de ventas con persistencia en `localStorage`
- Vista de ventas del dia y resumen mensual
- Exportacion a Excel (`.xlsx`) con hojas separadas por mes

## Requisitos

- Node.js 18 o superior

## Instalacion

```bash
npm install
```

## Arranque en local

```bash
npm run dev
```

La aplicacion quedara disponible normalmente en `http://localhost:5173`.

## Compilar para produccion

```bash
npm run build
```

## Como modificar servicios

- Entra en la pestana `Servicios`
- Usa el formulario superior para crear uno nuevo
- Edita directamente nombre, precio y categoria en la tabla inferior
- Los cambios se guardan automaticamente en el navegador

## Persistencia

Los datos se guardan en el navegador con `localStorage`, asi que permanecen entre sesiones en ese mismo equipo.

## Exportacion Excel

- `Exportar hoy`: genera un archivo con las ventas del dia
- `Exportar historico`: genera un archivo con una hoja por cada mes detectado en el historial
- Cada hoja incluye fecha, hora, servicios, total y un resumen mensual final
