import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Check, X, AlertTriangle, FileText, DollarSign, User, Calendar, LogOut, Filter, Clock, CheckCircle, XCircle, AlertCircle, Car } from 'lucide-react';
import { StatusBadge } from '../dealer/DealerDashboard';
import { useNavigate } from 'react-router-dom';

const FinancialDashboard = () => {
  const { requests, clients, vehicles, updateRequestStatus, logout } = useApp();
  const navigate = useNavigate();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all'); // all, pending_docs, review, approved, rejected, conditioned

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Filter requests based on selected filter
  const poolRequests = requests.filter(r => {
    if (filterStatus === 'all') return true;
    return r.status === filterStatus;
  });

  const handleDecision = (status) => {
    if (selectedRequest) {
      updateRequestStatus(selectedRequest.id, status);
      setSelectedRequest(null);
    }
  };

  const FilterButton = ({ status, icon, label, count, description }) => (
    <button
      onClick={() => setFilterStatus(status)}
      className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all text-left group ${filterStatus === status
        ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/20'
        : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
        }`}
    >
      <div className={`p-2 rounded-lg ${filterStatus === status ? 'bg-white/20' : 'bg-dark-bg group-hover:bg-dark-bg/80'}`}>
        {icon}
      </div>
      <div className="flex-1">
        <span className="block text-sm font-semibold">{label}</span>
        {description && <span className={`text-[10px] ${filterStatus === status ? 'text-primary-100' : 'text-slate-500'}`}>{description}</span>}
      </div>
      {count > 0 && (
        <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${filterStatus === status ? 'bg-white/20 text-white' : 'bg-dark-bg text-slate-500'
          }`}>
          {count}
        </span>
      )}
    </button>
  );

  const GridFilterButton = ({ status, icon, label, count, colorClass }) => (
    <button
      onClick={() => setFilterStatus(status)}
      className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all border ${filterStatus === status
        ? `bg-${colorClass}-500/20 border-${colorClass}-500 text-white ring-1 ring-${colorClass}-500`
        : 'bg-dark-bg border-dark-border text-slate-400 hover:border-slate-500 hover:text-slate-200'
        }`}
    >
      <div className={`mb-2 ${filterStatus === status ? `text-${colorClass}-400` : ''}`}>
        {icon}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-wider text-center leading-tight">{label}</span>
      <span className={`mt-1 text-xs font-bold ${filterStatus === status ? 'text-white' : 'text-slate-500'}`}>
        {count}
      </span>
    </button>
  );

  // Counts for badges
  const getCount = (status) => requests.filter(r => r.status === status).length;

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
        {/* 1. Filter Sidebar (Left) */}
        <div className="w-72 border-r border-dark-border bg-dark-surface flex flex-col py-6 px-4 gap-6 flex-shrink-0 overflow-y-auto">

          {/* General View */}
          <div>
            <FilterButton
              status="all"
              icon={<Filter className="w-5 h-5" />}
              label="Todas las Solicitudes"
              description="Vista general del pipeline"
              count={requests.length}
            />
          </div>

          {/* Status Grid */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-1">Estado de Solicitud</h3>
            <div className="grid grid-cols-2 gap-3">
              <GridFilterButton
                status="pending_docs"
                icon={<Clock className="w-6 h-6" />}
                label="Pendientes"
                count={getCount('pending_docs')}
                colorClass="blue"
              />
              <GridFilterButton
                status="review"
                icon={<FileText className="w-6 h-6" />}
                label="Revisión"
                count={getCount('review')}
                colorClass="purple"
              />
              <GridFilterButton
                status="approved"
                icon={<CheckCircle className="w-6 h-6" />}
                label="Aprobadas"
                count={getCount('approved')}
                colorClass="green"
              />
              <GridFilterButton
                status="rejected"
                icon={<XCircle className="w-6 h-6" />}
                label="Rechazadas"
                count={getCount('rejected')}
                colorClass="red"
              />
            </div>
          </div>

          {/* Other Filters */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">Otros</h3>
            <FilterButton
              status="conditioned"
              icon={<AlertCircle className="w-5 h-5" />}
              label="Condicionadas"
              count={getCount('conditioned')}
            />
          </div>
        </div>

        {/* 2. Request List (Center - Main Area) */}
        <div className="flex-1 bg-dark-bg overflow-y-auto p-6 border-r border-dark-border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white text-xl font-bold">
              {filterStatus === 'all' ? 'Todas las Solicitudes' :
                filterStatus === 'pending_docs' ? 'Pendientes de Documentación' :
                  filterStatus === 'review' ? 'Solicitudes en Revisión' :
                    filterStatus === 'approved' ? 'Solicitudes Aprobadas' :
                      filterStatus === 'rejected' ? 'Solicitudes Rechazadas' : 'Solicitudes Condicionadas'}
            </h2>
            <span className="bg-primary-500/20 text-primary-400 text-sm font-bold px-3 py-1 rounded-full">{poolRequests.length} solicitudes</span>
          </div>

          <div className="flex flex-col gap-3">
            {poolRequests.map(req => {
              const client = clients.find(c => c.id === req.clientId);
              const vehicle = vehicles.find(v => v.id === req.vehicleId);
              const isSelected = selectedRequest?.id === req.id;

              return (
                <div
                  key={req.id}
                  onClick={() => setSelectedRequest(req)}
                  className={`w-full p-4 rounded-xl border cursor-pointer transition-all group relative overflow-hidden flex items-center gap-4 ${isSelected
                    ? 'bg-primary-900/20 border-primary-500 ring-1 ring-primary-500 shadow-xl'
                    : 'bg-dark-surface border-dark-border hover:border-primary-500/50 hover:bg-dark-surface/80'
                    }`}
                >
                  {isSelected && <div className="absolute top-0 left-0 w-1 h-full bg-primary-500"></div>}

                  {/* ID & Date */}
                  <div className="flex flex-col gap-1 min-w-[80px]">
                    <span className="px-2 py-0.5 bg-dark-bg text-slate-400 text-xs font-mono rounded border border-dark-border w-fit">
                      #{req.id}
                    </span>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(req.date).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Client Info */}
                  <div className="flex-1 min-w-[150px]">
                    <p className="text-xs text-slate-400 mb-0.5">Cliente</p>
                    <h3 className="font-bold text-white text-base truncate">{client?.name}</h3>
                  </div>

                  {/* Vehicle Info */}
                  <div className="flex items-center gap-3 flex-1 min-w-[200px]">
                    <div className="w-10 h-10 rounded-lg bg-dark-bg overflow-hidden flex-shrink-0 border border-dark-border/50">
                      <img src={vehicle?.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs text-slate-400">Vehículo</p>
                      <p className="text-sm text-slate-200 font-medium truncate">{vehicle?.make} {vehicle?.model}</p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="min-w-[120px] flex justify-end">
                    <StatusBadge status={req.status} />
                  </div>
                </div>
              );
            })}
          </div>

          {poolRequests.length === 0 && (
            <div className="flex flex-col items-center justify-center h-96 text-slate-500 border-2 border-dashed border-dark-border rounded-2xl bg-dark-surface/30">
              <Filter className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-lg font-medium">No se encontraron solicitudes</p>
              <p className="text-sm">Intenta cambiar los filtros de búsqueda</p>
            </div>
          )}
        </div>

        {/* 3. Detail Column (Right - Fixed Width) */}
        <div className="w-[450px] bg-dark-surface/50 border-l border-dark-border overflow-y-auto flex-shrink-0">
          {selectedRequest ? (
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-white">Evaluación</h2>
                  <p className="text-slate-400 text-sm">Solicitud #{selectedRequest.id}</p>
                </div>
                <button onClick={() => setSelectedRequest(null)} className="text-slate-500 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Client Profile */}
              <div className="glass-panel p-5 rounded-xl bg-dark-bg">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-wider">
                  <User className="w-4 h-4 text-primary-500" /> Cliente
                </h3>
                {(() => {
                  const client = clients.find(c => c.id === selectedRequest.clientId);
                  return (
                    <div className="space-y-3">
                      <InfoRow label="Nombre" value={client?.name} />
                      <InfoRow label="Email" value={client?.email} />
                      <InfoRow label="Teléfono" value={client?.phone} />
                      <InfoRow label="ID" value={client?.idNumber || 'N/A'} />
                      <div className="pt-2 border-t border-dark-border/50">
                        <InfoRow label="Score (Sim)" value="750" highlight />
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Vehicle Details */}
              <div className="glass-panel p-5 rounded-xl bg-dark-bg">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-wider">
                  <Car className="w-4 h-4 text-primary-500" /> Vehículo
                </h3>
                {(() => {
                  const vehicle = vehicles.find(v => v.id === selectedRequest.vehicleId);
                  return (
                    <div className="space-y-3">
                      <div className="aspect-video rounded-lg overflow-hidden mb-3">
                        <img src={vehicle?.image} alt="Car" className="w-full h-full object-cover" />
                      </div>
                      <InfoRow label="Marca" value={vehicle?.make} />
                      <InfoRow label="Modelo" value={vehicle?.model} />
                      <InfoRow label="Año" value={vehicle?.year} />
                      <InfoRow label="Precio" value={`$${vehicle?.price.toLocaleString()}`} />
                    </div>
                  );
                })()}
              </div>

              {/* Documents Review */}
              <div className="glass-panel p-5 rounded-xl bg-dark-bg">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-wider">
                  <FileText className="w-4 h-4 text-primary-500" /> Documentos
                </h3>
                <div className="space-y-2">
                  <DocPreviewRow name="DNI / Pasaporte" verified={selectedRequest.documents?.idCard} />
                  <DocPreviewRow name="Recibos de Sueldo" verified={selectedRequest.documents?.incomeProof} />
                  <DocPreviewRow name="Comp. Domicilio" verified={selectedRequest.documents?.addressProof} />
                </div>
              </div>

              {/* Action Buttons (Footer) */}
              <div className="pt-4 border-t border-dark-border">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 text-center">Decisión Final</h3>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => handleDecision('rejected')}
                    className="py-3 rounded-xl bg-dark-surface border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all flex flex-col items-center justify-center gap-1 group"
                  >
                    <XCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold uppercase">Rechazar</span>
                  </button>

                  <button
                    onClick={() => handleDecision('review')}
                    className="py-3 rounded-xl bg-dark-surface border border-orange-500/30 text-orange-400 hover:bg-orange-500/10 transition-all flex flex-col items-center justify-center gap-1 group"
                  >
                    <AlertTriangle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold uppercase">En Revisión</span>
                  </button>

                  <button
                    onClick={() => handleDecision('approved')}
                    className="py-3 rounded-xl bg-green-600 text-white shadow-lg shadow-green-900/20 hover:bg-green-500 transition-all flex flex-col items-center justify-center gap-1 group"
                  >
                    <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold uppercase">Aprobar</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-dark-surface flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 opacity-50" />
              </div>
              <p className="text-lg font-medium text-slate-300">Detalle de Solicitud</p>
              <p className="text-sm mt-2">Selecciona una solicitud de la lista para ver su evaluación completa.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const InfoRow = ({ label, value, highlight }) => (
  <div className="flex justify-between items-center text-sm">
    <span className="text-slate-400">{label}</span>
    <span className={`font-medium ${highlight ? 'text-green-400' : 'text-slate-200'}`}>{value}</span>
  </div>
);

const DocPreviewRow = ({ name, verified }) => (
  <div className="flex items-center justify-between p-3 rounded-lg bg-dark-surface border border-dark-border">
    <div className="flex items-center gap-3">
      <FileText className={`w-4 h-4 ${verified ? 'text-primary-500' : 'text-slate-600'}`}>{name}</FileText>
      <span className={`text-sm ${verified ? 'text-slate-200' : 'text-slate-500'}`}>{name}</span>
    </div>
    {verified ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <Clock className="w-4 h-4 text-slate-600" />
    )}
  </div>
);

export default FinancialDashboard;
