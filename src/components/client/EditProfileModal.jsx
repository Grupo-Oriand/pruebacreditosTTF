import React from 'react';
import { Save } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export const EditProfileModal = ({ isOpen, onClose, editForm, setEditForm, onSave }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Perfil</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Datos Personales */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-primary uppercase tracking-wider border-b pb-2">
              Datos Personales
            </h4>
            
            <div className="space-y-2">
              <Label htmlFor="name">Nombre Completo</Label>
              <Input
                id="name"
                required
                value={editForm.name}
                onChange={e => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="birthDate">Fecha de Nacimiento</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={editForm.birthDate}
                  onChange={e => setEditForm({ ...editForm, birthDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="idNumber">Cédula / ID</Label>
                <Input
                  id="idNumber"
                  value={editForm.idNumber}
                  onChange={e => setEditForm({ ...editForm, idNumber: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Dirección</Label>
              <Input
                id="address"
                placeholder="Ej. Calle 123 #45-67"
                value={editForm.address}
                onChange={e => setEditForm({ ...editForm, address: e.target.value })}
              />
            </div>
          </div>

          {/* Información de Contacto */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-primary uppercase tracking-wider border-b pb-2">
              Información de Contacto
            </h4>
            
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                required
                value={editForm.email}
                onChange={e => setEditForm({ ...editForm, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                type="tel"
                value={editForm.phone}
                onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="gap-2">
              <Save className="w-4 h-4" />
              Guardar Cambios
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
