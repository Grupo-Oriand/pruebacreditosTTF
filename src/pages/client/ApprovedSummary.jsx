import React from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { CheckCircle, Download, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ApprovedSummary = () => {
  const { requests, vehicles, clients } = useApp();
  const { requestId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const request = requests.find(r => r.id === Number(requestId));
  const vehicle = vehicles.find(v => v.id === request?.vehicleId);
  const client = clients.find(c => c.id === request?.clientId);
  const offer = location.state?.offer || {};

  const generateSummary = () => {
    const content = `🎉 ¡Felicitaciones, ${client.name}! 🎉\n\n` +
      `Resumen del Crédito Aprobado\n` +
      `-----------------------------------\n` +
      `Cliente: ${client.name}\n` +
      `Vehículo: ${vehicle.make} ${vehicle.model} (${vehicle.year})\n` +
      `Monto Aprobado: $${offer.amount?.toLocaleString() || 'N/A'}\n` +
      `Banco: ${offer.bank || 'N/A'}\n` +
      `Tasa: ${offer.rate || 'N/A'}\n` +
      `Plazo: ${offer.term || 'N/A'}\n` +
      `\nDocumentos del Contrato:\n` +
      `- Identificación: ${request.documents.idCard ? '✅' : '❌'}\n` +
      `- Comprobante de Ingresos: ${request.documents.incomeProof ? '✅' : '❌'}\n` +
      `- Comprobante de Domicilio: ${request.documents.addressProof ? '✅' : '❌'}\n`;
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resumen_credito_${request.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!request || !vehicle || !client) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Solicitud no encontrada.</p>
          <Button onClick={() => navigate('/client')}>
            Volver
          </Button>
        </div>
      </div>
    );
  }

  const InfoItem = ({ label, value }) => (
    <li><strong>{label}:</strong> {value}</li>
  );

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <Card className="p-8 max-w-2xl w-full">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <CheckCircle className="w-8 h-8 text-green-500" />
          <h1 className="text-2xl font-bold">¡Felicitaciones, {client.name}!</h1>
        </div>
        <p className="text-muted-foreground mb-6">
          Tu solicitud de crédito ha sido aprobada. A continuación encontrarás el resumen del crédito y los documentos del contrato.
        </p>

        {/* Resumen del crédito */}
        <div className="bg-muted/50 p-6 rounded-lg border mb-6">
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Resumen del Crédito
          </h2>
          <ul className="space-y-2">
            <InfoItem label="Vehículo" value={`${vehicle.make} ${vehicle.model} (${vehicle.year})`} />
            <InfoItem label="Monto Aprobado" value={`$${offer.amount?.toLocaleString() || 'N/A'}`} />
            <InfoItem label="Banco" value={offer.bank || 'N/A'} />
            <InfoItem label="Tasa" value={offer.rate || 'N/A'} />
            <InfoItem label="Plazo" value={offer.term || 'N/A'} />
          </ul>
          <Button
            onClick={generateSummary}
            className="mt-4 gap-2"
            variant="outline"
          >
            <Download className="w-4 h-4" />
            Descargar Resumen
          </Button>
        </div>

        {/* Documentos del contrato */}
        <div className="bg-muted/50 p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Documentos del Contrato
          </h2>
          <ul className="space-y-2">
            <li>Identificación: {request.documents.idCard ? '✅' : '❌'}</li>
            <li>Comprobante de Ingresos: {request.documents.incomeProof ? '✅' : '❌'}</li>
            <li>Comprobante de Domicilio: {request.documents.addressProof ? '✅' : '❌'}</li>
          </ul>
        </div>

        <div className="mt-6 flex justify-end">
          <Button variant="outline" onClick={() => navigate('/client')}>
            Volver al Dashboard
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ApprovedSummary;
