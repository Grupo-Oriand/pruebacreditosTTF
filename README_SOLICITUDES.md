# 🧪 Sistema de Solicitudes de Prueba - AutoCredit Pro

## ✅ ¿Qué se ha creado?

Se ha implementado un **sistema completo de solicitudes de prueba** para facilitar el testing de tu aplicación en el entorno de desarrollo. Ahora puedes cambiar fácilmente entre diferentes estados de solicitudes sin necesidad de crear datos manualmente.

---

## 📦 Archivos Creados/Modificados

### Nuevos Archivos:

1. **`src/data/testRequests.js`**
   - Contiene 3 solicitudes de prueba pre-configuradas
   - Cada solicitud tiene un estado diferente por defecto
   - Incluye documentación inline sobre cómo cambiar estados

2. **`src/components/DevPanel.jsx`**
   - Panel de desarrollo flotante (botón morado en la esquina inferior derecha)
   - Permite cambiar estados de solicitudes desde la UI
   - Solo visible en modo desarrollo

3. **`GUIA_SOLICITUDES_PRUEBA.md`**
   - Guía completa de uso
   - Instrucciones detalladas para cada escenario
   - Tips y trucos para desarrollo

### Archivos Modificados:

1. **`src/context/AppContext.jsx`**
   - Ahora carga automáticamente las solicitudes de prueba
   - Las solicitudes se guardan en localStorage

2. **`src/App.jsx`**
   - Incluye el DevPanel en toda la aplicación

3. **`USUARIOS_PRUEBA.md`**
   - Agregada sección sobre solicitudes de prueba
   - Referencia a la guía completa

---

## 🚀 Cómo Usar

### Opción 1: Panel de Desarrollo (Recomendado) 🎯

1. Inicia sesión con cualquier usuario
2. Busca el **botón morado flotante** en la esquina inferior derecha
3. Haz clic para abrir el panel de desarrollo
4. Selecciona el estado deseado para cada solicitud
5. Los cambios se aplican instantáneamente

### Opción 2: Editar el Archivo Directamente

1. Abre `src/data/testRequests.js`
2. Cambia el valor de `status` en la solicitud deseada
3. Abre la consola del navegador (F12)
4. Ejecuta: `localStorage.clear()`
5. Recarga la página (F5)

---

## 📊 Solicitudes Disponibles

| ID | Vehículo | Estado Inicial | Documentos | Propósito |
|---|---|---|---|---|
| **1001** | Toyota Corolla | `pending_docs` | ❌ Ninguno | Probar carga de documentos |
| **1002** | Ford Mustang | `review` | ✅ Completos | Probar evaluación |
| **1003** | Tesla Model 3 | `approved` | ✅ Completos | Probar ofertas bancarias |

---

## 🎨 Estados Disponibles

```javascript
'pending_docs'  // 🟡 Pendiente de documentación
'review'        // 🔵 En revisión
'approved'      // 🟢 Aprobada (muestra ofertas)
'rejected'      // 🔴 Rechazada
'conditioned'   // 🟠 Aprobada con condiciones
```

---

## 🎯 Escenarios de Prueba Rápidos

### Probar flujo completo de documentación:
```javascript
// En testRequests.js, configura:
{
  id: 1001,
  status: 'pending_docs',
  documents: { idCard: false, incomeProof: false, addressProof: false }
}
```
Luego inicia sesión como `cliente1` y sube los documentos.

### Probar ofertas aprobadas:
```javascript
// En testRequests.js, configura:
{
  id: 1003,
  status: 'approved',
  documents: { idCard: true, incomeProof: true, addressProof: true }
}
```
Verás ofertas de Bancolombia y Davivienda.

### Probar solicitud rechazada:
```javascript
// En testRequests.js, configura:
{
  id: 1002,
  status: 'rejected',
  documents: { idCard: true, incomeProof: true, addressProof: true }
}
```
Verás el mensaje de rechazo.

---

## 💡 Tips Importantes

### 1. **Limpiar localStorage**
Cuando edites `testRequests.js`, siempre limpia el localStorage para ver los cambios:
```javascript
localStorage.clear();
location.reload();
```

### 2. **Ver datos actuales**
Para ver el estado actual de las solicitudes en localStorage:
```javascript
console.log(JSON.parse(localStorage.getItem('requests')));
```

### 3. **Cambio rápido desde consola**
```javascript
let requests = JSON.parse(localStorage.getItem('requests'));
requests[0].status = 'approved';
requests[0].documents = {idCard: true, incomeProof: true, addressProof: true};
localStorage.setItem('requests', JSON.stringify(requests));
location.reload();
```

### 4. **DevPanel no aparece**
El DevPanel solo se muestra en modo desarrollo. Si no lo ves:
- Verifica que estés ejecutando `npm run dev`
- Busca el botón morado en la esquina inferior derecha
- Revisa la consola por errores

---

## 🔐 Usuario de Prueba

Para acceder a las solicitudes:
- **Usuario**: `cliente1`
- **Contraseña**: `cliente123`
- **Nombre**: Juan Pérez
- **ID de Cliente**: 1

---

## 📁 Estructura de Archivos

```
src/
├── data/
│   ├── mockUsers.js          # Usuarios de prueba
│   └── testRequests.js       # ⭐ Solicitudes de prueba (EDITA AQUÍ)
├── components/
│   └── DevPanel.jsx          # Panel de desarrollo
├── context/
│   └── AppContext.jsx        # Contexto con solicitudes cargadas
└── pages/
    └── client/
        └── ClientDashboard.jsx  # Dashboard del cliente

GUIA_SOLICITUDES_PRUEBA.md    # 📖 Guía detallada
USUARIOS_PRUEBA.md            # Usuarios disponibles
README_SOLICITUDES.md         # Este archivo
```

---

## 🐛 Solución de Problemas

### No veo las solicitudes
1. ✅ Verifica que estés logueado como `cliente1`
2. ✅ Limpia localStorage: `localStorage.clear()`
3. ✅ Recarga la página
4. ✅ Revisa la consola por errores

### Los cambios no se aplican
1. ✅ Guarda el archivo `testRequests.js`
2. ✅ Limpia localStorage
3. ✅ Recarga con Ctrl+Shift+R (hard reload)

### Las ofertas no aparecen
1. ✅ Estado debe ser `approved` o `conditioned`
2. ✅ Todos los documentos deben estar en `true`
3. ✅ Verifica que el vehículo exista (IDs 1-3)

---

## 🎉 ¡Listo para Probar!

Ahora tienes todo lo necesario para probar tu aplicación en diferentes escenarios:

1. **Inicia sesión** como `cliente1`
2. **Abre el DevPanel** (botón morado)
3. **Cambia estados** con un clic
4. **Prueba todos los flujos** de tu aplicación

---

## 📚 Documentación Adicional

- **Guía Completa**: `GUIA_SOLICITUDES_PRUEBA.md`
- **Usuarios de Prueba**: `USUARIOS_PRUEBA.md`
- **Código Fuente**: `src/data/testRequests.js`

---

**¿Preguntas o problemas?** Revisa la guía completa en `GUIA_SOLICITUDES_PRUEBA.md`
