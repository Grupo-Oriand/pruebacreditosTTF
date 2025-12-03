import React from 'react';
import { FileStack, Clock, Upload, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const DocUploader = ({ title, description, isUploaded, onUpload }) => (
  <div className={`p-4 rounded-xl border transition-all ${
    isUploaded ? 'bg-green-500/5 border-green-500/20' : 'bg-card border-border'
  }`}>
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h4 className={`font-semibold ${isUploaded ? 'text-green-500' : ''}`}>
            {title}
          </h4>
          {isUploaded && <CheckCircle className="w-4 h-4 text-green-500" />}
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      {!isUploaded ? (
        <Button 
          onClick={onUpload} 
          variant="outline"
          size="sm"
          className="ml-4 gap-2"
        >
          <Upload className="w-4 h-4" /> Subir
        </Button>
      ) : (
        <span className="ml-4 px-3 py-1 bg-green-500/10 text-green-500 text-xs font-bold rounded-full uppercase tracking-wider">
          Cargado
        </span>
      )}
    </div>
  </div>
);

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

  return (
    <div className="max-w-3xl">
      <Card className="p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <FileStack className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Documentación Requerida</h3>
            <p className="text-muted-foreground text-sm">Solicitud #{activeRequest.id}</p>
          </div>
        </div>

        <div className="space-y-4">
          <DocUploader
            title="Documento de Identidad"
            description="Sube una foto clara de tu DNI o Pasaporte (Frente y Dorso)"
            isUploaded={activeRequest.documents.idCard}
            onUpload={() => uploadDocument(activeRequest.id, 'idCard')}
          />
          <DocUploader
            title="Comprobante de Ingresos"
            description="Últimos 3 recibos de sueldo o declaración de impuestos"
            isUploaded={activeRequest.documents.incomeProof}
            onUpload={() => uploadDocument(activeRequest.id, 'incomeProof')}
          />
          <DocUploader
            title="Comprobante de Domicilio"
            description="Factura de servicio (Luz, Agua, Gas) no mayor a 3 meses"
            isUploaded={activeRequest.documents.addressProof}
            onUpload={() => uploadDocument(activeRequest.id, 'addressProof')}
          />
        </div>

        {activeRequest.status === 'review' && (
          <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-start gap-3">
            <Clock className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-blue-400">Documentación Completa</h4>
              <p className="text-blue-300/80 text-sm mt-1">
                Hemos recibido todos tus documentos. La entidad financiera está evaluando tu solicitud.
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
