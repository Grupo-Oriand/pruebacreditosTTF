import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Check, X, AlertTriangle, FileText, DollarSign, User, Calendar, LogOut } from 'lucide-react';
import { StatusBadge } from '../dealer/DealerDashboard';
import { useNavigate } from 'react-router-dom';

const FinancialDashboard = () => {
  const { requests, clients, vehicles, updateRequestStatus, logout } = useApp();
  const navigate = useNavigate();
  const [selectedRequest, setSelectedRequest] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Filter only requests that are ready for review (or already processed)
  const poolRequests = requests.filter(r => r.status !== 'pending_docs');

  const handleDecision = (status) => {
    if (selectedRequest) {
      updateRequestStatus(selectedRequest.id, status);
      setSelectedRequest(null);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col">
      <header className="bg-dark-surface border-b border-dark-border px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center">
            <DollarSign className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Portal Financiero</h1>
            <p className="text-xs text-slate-400">Evaluación de Riesgos</p>
          </div>
        </div>
        <button onClick={handleLogout} className="btn-secondary flex items-center gap-2">
          <LogOut className="w-4 h-4" /> Salir
        </button>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Request Pool */}
        <div className="w-96 border-r border-dark-border bg-dark-bg/50 overflow-y-auto p-4">
          <h2 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-4">Pool de Solicitudes ({poolRequests.length})</h2>
          <div className="space-y-3">
            {poolRequests.map(req => {
              const client = clients.find(c => c.id === req.clientId);
              const vehicle = vehicles.find(v => v.id === req.vehicleId);
              return (
                <div 
                  key={req.id}
                  onClick={() => setSelectedRequest(req)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedRequest?.id === req.id ? 'bg-primary-900/20 border-primary-500 ring-1 ring-primary-500' : 'bg-dark-surface border-dark-border hover:border-slate-500'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-mono text-slate-500">#{req.id}</span>
                    <StatusBadge status={req.status} />
                  </div>
                  <h3 className="font-bold text-slate-200">{client?.name}</h3>
                  <p className="text-sm text-slate-400">{vehicle?.make} {vehicle?.model}</p>
                  <p className="text-xs text-slate-500 mt-2">{new Date(req.date).toLocaleDateString()}</p>
                </div>
              );
            })}
            {poolRequests.length === 0 && (
              <div className="text-center py-10 text-slate-500">
                <p>No hay solicitudes pendientes de revisión.</p>
              </div>
            )}
          </div>
        </div>

        {/* Main Content: Review Area */}
        <div className="flex-1 bg-dark-bg p-8 overflow-y-auto">
          {selectedRequest ? (
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Evaluación de Crédito</h2>
                  <p className="text-slate-400">Solicitud #{selectedRequest.id}</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => handleDecision('rejected')} className="px-4 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2">
                    <X className="w-4 h-4" /> Rechazar
                  </button>
                  <button onClick={() => handleDecision('conditioned')} className="px-4 py-2 rounded-lg border border-orange-500/30 text-orange-400 hover:bg-orange-500/10 transition-colors flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Condicionar
                  </button>
                  <button onClick={() => handleDecision('approved')} className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/20 transition-colors flex items-center gap-2">
                    <Check className="w-4 h-4" /> Aprobar Crédito
                  </button>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-6">
                {/* Client Profile */}
                <div className="glass-panel p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <User className="text-primary-500" /> Perfil del Cliente
                  </h3>
                  {(() => {
                    const client = clients.find(c => c.id === selectedRequest.clientId);
                    return (
                      <div className="space-y-4">
                        <InfoRow label="Nombre" value={client?.name} />
                        <InfoRow label="Email" value={client?.email} />
                        <InfoRow label="Teléfono" value={client?.phone} />
                        <InfoRow label="Score Crediticio" value="750 (Simulado)" highlight />
                      </div>
                    );
                  })()}
                </div>

                {/* Vehicle Details */}
                <div className="glass-panel p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Car className="text-primary-500" /> Vehículo Solicitado
                  </h3>
                  {(() => {
                    const vehicle = vehicles.find(v => v.id === selectedRequest.vehicleId);
                    return (
                      <div className="space-y-4">
                        <img src={vehicle?.image} alt="Car" className="w-full h-32 object-cover rounded-lg mb-4" />
                        <InfoRow label="Vehículo" value={`${vehicle?.make} ${vehicle?.model}`} />
                        <InfoRow label="Año" value={vehicle?.year} />
                        <InfoRow label="Precio" value={`$${vehicle?.price.toLocaleString()}`} />
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Documents Review */}
              <div className="glass-panel p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <FileText className="text-primary-500" /> Documentación Adjunta
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <DocPreview name="DNI / Pasaporte" />
                  <DocPreview name="Recibos de Sueldo" />
                  <DocPreview name="Comprobante Domicilio" />
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-500">
              <FileText className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-lg">Selecciona una solicitud del panel izquierdo para evaluarla.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const InfoRow = ({ label, value, highlight }) => (
  <div className="flex justify-between items-center border-b border-dark-border/50 pb-2 last:border-0">
    <span className="text-slate-400 text-sm">{label}</span>
    <span className={`font-medium ${highlight ? 'text-green-400' : 'text-slate-200'}`}>{value}</span>
  </div>
);

const DocPreview = ({ name }) => (
  <div className="aspect-[3/4] bg-dark-bg border border-dark-border rounded-lg flex flex-col items-center justify-center p-4 hover:border-primary-500 cursor-pointer transition-colors group">
    <FileText className="w-8 h-8 text-slate-600 group-hover:text-primary-500 mb-2 transition-colors" />
    <span className="text-xs text-center text-slate-400 group-hover:text-slate-200">{name}</span>
    <span className="mt-2 text-[10px] px-2 py-1 bg-green-500/10 text-green-500 rounded-full">Verificado</span>
  </div>
);

export default FinancialDashboard;
