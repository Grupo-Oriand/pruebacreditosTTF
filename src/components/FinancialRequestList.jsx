import React from 'react';
import { Calendar, Filter } from 'lucide-react';
import { StatusBadge } from '../../pages/dealer/DealerDashboard';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const getFilterTitle = (filterStatus) => {
  const titles = {
    all: 'Todas las Solicitudes',
    pending_docs: 'Pendientes de Documentación',
    review: 'Solicitudes en Revisión',
    approved: 'Solicitudes Aprobadas',
    rejected: 'Solicitudes Rechazadas',
    conditioned: 'Solicitudes Condicionadas'
  };
  return titles[filterStatus] || 'Solicitudes';
};

export const RequestList = ({ requests, clients, vehicles, selectedRequest, onSelectRequest, filterStatus }) => {
  return (
    <div className="flex-1 bg-background overflow-y-auto p-6 border-r">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">
          {getFilterTitle(filterStatus)}
        </h2>
        <span className="bg-primary/20 text-primary text-sm font-bold px-3 py-1 rounded-full">
          {requests.length} solicitudes
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {requests.map(req => {
          const client = clients.find(c => c.id === req.clientId);
          const vehicle = vehicles.find(v => v.id === req.vehicleId);
          const isSelected = selectedRequest?.id === req.id;

          return (
            <Card
              key={req.id}
              onClick={() => onSelectRequest(req)}
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

      {requests.length === 0 && (
        <Card className="flex flex-col items-center justify-center h-96 border-dashed">
          <CardContent className="text-center pt-6">
            <Filter className="w-12 h-12 mb-4 opacity-20 mx-auto" />
            <p className="text-lg font-medium">No se encontraron solicitudes</p>
            <p className="text-sm text-muted-foreground">Intenta cambiar los filtros de búsqueda</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
