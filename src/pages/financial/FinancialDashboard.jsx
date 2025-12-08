import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Check, X, AlertTriangle, FileText, DollarSign, User, Calendar, LogOut, Filter, Clock, CheckCircle, XCircle, AlertCircle, Car, Eye } from 'lucide-react';
import { StatusBadge } from '../dealer/DealerDashboard';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { cn } from '@/lib/utils';
import { EvaluationModal } from '@/components/financial/EvaluationModal';

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
      // Optional: Close modal or move to next
      // setSelectedRequest(null); 
    }
  };

  const handleNext = () => {
    if (!selectedRequest) return;
    const currentIndex = poolRequests.findIndex(r => r.id === selectedRequest.id);
    if (currentIndex < poolRequests.length - 1) {
      setSelectedRequest(poolRequests[currentIndex + 1]);
    }
  };

  const handlePrev = () => {
    if (!selectedRequest) return;
    const currentIndex = poolRequests.findIndex(r => r.id === selectedRequest.id);
    if (currentIndex > 0) {
      setSelectedRequest(poolRequests[currentIndex - 1]);
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
                icon={<div className="w-4 h-4 rounded-full bg-yellow-500 border-2 border-yellow-200" />}
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
                          creditScore.score >= 60 ? "bg-yellow-500" :
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
                                creditScore.score >= 60 ? "text-yellow-600" :
                                  creditScore.score >= 40 ? "text-orange-600" :
                                    "text-red-600"
                            )}>{creditScore.score}</span>
                            <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                              <div className={cn("h-full rounded-full",
                                creditScore.score >= 80 ? "bg-green-500" :
                                  creditScore.score >= 60 ? "bg-yellow-500" :
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

      </main>

      <EvaluationModal
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        request={selectedRequest}
        client={selectedRequest ? clients.find(c => c.id === selectedRequest.clientId) : null}
        vehicle={selectedRequest ? vehicles.find(v => v.id === selectedRequest.vehicleId) : null}
        onNext={handleNext}
        onPrev={handlePrev}
        hasPrev={selectedRequest && poolRequests.findIndex(r => r.id === selectedRequest.id) > 0}
        hasNext={selectedRequest && poolRequests.findIndex(r => r.id === selectedRequest.id) < poolRequests.length - 1}
        onDecision={handleDecision}
      />
    </div>
  );
};



export default FinancialDashboard;
