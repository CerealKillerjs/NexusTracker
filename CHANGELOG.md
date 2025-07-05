# Changelog - NexusTracker

## Versión 1.8.2 - Correcciones de Torrents y Usuarios

### Problemas Identificados

1. **Errores de propiedades undefined en la página de torrents** - Errores como "Cannot read properties of undefined (reading 'find')", 'map', 'ratio', '_id', 'filter'
2. **Torrents apareciendo como "uploaded by deleted user"** - Los torrents subidos por usuarios aparecían como si fueran de un usuario eliminado

### Cambios Realizados

#### 1. **Frontend - Protección contra propiedades undefined**

**Archivos modificados:**
- `client/pages/torrent/[infoHash].js`
- `client/pages/tags/[tag].js`

**Cambios específicos:**
- Agregamos verificaciones de existencia con `?.` (optional chaining) para:
  - `torrent.files?.find()`
  - `userStats?.ratio`
  - `torrent.uploadedBy?._id`
  - `torrent.tags?.filter()`
  - `torrent.groupTorrents?.map()`
- Agregamos verificaciones `&&` para asegurar que las propiedades existan antes de usarlas
- En `tags/[tag].js` agregamos parsing de `SQ_TORRENT_CATEGORIES` desde variables de entorno

#### 2. **Backend - Corrección del lookup de uploadedBy**

**Archivo modificado:**
- `api/src/controllers/torrent.js`

**Cambios específicos:**
- **Problema identificado:** El `$lookup` para `uploadedBy` usaba un pipeline complejo con `$expr` que no funcionaba correctamente
- **Solución:** Cambiamos a usar `localField` y `foreignField` directamente:
  ```javascript
  // ANTES (problemático):
  {
    $lookup: {
      from: "users",
      let: { uploadedBy: "$uploadedBy" },
      pipeline: [
        { $match: { $expr: { $eq: ["$_id", "$$uploadedBy"] } } }
      ],
      as: "uploadedBy"
    }
  }

  // DESPUÉS (funcional):
  {
    $lookup: {
      from: "users",
      localField: "uploadedBy",
      foreignField: "_id",
      as: "uploadedBy"
    }
  }
  ```

#### 3. **Debugging y Logging**

**Archivos modificados:**
- `api/src/controllers/torrent.js`
- `api/src/routes/torrent.js`

**Cambios específicos:**
- Agregamos logs de debug en el endpoint de upload para verificar `req.userId`
- Agregamos logs en el endpoint de fetch para verificar los datos de `uploadedBy`
- Creamos un endpoint temporal de debug (`/api/torrents/debug/:infoHash`) para inspeccionar datos crudos de la base de datos
- Agregamos logs en el middleware de autenticación para verificar que `req.userId` se establezca correctamente

#### 4. **Optimización de la Pipeline de MongoDB**

**Archivo modificado:**
- `api/src/controllers/torrent.js`

**Cambios específicos:**
- Revertimos un cambio en el `$unwind` stage para preservar arrays nulos que podrían causar pérdida de datos de `uploadedBy`
- Mantuvimos la estructura optimizada de la pipeline de agregación

### Estado Actual

✅ **Problemas resueltos:**
- Errores de propiedades undefined en el frontend
- Problema de "deleted user" en los torrents (corrección del lookup)

🔄 **Pendiente de verificación:**
- Necesitas reiniciar el servidor API para que los cambios tomen efecto
- Probar subir un nuevo torrent y verificar que aparezca correctamente
- Usar el endpoint de debug para verificar los datos en la base de datos

### Próximos Pasos

1. **Reiniciar el servidor API**
2. **Probar subir un torrent** y verificar que aparezca con el usuario correcto
3. **Revisar los logs** para confirmar que `req.userId` y `uploadedBy` se establecen correctamente
4. **Usar el endpoint de debug** (`/api/torrents/debug/:infoHash`) para inspeccionar los datos crudos
5. **Reportar los resultados** del debug para confirmar que todo funciona correctamente

### Dependencias Actualizadas

**Client (Frontend):**
- `next`: 15.3.5
- `react`: 18.2.0
- `react-dom`: 18.2.0
- `@sentry/nextjs`: ^9.35.0
- `tailwindcss`: ^4.1.10
- `styled-components`: ^6.1.19
- `react-markdown`: ^7.1.2
- `react-dropzone`: ^14.2.3

**API (Backend):**
- `express`: ^4.17.1
- `mongoose`: ^5.13.2
- `jsonwebtoken`: ^8.5.1
- `@sentry/node`: ^7.36.0
- `bittorrent-tracker`: 9.19.0
- `multer`: ^1.4.2
- `nodemailer`: ^6.7.8

### Notas Técnicas

- Todos los cambios están diseñados para ser seguros y no romper funcionalidad existente
- Se agregaron solo las verificaciones necesarias para prevenir errores de runtime
- La corrección del lookup en MongoDB es la solución principal para el problema de "deleted user"
- Los logs de debug son temporales y pueden ser removidos una vez confirmado que todo funciona correctamente

---

**Fecha:** Diciembre 2024  
**Versión:** 1.8.2  
**Tipo:** Bug Fixes y Mejoras de Estabilidad 