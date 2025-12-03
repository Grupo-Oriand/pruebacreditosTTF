import React from 'react';
import { CheckCircle, FileText } from 'lucide-react';
import { StatusBadge } from '../../pages/dealer/DealerDashboard';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const OfferCard = ({ offer, requestId }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-muted p-4 rounded-lg border flex flex-col sm:flex-row justify-between items-center gap-4">
      <div className="w-full sm:w-auto">
        <p className="font-bold text-lg">{offer.bank}</p>
        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
          <span className="bg-background px-2 py-1 rounded border">
            Plazo: {offer.term}
          </span>
          <span className="bg-background px-2 py-1 rounded border">
            Tasa: {offer.rate}
          </span>
        </div>
      </div>
      <div className="text-right flex flex-col items-end gap-2 w-full sm:w-auto">
        <p className="font-bold text-xl">${offer.amount.toLocaleString()}</p>
        <Button
          onClick={() => navigate(`/client/approved/${requestId}`, { state: { offer } })}
          className="w-full sm:w-auto bg-green-600 hover:bg-green-500 gap-2"
          size="sm"
        >
          <CheckCircle className="w-3 h-3" />
          Proceder con esta oferta
        </Button>
      </div>
    </div>
  );
};

const RequestCard = ({ request, vehicle, offers }) => {
  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-xl font-bold">
                  {vehicle?.make} {vehicle?.model}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Solicitud #{request.id} • {new Date(request.date).toLocaleDateString()}
                </p>
              </div>
              <StatusBadge status={request.status} />
            </div>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-muted-foreground text-sm">Monto Solicitado:</span>
              <span className="text-primary font-bold text-lg">
                ${vehicle?.price.toLocaleString()}
              </span>
            </div>

            {/* Ofertas */}
            {offers.length > 0 ? (
              <div className="bg-muted/50 rounded-xl p-4 border">
                <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Ofertas Recibidas
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  {offers.map((offer, idx) => (
                    <OfferCard key={idx} offer={offer} requestId={request.id} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-muted/30 rounded-xl p-4 border text-center">
                <p className="text-muted-foreground text-sm">
                  {request.status === 'rejected'
                    ? 'No se recibieron ofertas para esta solicitud.'
                    : 'Esperando ofertas de las entidades financieras...'}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const EmptyState = () => (
  <Card className="p-12 text-center">
    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
      <FileText className="w-10 h-10 text-muted-foreground" />
    </div>
    <h3 className="text-xl font-bold mb-2">No hay solicitudes activas</h3>
    <p className="text-muted-foreground max-w-md mx-auto">
      Actualmente no tienes ninguna solicitud de crédito en proceso. Contacta a tu concesionario para iniciar una nueva solicitud.
    </p>
  </Card>
);

export const RequestsSection = ({ requests, vehicles }) => {
  if (requests.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="max-w-5xl space-y-6">
      {requests.map(request => {
        const vehicle = vehicles.find(v => v.id === request.vehicleId);
        const offers = request.status === 'approved' || request.status === 'conditioned' ? [
          { bank: 'PIVCA', rate: '1.2%', term: '60 meses', amount: vehicle?.price * 0.9 },
          { bank: 'FIVENCA', rate: '1.5%', term: '48 meses', amount: vehicle?.price },
          { bank: 'ARCA', rate: '1.8%', term: '36 meses', amount: vehicle?.price * 0.85 }
        ] : [];

        return (
          <RequestCard
            key={request.id}
            request={request}
            vehicle={vehicle}
            offers={offers}
          />
        );
      })}
    </div>
  );
};
