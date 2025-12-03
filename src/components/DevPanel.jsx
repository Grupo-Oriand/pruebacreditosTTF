import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Settings, RefreshCw, Trash2, CheckCircle } from 'lucide-react';

/**
 * Panel de Control de Desarrollo
 * 
 * Este componente solo debe usarse en desarrollo.
 * Permite cambiar rápidamente el estado de las solicitudes de prueba.
 */
const DevPanel = () => {
  const { requests, updateRequestStatus, uploadDocument } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  // Solo mostrar en desarrollo
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  const handleStatusChange = (requestId, newStatus) => {
    updateRequestStatus(requestId, newStatus);
    
    // Si el estado requiere documentos completos, marcarlos automáticamente
    if (['review', 'approved', 'conditioned'].includes(newStatus)) {
      uploadDocument(requestId, 'idCard');
      uploadDocument(requestId, 'incomeProof');
      uploadDocument(requestId, 'addressProof');
    }
  };

  const handleClearLocalStorage = () => {
    if (window.confirm('¿Estás seguro de que quieres limpiar el localStorage? Esto reiniciará todos los datos a los valores iniciales.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const statusOptions = [
    { value: 'pending_docs', label: '🟡 Pendiente de Docs', color: 'bg-yellow-500' },
    { value: 'review', label: '🔵 En Revisión', color: 'bg-blue-500' },
    { value: 'approved', label: '🟢 Aprobada', color: 'bg-green-500' },
    { value: 'rejected', label: '🔴 Rechazada', color: 'bg-red-500' },
    { value: 'conditioned', label: '🟠 Condicionada', color: 'bg-orange-500' }
  ];

  return (
    <>
      {/* Botón flotante para abrir el panel */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-purple-600 hover:bg-purple-500 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110"
        title="Panel de Desarrollo"
      >
        <Settings className="w-6 h-6" />
      </button>

      {/* Panel deslizable */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 z-40 w-96 bg-dark-bg border-l border-dark-border shadow-2xl overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-dark-border">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-purple-500" />
                  Dev Panel
                </h2>
                <p className="text-xs text-slate-400 mt-1">Control de solicitudes de prueba</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Acciones rápidas */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-slate-300 mb-3 uppercase tracking-wider">Acciones Rápidas</h3>
              <button
                onClick={handleClearLocalStorage}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors font-medium"
              >
                <Trash2 className="w-4 h-4" />
                Limpiar localStorage
              </button>
            </div>

            {/* Lista de solicitudes */}
            <div>
              <h3 className="text-sm font-bold text-slate-300 mb-3 uppercase tracking-wider">
                Solicitudes ({requests.length})
              </h3>
              
              {requests.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <p className="text-sm">No hay solicitudes</p>
                  <p className="text-xs mt-1">Limpia el localStorage para cargar las solicitudes de prueba</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {requests.map(request => (
                    <div
                      key={request.id}
                      className="glass-panel p-4 rounded-xl border border-dark-border"
                    >
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white font-bold text-sm">Solicitud #{request.id}</span>
                          <span className="text-xs text-slate-400">
                            Cliente ID: {request.clientId}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400">
                          Vehículo ID: {request.vehicleId}
                        </div>
                      </div>

                      {/* Selector de estado */}
                      <div>
                        <label className="block text-xs text-slate-400 mb-2 font-medium">
                          Cambiar Estado:
                        </label>
                        <div className="grid grid-cols-1 gap-2">
                          {statusOptions.map(option => (
                            <button
                              key={option.value}
                              onClick={() => handleStatusChange(request.id, option.value)}
                              className={`
                                px-3 py-2 rounded-lg text-xs font-medium transition-all text-left
                                ${request.status === option.value
                                  ? `${option.color} text-white shadow-lg`
                                  : 'bg-dark-surface text-slate-300 hover:bg-dark-border'
                                }
                              `}
                            >
                              <div className="flex items-center justify-between">
                                <span>{option.label}</span>
                                {request.status === option.value && (
                                  <CheckCircle className="w-3 h-3" />
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Estado de documentos */}
                      <div className="mt-3 pt-3 border-t border-dark-border/50">
                        <div className="text-xs text-slate-400 mb-1">Documentos:</div>
                        <div className="flex gap-1">
                          {Object.entries(request.documents || {}).map(([key, value]) => (
                            <span
                              key={key}
                              className={`
                                px-2 py-1 rounded text-xs
                                ${value ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-400'}
                              `}
                            >
                              {key}: {value ? '✓' : '✗'}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
              <h4 className="text-xs font-bold text-purple-400 mb-2">💡 Tip</h4>
              <p className="text-xs text-purple-300/80 leading-relaxed">
                Los cambios se guardan automáticamente en localStorage. 
                Para resetear todo a los valores iniciales, usa el botón "Limpiar localStorage".
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
        />
      )}
    </>
  );
};

export default DevPanel;
