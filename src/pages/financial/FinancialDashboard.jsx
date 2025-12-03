import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Check, X, AlertTriangle, FileText, DollarSign, User, Calendar, LogOut, Filter, Clock, CheckCircle, XCircle, AlertCircle, Car } from 'lucide-react';
import { StatusBadge } from '../dealer/DealerDashboard';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const FinancialDashboard = () => {
  const { requests, clients, vehicles, updateRequestStatus, logout } = useApp();
  const navigate = useNavigate();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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
    <Button
      variant="ghost"
      onClick={() => setFilterStatus(status)}
      className={cn(
        "w-full justify-start gap-3 h-auto p-3",
        filterStatus === status && "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
      )}
    >
      <div className={cn(
        "p-2 rounded-lg",
        filterStatus === status ? "bg-primary-foreground/20" : "bg-muted"
      )}>
        {icon}
      </div>
      <div className="flex-1 text-left">
        <span className="block text-sm font-semibold">{label}</span>
        {description && (
          <span className="text-[10px] text-muted-foreground">{description}</span>
        )}
      </div>
      {count > 0 && (
        <span className={cn(
          "px-2 py-0.5 rounded-md text-xs font-bold",
          filterStatus === status ? "bg-primary-foreground/20" : "bg-muted"
        )}>
          {count}
        </span>
      )}
    </Button>
  );

  const GridFilterButton = ({ status, icon, label, count, colorClass }) => (
    <Button
      variant="outline"
      onClick={() => setFilterStatus(status)}
      className={cn(
        "flex flex-col items-center justify-center h-auto p-3",
        filterStatus === status && `bg-${colorClass}-500/20 border-${colorClass}-500 text-${colorClass}-400 hover:bg-${colorClass}-500/30`
      )}
    >
      <div className="mb-2">{icon}</div>
      <span className="text-[10px] font-bold uppercase tracking-wider text-center leading-tight">
        {label}
      </span>
      <span className="mt-1 text-xs font-bold">{count}</span>
    </Button>
  );

  const getCount = (status) => requests.filter(r => r.status === status).length;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center">
            <DollarSign className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Portal Financiero</h1>
            <p className="text-xs text-muted-foreground">Evaluación de Riesgos</p>
          </div>
        </div>
        <Button variant="outline" onClick={handleLogout} className="gap-2">
          <LogOut className="w-4 h-4" /> Salir
        </Button>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Filter Sidebar */}
        <div className="w-72 border-r bg-card flex flex-col py-6 px-4 gap-6 flex-shrink-0 overflow-y-auto">
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
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 px-1">
              Estado de Solicitud
            </h3>
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
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 px-1">
              Otros
            </h3>
            <FilterButton
              status="conditioned"
              icon={<AlertCircle className="w-5 h-5" />}
              label="Condicionadas"
              count={getCount('conditioned')}
            />
          </div>
        </div>

        {/* Request List */}
        <div className="flex-1 bg-background overflow-y-auto p-6 border-r">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">
              {filterStatus === 'all' ? 'Todas las Solicitudes' :
                filterStatus === 'pending_docs' ? 'Pendientes de Documentación' :
                  filterStatus === 'review' ? 'Solicitudes en Revisión' :
                    filterStatus === 'approved' ? 'Solicitudes Aprobadas' :
                      filterStatus === 'rejected' ? 'Solicitudes Rechazadas' : 'Solicitudes Condicionadas'}
            </h2>
            <span className="bg-primary/20 text-primary text-sm font-bold px-3 py-1 rounded-full">
              {poolRequests.length} solicitudes
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {poolRequests.map(req => {
              const client = clients.find(c => c.id === req.clientId);
              const vehicle = vehicles.find(v => v.id === req.vehicleId);
              const isSelected = selectedRequest?.id === req.id;

              return (
                <Card
                  key={req.id}
                  onClick={() => setSelectedRequest(req)}
                  className={cn(
                    "cursor-pointer transition-all relative overflow-hidden",
                    isSelected && "border-primary ring-1 ring-primary shadow-xl"
                  )}
                >
                  {isSelected && <div className="absolute top-0 left-0 w-1 h-full bg-primary" />}
                  <CardContent className="p-4 flex items-center gap-4">
                    {/* ID & Date */}
                    <div className="flex flex-col gap-1 min-w-[80px]">
                      <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs font-mono rounded border w-fit">
                        #{req.id}
                      </span>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(req.date).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Client Info */}
                    <div className="flex-1 min-w-[150px]">
                      <p className="text-xs text-muted-foreground mb-0.5">Cliente</p>
                      <h3 className="font-bold text-base truncate">{client?.name}</h3>
                    </div>

                    {/* Vehicle Info */}
                    <div className="flex items-center gap-3 flex-1 min-w-[200px]">
                      <div className="w-10 h-10 rounded-lg bg-muted overflow-hidden flex-shrink-0 border">
                        <img src={vehicle?.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs text-muted-foreground">Vehículo</p>
                        <p className="text-sm font-medium truncate">
                          {vehicle?.make} {vehicle?.model}
                        </p>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="min-w-[120px] flex justify-end">
                      <StatusBadge status={req.status} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {poolRequests.length === 0 && (
            <Card className="flex flex-col items-center justify-center h-96 border-dashed">
              <CardContent className="text-center pt-6">
                <Filter className="w-12 h-12 mb-4 opacity-20 mx-auto" />
                <p className="text-lg font-medium">No se encontraron solicitudes</p>
                <p className="text-sm text-muted-foreground">Intenta cambiar los filtros de búsqueda</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Detail Column */}
        <div className="w-[450px] bg-card/50 border-l overflow-y-auto flex-shrink-0">
          {selectedRequest ? (
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">Evaluación</h2>
                  <p className="text-muted-foreground text-sm">Solicitud #{selectedRequest.id}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedRequest(null)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Client Profile */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2 uppercase tracking-wider">
                    <User className="w-4 h-4 text-primary" /> Cliente
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {(() => {
                    const client = clients.find(c => c.id === selectedRequest.clientId);
                    return (
                      <>
                        <InfoRow label="Nombre" value={client?.name} />
                        <InfoRow label="Email" value={client?.email} />
                        <InfoRow label="Teléfono" value={client?.phone} />
                        <InfoRow label="ID" value={client?.idNumber || 'N/A'} />
                        <div className="pt-2 border-t">
                          <InfoRow label="Score (Sim)" value="750" highlight />
                        </div>
                      </>
                    );
                  })()}
                </CardContent>
              </Card>

              {/* Vehicle Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2 uppercase tracking-wider">
                    <Car className="w-4 h-4 text-primary" /> Vehículo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {(() => {
                    const vehicle = vehicles.find(v => v.id === selectedRequest.vehicleId);
                    return (
                      <>
                        <div className="aspect-video rounded-lg overflow-hidden mb-3">
                          <img src={vehicle?.image} alt="Car" className="w-full h-full object-cover" />
                        </div>
                        <InfoRow label="Marca" value={vehicle?.make} />
                        <InfoRow label="Modelo" value={vehicle?.model} />
                        <InfoRow label="Año" value={vehicle?.year} />
                        <InfoRow label="Precio" value={`$${vehicle?.price.toLocaleString()}`} />
                      </>
                    );
                  })()}
                </CardContent>
              </Card>

              {/* Documents Review */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2 uppercase tracking-wider">
                    <FileText className="w-4 h-4 text-primary" /> Documentos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <DocPreviewRow name="DNI / Pasaporte" verified={selectedRequest.documents?.idCard} />
                  <DocPreviewRow name="Recibos de Sueldo" verified={selectedRequest.documents?.incomeProof} />
                  <DocPreviewRow name="Comp. Domicilio" verified={selectedRequest.documents?.addressProof} />
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="pt-4 border-t">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 text-center">
                  Decisión Final
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => handleDecision('rejected')}
                    className="flex-col h-auto py-3 border-red-500/30 text-red-400 hover:bg-red-500/10 gap-1"
                  >
                    <XCircle className="w-5 h-5" />
                    <span className="text-[10px] font-bold uppercase">Rechazar</span>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => handleDecision('review')}
                    className="flex-col h-auto py-3 border-orange-500/30 text-orange-400 hover:bg-orange-500/10 gap-1"
                  >
                    <AlertTriangle className="w-5 h-5" />
                    <span className="text-[10px] font-bold uppercase">En Revisión</span>
                  </Button>

                  <Button
                    onClick={() => handleDecision('approved')}
                    className="flex-col h-auto py-3 bg-green-600 hover:bg-green-500 gap-1"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-[10px] font-bold uppercase">Aprobar</span>
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 opacity-50" />
              </div>
              <p className="text-lg font-medium">Detalle de Solicitud</p>
              <p className="text-sm mt-2">
                Selecciona una solicitud de la lista para ver su evaluación completa.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const InfoRow = ({ label, value, highlight }) => (
  <div className="flex justify-between items-center text-sm">
    <span className="text-muted-foreground">{label}</span>
    <span className={cn("font-medium", highlight && "text-green-400")}>
      {value}
    </span>
  </div>
);

const DocPreviewRow = ({ name, verified }) => (
  <div className="flex items-center justify-between p-3 rounded-lg bg-muted border">
    <div className="flex items-center gap-3">
      <FileText className={cn("w-4 h-4", verified ? "text-primary" : "text-muted-foreground")} />
      <span className={cn("text-sm", verified ? "" : "text-muted-foreground")}>
        {name}
      </span>
    </div>
    {verified ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <Clock className="w-4 h-4 text-muted-foreground" />
    )}
  </div>
);

export default FinancialDashboard;
