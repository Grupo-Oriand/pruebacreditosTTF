# Usuarios de Prueba - AutoCredit Pro

## Sistema de Autenticación

El sistema ahora detecta automáticamente el tipo de usuario basándose en las credenciales ingresadas. No es necesario seleccionar el rol manualmente.

## Usuarios Disponibles

### 🏢 Concesionario (Dealer)
**Usuario:** `dealer1`  
**Contraseña:** `dealer123`  
**Nombre:** Carlos Rodríguez  
**Empresa:** AutoVentas Premium  
**Email:** dealer@autoventas.com  
**Teléfono:** +57 300 123 4567  
**Dashboard:** `/dealer`

---

### � Gerente de Concesionario (Dealer Manager)
**Usuario:** `gerente1`  
**Contraseña:** `gerente123`  
**Nombre:** Roberto Gómez  
**Empresa:** AutoVentas Premium  
**Email:** gerente@autoventas.com  
**Teléfono:** +57 300 999 8888  
**Dashboard:** `/dealer` (Con acceso a Gestión de Vendedores)

---

### 💼 Vendedor (Seller)
**Usuario:** `vendedor1`  
**Contraseña:** `vendedor123`  
**Nombre:** Ana López  
**Empresa:** AutoVentas Premium  
**Email:** vendedor@autoventas.com  
**Teléfono:** +57 300 777 6666  
**Dashboard:** `/dealer` (Vista limitada de Ventas)

---

### �👤 Cliente (Client)
**Usuario:** `cliente1`  
**Contraseña:** `cliente123`  
**Nombre:** Juan Pérez  
**Email:** juan.perez@email.com  
**Teléfono:** +57 310 987 6543  
**ID:** 1234567890  
**Dashboard:** `/client`

---

### 🏦 Institución Financiera #1 (PIVCA)
**Usuario:** `analista_pivca`  
**Contraseña:** `pivca123`  
**Nombre:** María González  
**Empresa:** PIVCA  
**Email:** creditos@pivca.com  
**Teléfono:** +58 414 123 4567  
**Cargo:** Analista de Crédito Senior  
**Dashboard:** `/financial`

---

### 🏦 Institución Financiera #2 (FIVENCA)
**Usuario:** `analista_fivenca`  
**Contraseña:** `fivenca123`  
**Nombre:** Alejandro Mendoza  
**Empresa:** FIVENCA  
**Email:** analisis@fivenca.com  
**Teléfono:** +58 412 987 6543  
**Cargo:** Gerente de Riesgo  
**Dashboard:** `/financial`

---

### 🏦 Institución Financiera #3 (ARCA)
**Usuario:** `analista_arca`  
**Contraseña:** `arca123`  
**Nombre:** Patricia Elena Torres  
**Empresa:** ARCA  
**Email:** riesgo@arca.com  
**Teléfono:** +58 424 555 8899  
**Cargo:** Coordinadora de Créditos  
**Dashboard:** `/financial`

---

## Flujo de Autenticación

1. **Login:** El usuario ingresa sus credenciales (username y password)
2. **Validación:** El sistema busca el usuario en la base de datos mock
3. **Detección de Rol:** Automáticamente detecta si es dealer, manager, seller, client o financial
4. **Redirección:** Redirige al dashboard correspondiente según el rol

## Registro

- **No existe registro público.** Todos los usuarios son creados por administradores.
- Los **Gerentes** pueden registrar nuevos **Vendedores**.
- Los **Vendedores y Gerentes** registran a los **Clientes**.
- Las **Instituciones Financieras** son registradas por el super admin.

## Archivos Relacionados

- **Usuarios Mock:** `src/data/mockUsers.js`
- **Componente Login:** `src/pages/Login.jsx`
- **Contexto de Autenticación:** `src/context/AppContext.jsx`

## Notas de Desarrollo

- En producción, reemplazar `mockUsers.js` con llamadas a API real
- Implementar encriptación de contraseñas
- Agregar tokens JWT para sesiones
- Implementar refresh tokens

---

## 🧪 Solicitudes de Prueba

El sistema incluye **3 solicitudes de crédito pre-configuradas** para el usuario `cliente1` que permiten probar todos los estados de la aplicación.

### Solicitudes Disponibles:

1. **Solicitud #1001** - Toyota Corolla
   - Estado: `pending_docs` (Pendiente de documentación)
   - Uso: Probar carga de documentos

2. **Solicitud #1002** - Ford Mustang
   - Estado: `review` (En revisión)
   - Uso: Probar estado de evaluación

3. **Solicitud #1003** - Tesla Model 3
   - Estado: `approved` (Aprobada)
   - Uso: Probar ofertas de bancos

### Cómo Cambiar Estados:

1. Edita el archivo: `src/data/testRequests.js`
2. Cambia el valor de `status` a: `pending_docs`, `review`, `approved`, `rejected`, o `conditioned`
3. Limpia localStorage: `localStorage.clear()` en la consola
4. Recarga la página

**📖 Ver guía completa**: `GUIA_SOLICITUDES_PRUEBA.md`
