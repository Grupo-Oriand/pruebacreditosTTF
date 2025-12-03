import React, { useState } from 'react';
import { X, User, Calendar, CreditCard, MapPin, Mail, Phone, Heart, Hash } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const CompleteRequestModal = ({ isOpen, onClose, request, vehicle, onSubmit }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        idType: 'V',
        idNumber: '',
        birthDate: '',
        maritalStatus: '',
        address: '',
        email: '',
        phone: ''
    });

    if (!isOpen || !request) return null;

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(request.id, formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold">Completar Datos de Solicitud</h2>
                            <p className="text-muted-foreground text-sm mt-1">
                                Solicitud #{request.id}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Nombres y Apellidos */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="firstName" className="flex items-center gap-2 mb-2">
                                    <User className="w-4 h-4" />
                                    Nombre
                                </Label>
                                <Input
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    placeholder="Ingresa tu nombre"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="lastName" className="flex items-center gap-2 mb-2">
                                    <User className="w-4 h-4" />
                                    Apellido
                                </Label>
                                <Input
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    placeholder="Ingresa tu apellido"
                                    required
                                />
                            </div>
                        </div>

                        {/* Tipo y Número de Identificación */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <Label htmlFor="idType" className="flex items-center gap-2 mb-2">
                                    <CreditCard className="w-4 h-4" />
                                    Tipo de ID
                                </Label>
                                <select
                                    id="idType"
                                    name="idType"
                                    value={formData.idType}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                                    required
                                >
                                    <option value="V">V - Venezolano</option>
                                    <option value="E">E - Extranjero</option>
                                    <option value="P">P - Pasaporte</option>
                                    <option value="J">J - Jurídico</option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <Label htmlFor="idNumber" className="flex items-center gap-2 mb-2">
                                    <Hash className="w-4 h-4" />
                                    Número de Identificación
                                </Label>
                                <Input
                                    id="idNumber"
                                    name="idNumber"
                                    value={formData.idNumber}
                                    onChange={handleChange}
                                    placeholder="Ej: 12345678"
                                    required
                                />
                            </div>
                        </div>

                        {/* Fecha de Nacimiento y Estado Civil */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="birthDate" className="flex items-center gap-2 mb-2">
                                    <Calendar className="w-4 h-4" />
                                    Fecha de Nacimiento
                                </Label>
                                <Input
                                    id="birthDate"
                                    name="birthDate"
                                    type="date"
                                    value={formData.birthDate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="maritalStatus" className="flex items-center gap-2 mb-2">
                                    <Heart className="w-4 h-4" />
                                    Estado Civil
                                </Label>
                                <select
                                    id="maritalStatus"
                                    name="maritalStatus"
                                    value={formData.maritalStatus}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                                    required
                                >
                                    <option value="">Selecciona...</option>
                                    <option value="soltero">Soltero/a</option>
                                    <option value="casado">Casado/a</option>
                                    <option value="divorciado">Divorciado/a</option>
                                    <option value="viudo">Viudo/a</option>
                                    <option value="union_libre">Unión Libre</option>
                                </select>
                            </div>
                        </div>

                        {/* Dirección */}
                        <div>
                            <Label htmlFor="address" className="flex items-center gap-2 mb-2">
                                <MapPin className="w-4 h-4" />
                                Dirección de Residencia
                            </Label>
                            <Input
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Calle, Avenida, Urbanización, Ciudad"
                                required
                            />
                        </div>

                        {/* Correo y Teléfono */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="email" className="flex items-center gap-2 mb-2">
                                    <Mail className="w-4 h-4" />
                                    Correo Electrónico
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="ejemplo@correo.com"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="phone" className="flex items-center gap-2 mb-2">
                                    <Phone className="w-4 h-4" />
                                    Número de Teléfono
                                </Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+58 412 123 4567"
                                    required
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-4 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                className="flex-1"
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1 bg-primary hover:bg-primary/90"
                            >
                                Guardar y Continuar
                            </Button>
                        </div>
                    </form>
                </div>
            </Card>
        </div>
    );
};
