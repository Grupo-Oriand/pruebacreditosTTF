import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Check, X, AlertTriangle, FileText, DollarSign, User, Calendar, LogOut, Filter, Clock, CheckCircle, XCircle, AlertCircle, Car, Eye } from 'lucide-react';
import { StatusBadge } from '../dealer/DealerDashboard';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const FinancialDashboard = () => {
  const { user, requests, clients, vehicles, updateRequestStatus, logout } = useApp();
  const navigate = useNavigate();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Función para calcular Credit Score
  const calculateCreditScore = (request, client, vehicle) => {
    let score = 0;
    const breakdown = {
      profileVehicleMatch: 0,
      informationQuality: 0,
      dataCompleteness: 0
    };

    // 1. Relación entre perfil del cliente y el vehículo (35 puntos)
    if (client && vehicle) {
      // Verificar si tiene información financiera básica
      if (client.monthlyIncome && vehicle.price) {
        const incomeToPrice = client.monthlyIncome / vehicle.price;
        if (incomeToPrice >= 0.15) breakdown.profileVehicleMatch += 15; // Buen ratio ingreso/precio
        else if (incomeToPrice >= 0.10) breakdown.profileVehicleMatch += 10;
        else if (incomeToPrice >= 0.05) breakdown.profileVehicleMatch += 5;
      }

      // Verificar años de empleo
      if (client.employmentYears) {
        if (client.employmentYears >= 5) breakdown.profileVehicleMatch += 10;
        else if (client.employmentYears >= 2) breakdown.profileVehicleMatch += 7;
        else if (client.employmentYears >= 1) breakdown.profileVehicleMatch += 4;
      }

      // Verificar edad del cliente vs precio del vehículo
      if (client.birthDate) {
        const age = new Date().getFullYear() - new Date(client.birthDate).getFullYear();
        if (age >= 25 && age <= 60) breakdown.profileVehicleMatch += 10;
        else if (age >= 21 && age < 25) breakdown.profileVehicleMatch += 5;
      }
    }

    // 2. Calidad de la información cargada (35 puntos)
    if (client) {
      // Información personal completa
      const personalFields = ['firstName', 'lastName', 'idNumber', 'birthDate', 'email', 'phone', 'address'];
      const completedPersonal = personalFields.filter(field => client[field] && client[field] !== '').length;
      breakdown.informationQuality += Math.round((completedPersonal / personalFields.length) * 15);

      // Información financiera completa
      const financialFields = ['occupation', 'monthlyIncome', 'employmentYears'];
      const completedFinancial = financialFields.filter(field => client[field] && client[field] !== '').length;
      breakdown.informationQuality += Math.round((completedFinancial / financialFields.length) * 10);

      // Estado civil definido
      if (client.maritalStatus) breakdown.informationQuality += 5;

      // Tipo de ID válido
      if (client.idType) breakdown.informationQuality += 5;
    }

    // 3. Cantidad de información cargada - Documentos (30 puntos)
    if (request.documents) {
      const totalDocs = Object.keys(request.documents).length;
      const uploadedDocs = Object.values(request.documents).filter(Boolean).length;
      breakdown.dataCompleteness = Math.round((uploadedDocs / totalDocs) * 30);
    }

    // Calcular score total
    score = breakdown.profileVehicleMatch + breakdown.informationQuality + breakdown.dataCompleteness;

    return {
      score: Math.min(score, 100), // Máximo 100
      breakdown,
      rating: score >= 80 ? 'Excelente' : score >= 60 ? 'Bueno' : score >= 40 ? 'Regular' : 'Bajo'
    };
  };

  const poolRequests = requests.filter(r => {
    if (filterStatus === 'all') return true;

    if (['score_high', 'score_medium', 'score_low'].includes(filterStatus)) {
      const client = clients.find(c => c.id === r.clientId);
      const vehicle = vehicles.find(v => v.id === r.vehicleId);
      const { score } = calculateCreditScore(r, client, vehicle);

      if (filterStatus === 'score_high') return score >= 80;
      if (filterStatus === 'score_medium') return score >= 40 && score < 80;
      if (filterStatus === 'score_low') return score < 40;
    }

    return r.status === filterStatus;
  });

  const getScoreCount = (min, max) => requests.filter(r => {
    const client = clients.find(c => c.id === r.clientId);
    const vehicle = vehicles.find(v => v.id === r.vehicleId);
    const { score } = calculateCreditScore(r, client, vehicle);
    return score >= min && score <= max;
  }).length;

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
            <h1 className="text-xl font-bold">Portal Financiero {user?.companyName ? `- ${user.companyName}` : ''}</h1>
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



          {/* Credit Score Filters */}
          <div>
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 px-1">
              Credit Score
            </h3>
            <div className="space-y-1">
              <FilterButton
                status="score_high"
                icon={<div className="w-4 h-4 rounded-full bg-green-500 border-2 border-green-200" />}
                label="Alto (80-100)"
                count={getScoreCount(80, 100)}
              />
              <FilterButton
                status="score_medium"
                icon={<div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-blue-200" />}
                label="Medio (40-79)"
                count={getScoreCount(40, 79)}
              />
              <FilterButton
                status="score_low"
                icon={<div className="w-4 h-4 rounded-full bg-red-500 border-2 border-red-200" />}
                label="Bajo (0-39)"
                count={getScoreCount(0, 39)}
              />
            </div>
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
                      filterStatus === 'rejected' ? 'Solicitudes Rechazadas' :
                        filterStatus === 'conditioned' ? 'Solicitudes Condicionadas' :
                          filterStatus === 'score_high' ? 'Credit Score Alto' :
                            filterStatus === 'score_medium' ? 'Credit Score Medio' :
                              filterStatus === 'score_low' ? 'Credit Score Bajo' : ''}
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
              const creditScore = calculateCreditScore(req, client, vehicle);

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
                  <CardContent className="p-3">
                    <div className="flex items-center gap-4">
                      {/* Status Indicator Strip */}
                      <div className={cn(
                        "w-1.5 self-stretch rounded-full",
                        creditScore.score >= 80 ? "bg-green-500" :
                          creditScore.score >= 60 ? "bg-blue-500" :
                            creditScore.score >= 40 ? "bg-orange-500" :
                              "bg-red-500"
                      )} />

                      {/* Main Info Area */}
                      <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm truncate">{client?.name}</span>
                            <span className="text-[10px] text-muted-foreground px-1.5 py-0.5 bg-muted rounded border font-mono">#{req.id}</span>
                          </div>
                          <span className="text-[10px] text-muted-foreground">{new Date(req.date).toLocaleDateString()}</span>
                        </div>

                        <div className="flex items-center justify-between gap-4">
                          <span className="text-xs text-muted-foreground truncate">
                            {vehicle?.make} {vehicle?.model} • ${vehicle?.price?.toLocaleString()}
                          </span>

                          {/* Compact Score */}
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-[10px] font-medium text-muted-foreground">Score:</span>
                            <span className={cn("text-xs font-bold",
                              creditScore.score >= 80 ? "text-green-600" :
                                creditScore.score >= 60 ? "text-blue-600" :
                                  creditScore.score >= 40 ? "text-orange-600" :
                                    "text-red-600"
                            )}>{creditScore.score}</span>
                            <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                              <div className={cn("h-full rounded-full",
                                creditScore.score >= 80 ? "bg-green-500" :
                                  creditScore.score >= 60 ? "bg-blue-500" :
                                    creditScore.score >= 40 ? "bg-orange-500" :
                                      "bg-red-500"
                              )} style={{ width: `${creditScore.score}%` }} />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="flex-shrink-0">
                        <StatusBadge status={req.status} />
                      </div>
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

              {/* Credit Score Breakdown */}
              {(() => {
                const client = clients.find(c => c.id === selectedRequest.clientId);
                const vehicle = vehicles.find(v => v.id === selectedRequest.vehicleId);
                const creditScore = calculateCreditScore(selectedRequest, client, vehicle);

                return (
                  <Card className={cn(
                    "border-l-4",
                    creditScore.score >= 80 ? "border-l-green-500 bg-green-500/5" :
                      creditScore.score >= 60 ? "border-l-blue-500 bg-blue-500/5" :
                        creditScore.score >= 40 ? "border-l-orange-500 bg-orange-500/5" :
                          "border-l-red-500 bg-red-500/5"
                  )}>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center justify-between uppercase tracking-wider">
                        <span className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-primary" />
                          Credit Score
                        </span>
                        <span className={cn(
                          "text-2xl font-bold",
                          creditScore.score >= 80 ? "text-green-500" :
                            creditScore.score >= 60 ? "text-blue-500" :
                              creditScore.score >= 40 ? "text-orange-500" :
                                "text-red-500"
                        )}>
                          {creditScore.score}/100
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Calificación</span>
                          <span className={cn(
                            "font-bold",
                            creditScore.score >= 80 ? "text-green-500" :
                              creditScore.score >= 60 ? "text-blue-500" :
                                creditScore.score >= 40 ? "text-orange-500" :
                                  "text-red-500"
                          )}>
                            {creditScore.rating}
                          </span>
                        </div>
                        <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full transition-all",
                              creditScore.score >= 80 ? "bg-green-500" :
                                creditScore.score >= 60 ? "bg-blue-500" :
                                  creditScore.score >= 40 ? "bg-orange-500" :
                                    "bg-red-500"
                            )}
                            style={{ width: `${creditScore.score}%` }}
                          />
                        </div>
                      </div>

                      <div className="space-y-2 pt-2 border-t">
                        <p className="text-xs font-bold text-muted-foreground uppercase">Desglose</p>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Perfil vs Vehículo</span>
                            <span className="font-medium">{creditScore.breakdown.profileVehicleMatch}/35</span>
                          </div>
                          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all"
                              style={{ width: `${(creditScore.breakdown.profileVehicleMatch / 35) * 100}%` }}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Calidad de Información</span>
                            <span className="font-medium">{creditScore.breakdown.informationQuality}/35</span>
                          </div>
                          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all"
                              style={{ width: `${(creditScore.breakdown.informationQuality / 35) * 100}%` }}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Documentos Cargados</span>
                            <span className="font-medium">{creditScore.breakdown.dataCompleteness}/30</span>
                          </div>
                          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all"
                              style={{ width: `${(creditScore.breakdown.dataCompleteness / 30) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })()}

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
                  <DocPreviewRow
                    name="DNI / Pasaporte"
                    verified={selectedRequest.documents?.idCard}
                    onView={() => window.open(selectedRequest.documentUrls?.idCard || 'https://placehold.co/600x400/png?text=DNI+Documento', '_blank')}
                  />
                  <DocPreviewRow
                    name="Recibos de Sueldo"
                    verified={selectedRequest.documents?.incomeProof}
                    onView={() => window.open(selectedRequest.documentUrls?.incomeProof || 'https://placehold.co/600x800/png?text=Recibo+de+Sueldo', '_blank')}
                  />
                  <DocPreviewRow
                    name="Comp. Domicilio"
                    verified={selectedRequest.documents?.addressProof}
                    onView={() => window.open(selectedRequest.documentUrls?.addressProof || 'https://placehold.co/600x800/png?text=Comprobante+Domicilio', '_blank')}
                  />
                  <DocPreviewRow
                    name="Proforma Vehículo"
                    verified={selectedRequest.documents?.vehicleProforma}
                    onView={() => window.open(selectedRequest.documentUrls?.vehicleProforma || 'https://placehold.co/600x800/png?text=Proforma+Vehiculo', '_blank')}
                  />
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

const DocPreviewRow = ({ name, verified, onView }) => (
  <div className="flex items-center justify-between p-3 rounded-lg bg-muted border">
    <div className="flex items-center gap-3">
      <FileText className={cn("w-4 h-4", verified ? "text-primary" : "text-muted-foreground")} />
      <span className={cn("text-sm", verified ? "" : "text-muted-foreground")}>
        {name}
      </span>
    </div>
    <div className="flex items-center gap-2">
      {verified ? (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 hover:bg-primary/10 hover:text-primary"
            onClick={onView}
            title="Ver documento"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <CheckCircle className="w-4 h-4 text-green-500" />
        </>
      ) : (
        <Clock className="w-4 h-4 text-muted-foreground" />
      )}
    </div>
  </div>
);

export default FinancialDashboard;
