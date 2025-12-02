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

### 👤 Cliente (Client)
**Usuario:** `cliente1`  
**Contraseña:** `cliente123`  
**Nombre:** Juan Pérez  
**Email:** juan.perez@email.com  
**Teléfono:** +57 310 987 6543  
**ID:** 1234567890  
**Dashboard:** `/client`

---

### 🏦 Institución Financiera #1 (Financial)
**Usuario:** `banco1`  
**Contraseña:** `banco123`  
**Nombre:** María González  
**Empresa:** Bancolombia  
**Email:** creditos@bancolombia.com  
**Teléfono:** +57 320 456 7890  
**Cargo:** Analista de Crédito  
**Dashboard:** `/financial`

---

### 🏦 Institución Financiera #2 (Financial)
**Usuario:** `financiera1`  
**Contraseña:** `financiera123`  
**Nombre:** Andrea Martínez  
**Empresa:** Davivienda  
**Email:** creditos@davivienda.com  
**Teléfono:** +57 315 789 0123  
**Cargo:** Gerente de Créditos  
**Dashboard:** `/financial`

---

## Flujo de Autenticación

1. **Login:** El usuario ingresa sus credenciales (username y password)
2. **Validación:** El sistema busca el usuario en la base de datos mock
3. **Detección de Rol:** Automáticamente detecta si es dealer, client o financial
4. **Redirección:** Redirige al dashboard correspondiente según el rol

## Registro

- Solo los **concesionarios** pueden registrarse directamente desde el login
- Los **clientes** son registrados por los concesionarios
- Las **instituciones financieras** son registradas por el super admin

## Archivos Relacionados

- **Usuarios Mock:** `src/data/mockUsers.js`
- **Componente Login:** `src/pages/Login.jsx`
- **Contexto de Autenticación:** `src/context/AppContext.jsx`

## Notas de Desarrollo

- En producción, reemplazar `mockUsers.js` con llamadas a API real
- Implementar encriptación de contraseñas
- Agregar tokens JWT para sesiones
- Implementar refresh tokens
