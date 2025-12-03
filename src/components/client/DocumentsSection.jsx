import React from 'react';
import { FileStack, Clock, Upload, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { Progress } from '@/components/ui/progress';

const DocUploader = ({ title, description, isUploaded, onUpload }) => {
  const fileInputRef = React.useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Aquí se llamaría a la función de upload con el archivo
      onUpload(file);
    }
  };

  return (
    <div className={`p-4 rounded-xl border transition-all h-full flex flex-col justify-between ${isUploaded ? 'bg-green-500/5 border-green-500/20' : 'bg-card border-border'
      }`}>
      <div>
        <div className="flex items-center gap-2 mb-2">
          <h4 className={`font-semibold ${isUploaded ? 'text-green-500' : ''}`}>
            {title}
          </h4>
          {isUploaded && <CheckCircle className="w-4 h-4 text-green-500" />}
        </div>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
      </div>

      <div className="mt-auto">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileSelect}
          className="hidden"
        />
        {!isUploaded ? (
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            size="sm"
            className="w-full gap-2"
          >
            <Upload className="w-4 h-4" /> Subir Archivo
          </Button>
        ) : (
          <div className="pt-4 border-t border-green-500/10">
            <div className="text-center mb-3">
              <span className="inline-flex items-center gap-1 text-green-500 text-xs font-bold uppercase tracking-wider">
                <CheckCircle className="w-3 h-3" /> Cargado Exitosamente
              </span>
            </div>
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              size="sm"
              className="w-full gap-2 text-xs"
            >
              <Upload className="w-3 h-3" /> Reemplazar Archivo
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const EmptyState = () => (
  <Card className="p-12 text-center">
    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
      <FileStack className="w-10 h-10 text-muted-foreground" />
    </div>
    <h3 className="text-xl font-bold mb-2">No hay solicitudes activas</h3>
    <p className="text-muted-foreground max-w-md mx-auto">
      Actualmente no tienes ninguna solicitud de crédito en proceso.
    </p>
  </Card>
);

export const DocumentsSection = ({ activeRequest, uploadDocument }) => {
  if (!activeRequest) {
    return <EmptyState />;
  }

  const totalDocs = Object.keys(activeRequest.documents || {}).length;
  const uploadedDocs = Object.values(activeRequest.documents || {}).filter(Boolean).length;
  const progress = totalDocs > 0 ? (uploadedDocs / totalDocs) * 100 : 0;

  // Determinar el estado de la solicitud basado en documentos cargados
  const getRequestStatus = () => {
    if (uploadedDocs === 0) {
      return {
        label: 'Documentación Pendiente',
        description: 'Aún no has cargado ningún documento. Comienza subiendo tu documento de identidad.',
        color: 'red',
        icon: '📋'
      };
    } else if (uploadedDocs < totalDocs) {
      return {
        label: 'Documentación Incompleta',
        description: `Has cargado ${uploadedDocs} de ${totalDocs} documentos. Completa la documentación para continuar con la evaluación.`,
        color: 'orange',
        icon: '⏳'
      };
    } else {
      return {
        label: 'Documentación Completa',
        description: 'Todos los documentos han sido cargados. Tu solicitud está siendo evaluada por las entidades financieras.',
        color: 'green',
        icon: '✅'
      };
    }
  };

  const requestStatus = getRequestStatus();

  return (
    <div className="max-w-5xl space-y-6">
      {/* Progress Section */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <FileStack className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Estado de Documentación</h3>
              <p className="text-muted-foreground text-sm">Solicitud #{activeRequest.id}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm text-muted-foreground block">Progreso Total</span>
            <span className="text-2xl font-bold text-primary">{Math.round(progress)}%</span>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </Card>

      {/* Request Status Section */}
      <Card className={`p-6 border-l-4 ${requestStatus.color === 'green' ? 'border-l-green-500 bg-green-500/5' :
        requestStatus.color === 'orange' ? 'border-l-orange-500 bg-orange-500/5' :
          'border-l-red-500 bg-red-500/5'
        }`}>
        <div className="flex items-start gap-4">
          <div className="text-4xl">{requestStatus.icon}</div>
          <div className="flex-1">
            <h3 className={`text-lg font-bold mb-1 ${requestStatus.color === 'green' ? 'text-green-500' :
              requestStatus.color === 'orange' ? 'text-orange-500' :
                'text-red-500'
              }`}>
              {requestStatus.label}
            </h3>
            <p className="text-muted-foreground text-sm">
              {requestStatus.description}
            </p>
          </div>
        </div>
      </Card>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <DocUploader
          title="Documento de Identidad"
          description="Sube una foto clara de tu DNI o Pasaporte (Frente y Dorso)"
          isUploaded={activeRequest.documents.idCard}
          onUpload={(file) => uploadDocument(activeRequest.id, 'idCard', file)}
        />
        <DocUploader
          title="Comprobante de Ingresos"
          description="Últimos 3 recibos de sueldo o declaración de impuestos"
          isUploaded={activeRequest.documents.incomeProof}
          onUpload={(file) => uploadDocument(activeRequest.id, 'incomeProof', file)}
        />
        <DocUploader
          title="Comprobante de Domicilio"
          description="Factura de servicio (Luz, Agua, Gas) no mayor a 3 meses"
          isUploaded={activeRequest.documents.addressProof}
          onUpload={(file) => uploadDocument(activeRequest.id, 'addressProof', file)}
        />
        <DocUploader
          title="Proforma del Vehículo"
          description="Documento de cotización o proforma del vehículo a financiar"
          isUploaded={activeRequest.documents.vehicleProforma}
          onUpload={(file) => uploadDocument(activeRequest.id, 'vehicleProforma', file)}
        />
      </div>

      {activeRequest.status === 'review' && (
        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-start gap-3">
          <Clock className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-bold text-blue-400">Documentación Completa</h4>
            <p className="text-blue-300/80 text-sm mt-1">
              Hemos recibido todos tus documentos. La entidad financiera está evaluando tu solicitud.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
