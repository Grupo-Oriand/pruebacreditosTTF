# 🚀 Guía Rápida - 30 Segundos

## Opción 1: DevPanel (Recomendado)

1. **Inicia sesión**: `cliente1` / `cliente123`
2. **Busca el botón morado** en la esquina inferior derecha 🟣
3. **Haz clic** para abrir el panel
4. **Selecciona el estado** que quieras probar
5. **¡Listo!** Los cambios se aplican al instante

---

## Opción 2: Consola del Navegador

1. **Presiona F12** para abrir la consola
2. **Escribe**: `ayuda()`
3. **Usa comandos como**:
   ```javascript
   aprobarSolicitud(1001)
   verSolicitudes()
   escenarioMixto()
   ```
4. **Recarga la página** para ver cambios

---

## Opción 3: Editar Archivo

1. **Abre**: `src/data/testRequests.js`
2. **Cambia**: `status: 'approved'`
3. **Consola**: `localStorage.clear()`
4. **Recarga**: F5

---

## 🎯 Estados Disponibles

- `pending_docs` - 🟡 Pendiente de documentación
- `review` - 🔵 En revisión
- `approved` - 🟢 Aprobada (con ofertas)
- `rejected` - 🔴 Rechazada
- `conditioned` - 🟠 Aprobada con condiciones

---

## 📚 Más Información

- **Guía completa**: `GUIA_SOLICITUDES_PRUEBA.md`
- **Resumen**: `README_SOLICITUDES.md`
- **Implementación**: `RESUMEN_IMPLEMENTACION.md`

---

## ⚡ Comandos Más Usados

```javascript
ayuda()                    // Ver todos los comandos
verSolicitudes()           // Ver estado actual
aprobarSolicitud(1001)     // Aprobar solicitud
escenarioMixto()           // Estados mixtos
resetearTodo()             // Limpiar todo
```

---

**¡Eso es todo! Ahora puedes probar tu aplicación fácilmente.** 🎉
