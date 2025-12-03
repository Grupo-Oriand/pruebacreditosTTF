/**
 * SOLICITUDES DE PRUEBA - AutoCredit Pro
 * 
 * Este archivo contiene solicitudes de crédito pre-configuradas para el usuario de prueba.
 * Puedes cambiar fácilmente el estado de las solicitudes para probar diferentes escenarios.
 * 
 * ESTADOS DISPONIBLES:
 * - 'pending_docs': Pendiente de documentación
 * - 'review': En revisión (todos los documentos subidos)
 * - 'approved': Aprobada (muestra ofertas)
 * - 'rejected': Rechazada
 * - 'conditioned': Aprobada con condiciones (muestra ofertas)
 */

export const testRequests = [
  // Solicitud 1: Pendiente de documentación
  {
    id: 1001,
    clientId: 1, // Juan Pérez (cliente1)
    vehicleId: 1, // Toyota Corolla
    status: 'pending_docs', // 👈 CAMBIA ESTE ESTADO PARA PROBAR
    date: '2024-11-28T10:00:00.000Z',
    documents: {
      idCard: false,
      incomeProof: false,
      addressProof: false
    },
    notes: 'Solicitud inicial - Documentación pendiente'
  },

  // Solicitud 2: En revisión
  {
    id: 1002,
    clientId: 1, // Juan Pérez (cliente1)
    vehicleId: 2, // Ford Mustang
    status: 'review', // 👈 CAMBIA ESTE ESTADO PARA PROBAR
    date: '2024-11-25T14:30:00.000Z',
    documents: {
      idCard: true,
      incomeProof: true,
      addressProof: true
    },
    notes: 'Todos los documentos subidos - En evaluación'
  },

  // Solicitud 3: Aprobada (con ofertas)
  {
    id: 1003,
    clientId: 1, // Juan Pérez (cliente1)
    vehicleId: 3, // Tesla Model 3
    status: 'approved', // 👈 CAMBIA ESTE ESTADO PARA PROBAR
    date: '2024-11-20T09:15:00.000Z',
    documents: {
      idCard: true,
      incomeProof: true,
      addressProof: true
    },
    notes: 'Solicitud aprobada - Ofertas disponibles'
  }
];

/**
 * GUÍA DE USO RÁPIDO:
 * 
 * 1. Para probar DOCUMENTACIÓN PENDIENTE:
 *    - Cambia status a 'pending_docs'
 *    - Cambia documents a { idCard: false, incomeProof: false, addressProof: false }
 * 
 * 2. Para probar EN REVISIÓN:
 *    - Cambia status a 'review'
 *    - Cambia documents a { idCard: true, incomeProof: true, addressProof: true }
 * 
 * 3. Para probar APROBADA (con ofertas):
 *    - Cambia status a 'approved'
 *    - Los documentos deben estar en true
 * 
 * 4. Para probar RECHAZADA:
 *    - Cambia status a 'rejected'
 * 
 * 5. Para probar APROBADA CON CONDICIONES:
 *    - Cambia status a 'conditioned'
 * 
 * EJEMPLO DE CAMBIO RÁPIDO:
 * Para cambiar la solicitud 1001 a "aprobada", simplemente edita:
 * 
 *   status: 'approved',
 *   documents: {
 *     idCard: true,
 *     incomeProof: true,
 *     addressProof: true
 *   }
 */

// Función para cargar las solicitudes de prueba en el contexto
export const loadTestRequests = () => {
  return testRequests;
};

// Función para obtener una solicitud específica
export const getTestRequest = (id) => {
  return testRequests.find(req => req.id === id);
};

// Función para cambiar el estado de una solicitud de prueba
export const changeTestRequestStatus = (id, newStatus) => {
  const request = testRequests.find(req => req.id === id);
  if (request) {
    request.status = newStatus;
    
    // Si el estado es 'review', 'approved' o 'conditioned', asegurar que los documentos estén completos
    if (['review', 'approved', 'conditioned'].includes(newStatus)) {
      request.documents = {
        idCard: true,
        incomeProof: true,
        addressProof: true
      };
    }
    
    return request;
  }
  return null;
};

export default testRequests;
