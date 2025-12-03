import React from 'react';
import { Filter, Clock, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const FilterButton = ({ status, icon, label, count, description, activeFilter, onClick }) => (
  <Button
    variant="ghost"
    onClick={onClick}
    className={cn(
      "w-full justify-start gap-3 h-auto p-3",
      activeFilter === status && "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
    )}
  >
    <div className={cn(
      "p-2 rounded-lg",
      activeFilter === status ? "bg-primary-foreground/20" : "bg-muted"
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
        activeFilter === status ? "bg-primary-foreground/20" : "bg-muted"
      )}>
        {count}
      </span>
    )}
  </Button>
);

const GridFilterButton = ({ status, icon, label, count, colorClass, activeFilter, onClick }) => (
  <Button
    variant="outline"
    onClick={onClick}
    className={cn(
      "flex flex-col items-center justify-center h-auto p-3",
      activeFilter === status && `bg-${colorClass}-500/20 border-${colorClass}-500 text-${colorClass}-400 hover:bg-${colorClass}-500/30`
    )}
  >
    <div className="mb-2">{icon}</div>
    <span className="text-[10px] font-bold uppercase tracking-wider text-center leading-tight">
      {label}
    </span>
    <span className="mt-1 text-xs font-bold">{count}</span>
  </Button>
);

export const FinancialSidebar = ({ filterStatus, setFilterStatus, requests }) => {
  const getCount = (status) => requests.filter(r => r.status === status).length;

  return (
    <div className="w-72 border-r bg-card flex flex-col py-6 px-4 gap-6 flex-shrink-0 overflow-y-auto">
      {/* General View */}
      <div>
        <FilterButton
          status="all"
          icon={<Filter className="w-5 h-5" />}
          label="Todas las Solicitudes"
          description="Vista general del pipeline"
          count={requests.length}
          activeFilter={filterStatus}
          onClick={() => setFilterStatus('all')}
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
            activeFilter={filterStatus}
            onClick={() => setFilterStatus('pending_docs')}
          />
          <GridFilterButton
            status="review"
            icon={<FileText className="w-6 h-6" />}
            label="Revisión"
            count={getCount('review')}
            colorClass="purple"
            activeFilter={filterStatus}
            onClick={() => setFilterStatus('review')}
          />
          <GridFilterButton
            status="approved"
            icon={<CheckCircle className="w-6 h-6" />}
            label="Aprobadas"
            count={getCount('approved')}
            colorClass="green"
            activeFilter={filterStatus}
            onClick={() => setFilterStatus('approved')}
          />
          <GridFilterButton
            status="rejected"
            icon={<XCircle className="w-6 h-6" />}
            label="Rechazadas"
            count={getCount('rejected')}
            colorClass="red"
            activeFilter={filterStatus}
            onClick={() => setFilterStatus('rejected')}
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
          activeFilter={filterStatus}
          onClick={() => setFilterStatus('conditioned')}
        />
      </div>
    </div>
  );
};
