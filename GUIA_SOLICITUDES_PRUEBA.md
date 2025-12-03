# 🧪 Guía de Solicitudes de Prueba - AutoCredit Pro

## 📋 Resumen

Se han creado **3 solicitudes de crédito de prueba** para el usuario `cliente1` (Juan Pérez) que te permiten probar todos los estados posibles de la aplicación en tu entorno de desarrollo.

---

## 🚀 Inicio Rápido

### 1. **Acceder a la aplicación**
   - Usuario: `cliente1`
   - Contraseña: `cliente123`

### 2. **Ver las solicitudes**
   - Las solicitudes se cargan automáticamente al iniciar la aplicación
   - Navega a la pestaña **"Mis Solicitudes"** en el dashboard del cliente

---

## 📊 Solicitudes Disponibles

### Solicitud #1001 - Toyota Corolla
- **Estado inicial**: `pending_docs` (Pendiente de documentación)
- **Vehículo**: Toyota Corolla 2024 ($25,000)
- **Documentos**: Ninguno subido
- **Uso**: Probar el flujo de carga de documentos

### Solicitud #1002 - Ford Mustang
- **Estado inicial**: `review` (En revisión)
- **Vehículo**: Ford Mustang 2023 ($45,000)
- **Documentos**: Todos subidos ✓
- **Uso**: Probar el estado de espera/evaluación

### Solicitud #1003 - Tesla Model 3
- **Estado inicial**: `approved` (Aprobada)
- **Vehículo**: Tesla Model 3 2024 ($42,000)
- **Documentos**: Todos subidos ✓
- **Uso**: Probar ofertas de instituciones financieras

---

## 🔧 Cómo Cambiar Estados

### Método 1: Editar el archivo directamente (Recomendado para testing)

1. Abre el archivo: `src/data/testRequests.js`

2. Busca la solicitud que quieres modificar (por ejemplo, #1001)

3. Cambia el valor de `status` a uno de estos:
   ```javascript
   status: 'pending_docs',  // Pendiente de documentación
   status: 'review',        // En revisión
   status: 'approved',      // Aprobada (muestra ofertas)
   status: 'rejected',      // Rechazada
   status: 'conditioned',   // Aprobada con condiciones
   ```

4. Si cambias a `review`, `approved` o `conditioned`, asegúrate de que los documentos estén completos:
   ```javascript
   documents: {
     idCard: true,
     incomeProof: true,
     addressProof: true
   }
   ```

5. **Limpia el localStorage** para ver los cambios:
   - Abre la consola del navegador (F12)
   - Ejecuta: `localStorage.clear()`
   - Recarga la página (F5)

### Método 2: Usar la aplicación normalmente

- **Subir documentos**: Ve a "Mis Documentos" y sube los documentos requeridos
- **Cambiar estado**: Los estados cambian automáticamente según las acciones:
  - Al subir todos los documentos → cambia a `review`
  - Las instituciones financieras pueden aprobar/rechazar desde su dashboard

---

## 🎯 Escenarios de Prueba Sugeridos

### Escenario 1: Flujo completo de nueva solicitud
1. Configura solicitud #1001 como `pending_docs`
2. Inicia sesión como `cliente1`
3. Ve a "Mis Documentos"
4. Sube los 3 documentos requeridos
5. Observa cómo cambia automáticamente a `review`

### Escenario 2: Ver ofertas aprobadas
1. Configura solicitud #1003 como `approved`
2. Limpia localStorage y recarga
3. Inicia sesión como `cliente1`
4. Ve a "Mis Solicitudes"
5. Observa las ofertas de Bancolombia y Davivienda

### Escenario 3: Solicitud rechazada
1. Configura cualquier solicitud como `rejected`
2. Limpia localStorage y recarga
3. Observa el mensaje de rechazo

### Escenario 4: Múltiples solicitudes en diferentes estados
1. Deja cada solicitud en un estado diferente:
   - #1001: `pending_docs`
   - #1002: `review`
   - #1003: `approved`
2. Observa cómo se muestran todas en el historial

---

## 🗂️ Archivos Relacionados

- **Solicitudes de prueba**: `src/data/testRequests.js` ← **EDITA AQUÍ**
- **Contexto de la app**: `src/context/AppContext.jsx`
- **Dashboard del cliente**: `src/pages/client/ClientDashboard.jsx`
- **Usuarios de prueba**: `src/data/mockUsers.js`

---

## 💡 Tips y Trucos

### Resetear todo a valores iniciales
```javascript
// En la consola del navegador
localStorage.clear();
location.reload();
```

### Ver el estado actual de las solicitudes
```javascript
// En la consola del navegador
JSON.parse(localStorage.getItem('requests'));
```

### Cambiar estado rápidamente desde la consola
```javascript
// En la consola del navegador
let requests = JSON.parse(localStorage.getItem('requests'));
requests[0].status = 'approved'; // Cambia la primera solicitud
requests[0].documents = {idCard: true, incomeProof: true, addressProof: true};
localStorage.setItem('requests', JSON.stringify(requests));
location.reload();
```

---

## 🎨 Estados Visuales

Cada estado tiene su propia apariencia visual:

- 🟡 **pending_docs**: Badge amarillo - "Pendiente de Documentación"
- 🔵 **review**: Badge azul - "En Revisión"
- 🟢 **approved**: Badge verde - "Aprobada" + Ofertas disponibles
- 🔴 **rejected**: Badge rojo - "Rechazada"
- 🟠 **conditioned**: Badge naranja - "Aprobada con Condiciones" + Ofertas

---

## ⚠️ Notas Importantes

1. **localStorage**: Los cambios se guardan en localStorage. Para ver cambios del archivo `testRequests.js`, debes limpiar el localStorage.

2. **IDs únicos**: Las solicitudes de prueba usan IDs del 1001-1003 para evitar conflictos con solicitudes creadas dinámicamente.

3. **Cliente asociado**: Todas las solicitudes están asociadas al `clientId: 1` (Juan Pérez / cliente1).

4. **Vehículos**: Los vehículos (IDs 1-3) ya están pre-cargados en el sistema.

---

## 🐛 Solución de Problemas

### No veo las solicitudes de prueba
1. Limpia el localStorage: `localStorage.clear()`
2. Recarga la página
3. Verifica que estás logueado como `cliente1`

### Los cambios no se reflejan
1. Asegúrate de guardar el archivo `testRequests.js`
2. Limpia el localStorage
3. Recarga la página con Ctrl+Shift+R (hard reload)

### Las ofertas no aparecen
1. Verifica que el estado sea `approved` o `conditioned`
2. Asegúrate de que todos los documentos estén en `true`
3. Revisa la consola del navegador por errores

---

## 📞 Referencia Rápida de Estados

```javascript
// Estados disponibles
'pending_docs'  → Esperando documentos del cliente
'review'        → Documentos completos, en evaluación
'approved'      → Aprobada, muestra ofertas
'rejected'      → Rechazada, sin ofertas
'conditioned'   → Aprobada con condiciones, muestra ofertas
```

---

¡Listo! Ahora puedes probar fácilmente todos los flujos de tu aplicación. 🎉
