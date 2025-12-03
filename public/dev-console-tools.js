/**
 * COMANDOS DE CONSOLA ÚTILES PARA DESARROLLO
 * 
 * Copia y pega estos comandos en la consola del navegador (F12)
 * para realizar acciones rápidas durante el desarrollo.
 */

// ============================================
// GESTIÓN DE SOLICITUDES
// ============================================

// Ver todas las solicitudes actuales
function verSolicitudes() {
  const requests = JSON.parse(localStorage.getItem('requests') || '[]');
  console.table(requests.map(r => ({
    ID: r.id,
    Cliente: r.clientId,
    Vehículo: r.vehicleId,
    Estado: r.status,
    'ID Card': r.documents.idCard ? '✓' : '✗',
    'Ingresos': r.documents.incomeProof ? '✓' : '✗',
    'Domicilio': r.documents.addressProof ? '✓' : '✗'
  })));
  return requests;
}

// Cambiar estado de una solicitud
function cambiarEstado(requestId, nuevoEstado) {
  const requests = JSON.parse(localStorage.getItem('requests') || '[]');
  const request = requests.find(r => r.id === requestId);
  
  if (!request) {
    console.error(`❌ No se encontró la solicitud con ID ${requestId}`);
    return;
  }
  
  request.status = nuevoEstado;
  
  // Si el estado requiere documentos completos, marcarlos
  if (['review', 'approved', 'conditioned'].includes(nuevoEstado)) {
    request.documents = {
      idCard: true,
      incomeProof: true,
      addressProof: true
    };
  }
  
  localStorage.setItem('requests', JSON.stringify(requests));
  console.log(`✅ Solicitud ${requestId} cambiada a: ${nuevoEstado}`);
  console.log('🔄 Recarga la página para ver los cambios');
}

// Aprobar una solicitud
function aprobarSolicitud(requestId) {
  cambiarEstado(requestId, 'approved');
}

// Rechazar una solicitud
function rechazarSolicitud(requestId) {
  cambiarEstado(requestId, 'rejected');
}

// Poner en revisión
function ponerEnRevision(requestId) {
  cambiarEstado(requestId, 'review');
}

// Marcar como pendiente de docs
function pendienteDocumentos(requestId) {
  cambiarEstado(requestId, 'pending_docs');
}

// ============================================
// GESTIÓN DE DOCUMENTOS
// ============================================

// Completar todos los documentos de una solicitud
function completarDocumentos(requestId) {
  const requests = JSON.parse(localStorage.getItem('requests') || '[]');
  const request = requests.find(r => r.id === requestId);
  
  if (!request) {
    console.error(`❌ No se encontró la solicitud con ID ${requestId}`);
    return;
  }
  
  request.documents = {
    idCard: true,
    incomeProof: true,
    addressProof: true
  };
  
  localStorage.setItem('requests', JSON.stringify(requests));
  console.log(`✅ Documentos completados para solicitud ${requestId}`);
  console.log('🔄 Recarga la página para ver los cambios');
}

// Limpiar todos los documentos de una solicitud
function limpiarDocumentos(requestId) {
  const requests = JSON.parse(localStorage.getItem('requests') || '[]');
  const request = requests.find(r => r.id === requestId);
  
  if (!request) {
    console.error(`❌ No se encontró la solicitud con ID ${requestId}`);
    return;
  }
  
  request.documents = {
    idCard: false,
    incomeProof: false,
    addressProof: false
  };
  
  localStorage.setItem('requests', JSON.stringify(requests));
  console.log(`✅ Documentos limpiados para solicitud ${requestId}`);
  console.log('🔄 Recarga la página para ver los cambios');
}

// ============================================
// GESTIÓN DE DATOS
// ============================================

// Resetear todo a valores iniciales
function resetearTodo() {
  if (confirm('¿Estás seguro de que quieres resetear todos los datos?')) {
    localStorage.clear();
    console.log('✅ Datos reseteados');
    console.log('🔄 Recargando página...');
    location.reload();
  }
}

// Ver todos los datos en localStorage
function verTodoLocalStorage() {
  console.log('📦 Datos en localStorage:');
  console.log('Vehículos:', JSON.parse(localStorage.getItem('vehicles') || '[]'));
  console.log('Clientes:', JSON.parse(localStorage.getItem('clients') || '[]'));
  console.log('Vendedores:', JSON.parse(localStorage.getItem('sellers') || '[]'));
  console.log('Solicitudes:', JSON.parse(localStorage.getItem('requests') || '[]'));
}

// Exportar datos actuales
function exportarDatos() {
  const data = {
    vehicles: JSON.parse(localStorage.getItem('vehicles') || '[]'),
    clients: JSON.parse(localStorage.getItem('clients') || '[]'),
    sellers: JSON.parse(localStorage.getItem('sellers') || '[]'),
    requests: JSON.parse(localStorage.getItem('requests') || '[]')
  };
  
  console.log('📤 Datos exportados:');
  console.log(JSON.stringify(data, null, 2));
  
  // Copiar al portapapeles
  navigator.clipboard.writeText(JSON.stringify(data, null, 2));
  console.log('✅ Datos copiados al portapapeles');
}

// ============================================
// ESCENARIOS PRE-CONFIGURADOS
// ============================================

