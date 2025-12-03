import React from 'react';
import { User, Phone, Calendar, MapPin, CreditCard, Mail, Edit2 } from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const InfoField = ({ icon, label, value }) => (
  <div className="space-y-1">
    <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1">
      {icon && React.cloneElement(icon, { className: 'w-3 h-3' })}
      {label}
    </label>
    <p className="text-lg font-medium">{value || 'No registrada'}</p>
  </div>
);

export const ProfileSection = ({ client, onEdit }) => {
  return (
    <div className="max-w-4xl space-y-6">
      {/* Datos Personales */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
          <CardTitle className="flex items-center gap-2">
            <User className="text-primary w-5 h-5" />
            Datos Personales
          </CardTitle>
          <Button
            onClick={onEdit}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Edit2 className="w-4 h-4" />
            Editar
          </Button>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <InfoField label="Nombre Completo" value={client.name} />
          <InfoField 
            icon={<Calendar />} 
            label="Fecha de Nacimiento" 
            value={client.birthDate} 
          />
          <InfoField 
            icon={<CreditCard />} 
            label="Cédula de Identidad" 
            value={client.idNumber} 
          />
          <InfoField 
            icon={<MapPin />} 
            label="Dirección" 
            value={client.address} 
          />
        </CardContent>
      </Card>

      {/* Información de Contacto */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
          <CardTitle className="flex items-center gap-2">
            <Phone className="text-primary w-5 h-5" />
            Información de Contacto
          </CardTitle>
          <Button
            onClick={onEdit}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Edit2 className="w-4 h-4" />
            Editar
          </Button>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <InfoField 
            icon={<Mail />} 
            label="Correo Electrónico" 
            value={client.email} 
          />
          <InfoField 
            icon={<Phone />} 
            label="Teléfono" 
            value={client.phone} 
          />
        </CardContent>
      </Card>
    </div>
  );
};
