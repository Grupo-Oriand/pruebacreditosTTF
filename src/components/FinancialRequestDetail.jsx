import React from 'react';
import { X, User, Car, FileText, AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

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

export const RequestDetail = ({ request, clients, vehicles, onClose, onDecision }) => {
  if (!request) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 opacity-50" />
        </div>
        <p className="text-lg font-medium">Detalle de Solicitud</p>
        <p className="text-sm mt-2">
          Selecciona una solicitud de la lista para ver su evaluación completa.
        </p>
      </div>
    );
  }

  const client = clients.find(c => c.id === request.clientId);
  const vehicle = vehicles.find(v => v.id === request.vehicleId);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">Evaluación</h2>
          <p className="text-muted-foreground text-sm">Solicitud #{request.id}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
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
          <InfoRow label="Nombre" value={client?.name} />
          <InfoRow label="Email" value={client?.email} />
          <InfoRow label="Teléfono" value={client?.phone} />
          <InfoRow label="ID" value={client?.idNumber || 'N/A'} />
          <div className="pt-2 border-t">
            <InfoRow label="Score (Sim)" value="750" highlight />
          </div>
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
          <div className="aspect-video rounded-lg overflow-hidden mb-3">
            <img src={vehicle?.image} alt="Car" className="w-full h-full object-cover" />
          </div>
          <InfoRow label="Marca" value={vehicle?.make} />
          <InfoRow label="Modelo" value={vehicle?.model} />
          <InfoRow label="Año" value={vehicle?.year} />
          <InfoRow label="Precio" value={`$${vehicle?.price.toLocaleString()}`} />
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
          <DocPreviewRow name="DNI / Pasaporte" verified={request.documents?.idCard} />
          <DocPreviewRow name="Recibos de Sueldo" verified={request.documents?.incomeProof} />
          <DocPreviewRow name="Comp. Domicilio" verified={request.documents?.addressProof} />
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
            onClick={() => onDecision('rejected')}
            className="flex-col h-auto py-3 border-red-500/30 text-red-400 hover:bg-red-500/10 gap-1"
          >
            <XCircle className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase">Rechazar</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => onDecision('review')}
            className="flex-col h-auto py-3 border-orange-500/30 text-orange-400 hover:bg-orange-500/10 gap-1"
          >
            <AlertTriangle className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase">En Revisión</span>
          </Button>

          <Button
            onClick={() => onDecision('approved')}
            className="flex-col h-auto py-3 bg-green-600 hover:bg-green-500 gap-1"
          >
            <CheckCircle className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase">Aprobar</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
