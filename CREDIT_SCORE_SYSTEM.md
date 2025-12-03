# Sistema de Credit Score Dinámico

## Funcionamiento Automático

El Credit Score se actualiza **automáticamente en tiempo real** cuando:

1. **El cliente sube documentos**
   - Cada documento subido aumenta el componente "Documentos Cargados" (hasta 30 puntos)
   - El score se recalcula inmediatamente
   - Las financieras ven el cambio en tiempo real

2. **El cliente completa su perfil**
   - Al completar el formulario de solicitud con datos personales
   - Al agregar información financiera (ocupación, ingresos, años de empleo)
   - Cada campo completado mejora el componente "Calidad de Información" (hasta 35 puntos)

3. **Cambios en la relación perfil-vehículo**
   - Se evalúa automáticamente el ratio ingreso/precio del vehículo
   - Se considera la edad del cliente
   - Se valoran los años de experiencia laboral
   - Este componente aporta hasta 35 puntos

## Ejemplo de Flujo

### Estado Inicial (Score: ~30/100)
```javascript
Cliente: Juan Pérez
- Información básica: Nombre, email, teléfono ✓
- Información financiera: ✗
- Documentos: 0/4 subidos
```

### Después de Completar Formulario (Score: ~55/100)
```javascript
Cliente: Juan Pérez
- Información personal completa ✓
- Información financiera: Ingeniero, $5000/mes, 8 años ✓
- Documentos: 0/4 subidos
- Ratio ingreso/precio: 20% (excelente) ✓
```

### Después de Subir Documentos (Score: ~85/100)
```javascript
Cliente: Juan Pérez
- Información personal completa ✓
- Información financiera completa ✓
- Documentos: 4/4 subidos ✓
- Calificación: EXCELENTE
```

## Visualización en Tiempo Real

### En la Lista de Solicitudes
- Barra de progreso con código de colores
- Badge de calificación (Bajo/Regular/Bueno/Excelente)
- Score numérico (X/100)

### En el Panel de Detalles
- Tarjeta destacada con el score total
- Desglose detallado de los 3 componentes:
  - Perfil vs Vehículo (X/35)
  - Calidad de Información (X/35)
  - Documentos Cargados (X/30)

## Datos de Prueba

Para probar el sistema dinámico:

1. **Iniciar sesión como cliente** (usuario: `cliente1`, contraseña: `cliente123`)
2. **Ir a "Mis Documentos"**
3. **Subir documentos uno por uno**
4. **Iniciar sesión como financiera** (usuario: `analista_pivca`, contraseña: `pivca123`)
5. **Ver cómo el Credit Score aumenta** con cada documento subido

## Cálculo Técnico

El score se calcula en la función `calculateCreditScore()` que se ejecuta:
- En cada render del componente FinancialDashboard
- Cuando cambia el estado de `requests` (al subir documentos)
- Cuando cambia el estado de `clients` (al actualizar perfil)

```javascript
// El cálculo es completamente reactivo
const creditScore = calculateCreditScore(request, client, vehicle);

// React detecta cambios en:
// - request.documents (cuando se suben archivos)
// - client.* (cuando se actualiza el perfil)
// - Y re-renderiza automáticamente
```

## Notas Importantes

- ✅ El sistema es **100% reactivo** - no requiere refrescar la página
- ✅ Los cambios son **instantáneos** - se ven en tiempo real
- ✅ El score es **específico por solicitud** - cada solicitud tiene su propio score
- ✅ El cálculo es **determinista** - mismo input = mismo output