// Escenario 1: Todas pendientes de documentos
function escenarioPendientes() {
  const requests = JSON.parse(localStorage.getItem('requests') || '[]');
  requests.forEach(r => {
    r.status = 'pending_docs';
    r.documents = { idCard: false, incomeProof: false, addressProof: false };
  });
  localStorage.setItem('requests', JSON.stringify(requests));
  console.log('✅ Todas las solicitudes ahora están pendientes de documentos');
  console.log('🔄 Recarga la página para ver los cambios');
}

// Escenario 2: Todas en revisión
function escenarioRevision() {
  const requests = JSON.parse(localStorage.getItem('requests') || '[]');
  requests.forEach(r => {
    r.status = 'review';
    r.documents = { idCard: true, incomeProof: true, addressProof: true };
  });
  localStorage.setItem('requests', JSON.stringify(requests));
  console.log('✅ Todas las solicitudes ahora están en revisión');
  console.log('🔄 Recarga la página para ver los cambios');
}

// Escenario 3: Todas aprobadas
function escenarioAprobadas() {
  const requests = JSON.parse(localStorage.getItem('requests') || '[]');
  requests.forEach(r => {
    r.status = 'approved';
    r.documents = { idCard: true, incomeProof: true, addressProof: true };
  });
  localStorage.setItem('requests', JSON.stringify(requests));
  console.log('✅ Todas las solicitudes ahora están aprobadas');
  console.log('🔄 Recarga la página para ver los cambios');
}

// Escenario 4: Estados mixtos (default)
function escenarioMixto() {
  const requests = JSON.parse(localStorage.getItem('requests') || '[]');
  if (requests.length >= 3) {
    requests[0].status = 'pending_docs';
    requests[0].documents = { idCard: false, incomeProof: false, addressProof: false };
    
    requests[1].status = 'review';
    requests[1].documents = { idCard: true, incomeProof: true, addressProof: true };
    
    requests[2].status = 'approved';
    requests[2].documents = { idCard: true, incomeProof: true, addressProof: true };
  }
  localStorage.setItem('requests', JSON.stringify(requests));
  console.log('✅ Solicitudes configuradas en estados mixtos');
  console.log('🔄 Recarga la página para ver los cambios');
}

// ============================================
// AYUDA
// ============================================

function ayuda() {
  console.log(`
%c🧪 COMANDOS DE DESARROLLO DISPONIBLES

%c📊 GESTIÓN DE SOLICITUDES:
  verSolicitudes()                    - Ver todas las solicitudes
  cambiarEstado(id, estado)           - Cambiar estado de una solicitud
  aprobarSolicitud(id)                - Aprobar solicitud
  rechazarSolicitud(id)               - Rechazar solicitud
  ponerEnRevision(id)                 - Poner en revisión
  pendienteDocumentos(id)             - Marcar como pendiente de docs

%c📄 GESTIÓN DE DOCUMENTOS:
  completarDocumentos(id)             - Completar todos los documentos
  limpiarDocumentos(id)               - Limpiar todos los documentos

%c💾 GESTIÓN DE DATOS:
  resetearTodo()                      - Resetear todos los datos
  verTodoLocalStorage()               - Ver todos los datos
  exportarDatos()                     - Exportar datos al portapapeles

%c🎯 ESCENARIOS PRE-CONFIGURADOS:
  escenarioPendientes()               - Todas pendientes de docs
  escenarioRevision()                 - Todas en revisión
  escenarioAprobadas()                - Todas aprobadas
  escenarioMixto()                    - Estados mixtos (default)

%c💡 ESTADOS DISPONIBLES:
  'pending_docs'  - Pendiente de documentación
  'review'        - En revisión
  'approved'      - Aprobada
  'rejected'      - Rechazada
  'conditioned'   - Aprobada con condiciones

%c📌 EJEMPLO:
  aprobarSolicitud(1001)
  completarDocumentos(1002)
  cambiarEstado(1003, 'rejected')
  `,
  'color: #a855f7; font-size: 16px; font-weight: bold',
  'color: #3b82f6; font-weight: bold',
  'color: #10b981; font-weight: bold',
  'color: #f59e0b; font-weight: bold',
  'color: #8b5cf6; font-weight: bold',
  'color: #6366f1; font-weight: bold',
  'color: #ec4899; font-weight: bold'
  );
}

// Mostrar ayuda al cargar
console.log('%c🧪 AutoCredit Pro - Comandos de Desarrollo', 'color: #a855f7; font-size: 18px; font-weight: bold');
console.log('%cEscribe ayuda() para ver todos los comandos disponibles', 'color: #64748b; font-style: italic');

// Exportar funciones al objeto window para acceso global
window.devTools = {
  // Solicitudes
  verSolicitudes,
  cambiarEstado,
  aprobarSolicitud,
  rechazarSolicitud,
  ponerEnRevision,
  pendienteDocumentos,
  
  // Documentos
  completarDocumentos,
  limpiarDocumentos,
  
  // Datos
  resetearTodo,
  verTodoLocalStorage,
  exportarDatos,
  
  // Escenarios
  escenarioPendientes,
  escenarioRevision,
  escenarioAprobadas,
  escenarioMixto,
  
  // Ayuda
  ayuda
};

// También exportar directamente al window para fácil acceso
Object.assign(window, window.devTools);
