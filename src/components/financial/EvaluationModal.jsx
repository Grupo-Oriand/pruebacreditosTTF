import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, User, Car, FileText, DollarSign, CheckCircle, XCircle, AlertTriangle, Eye, Clock, ChevronDown, ChevronUp, HelpCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export const EvaluationModal = ({
    isOpen,
    onClose,
    request,
    client,
    vehicle,
    onNext,
    onPrev,
    hasPrev,
    hasNext,
    onDecision
}) => {
    const [activeTab, setActiveTab] = useState('summary');

    if (!isOpen || !request) return null;

    // Reusing the calculation logic locally for the modal view
    const calculateCreditScore = () => {
        let score = 0;
        const breakdown = {
            profileVehicleMatch: 0,
            informationQuality: 0,
            dataCompleteness: 0
        };

        if (client && vehicle) {
            if (client.monthlyIncome && vehicle.price) {
                const incomeToPrice = client.monthlyIncome / vehicle.price;
                if (incomeToPrice >= 0.15) breakdown.profileVehicleMatch += 15;
                else if (incomeToPrice >= 0.10) breakdown.profileVehicleMatch += 10;
                else if (incomeToPrice >= 0.05) breakdown.profileVehicleMatch += 5;
            }
            if (client.employmentYears) {
                if (client.employmentYears >= 5) breakdown.profileVehicleMatch += 10;
                else if (client.employmentYears >= 2) breakdown.profileVehicleMatch += 7;
                else if (client.employmentYears >= 1) breakdown.profileVehicleMatch += 4;
            }
            if (client.birthDate) {
                const age = new Date().getFullYear() - new Date(client.birthDate).getFullYear();
                if (age >= 25 && age <= 60) breakdown.profileVehicleMatch += 10;
                else if (age >= 21 && age < 25) breakdown.profileVehicleMatch += 5;
            }
        }

        if (client) {
            const personalFields = ['firstName', 'lastName', 'idNumber', 'birthDate', 'email', 'phone', 'address'];
            const completedPersonal = personalFields.filter(field => client[field] && client[field] !== '').length;
            breakdown.informationQuality += Math.round((completedPersonal / personalFields.length) * 15);

            const financialFields = ['occupation', 'monthlyIncome', 'employmentYears'];
            const completedFinancial = financialFields.filter(field => client[field] && client[field] !== '').length;
            breakdown.informationQuality += Math.round((completedFinancial / financialFields.length) * 10);

            if (client.maritalStatus) breakdown.informationQuality += 5;
            if (client.idType) breakdown.informationQuality += 5;
        }

        if (request.documents) {
            const totalDocs = Object.keys(request.documents).length;
            const uploadedDocs = Object.values(request.documents).filter(Boolean).length;
            breakdown.dataCompleteness = Math.round((uploadedDocs / totalDocs) * 30);
        }

        score = breakdown.profileVehicleMatch + breakdown.informationQuality + breakdown.dataCompleteness;

        return {
            score: Math.min(score, 100),
            breakdown,
            rating: score >= 80 ? 'Excelente' : score >= 60 ? 'Bueno' : score >= 40 ? 'Regular' : 'Bajo'
        };
    };

    const creditScore = calculateCreditScore();

    const TabButton = ({ id, label, icon }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                activeTab === id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
            )}
        >
            {icon}
            {label}
        </button>
    );

    const InfoRow = ({ label, value, highlight }) => (
        <div className="flex justify-between items-center text-sm py-2 border-b border-border/50 last:border-0">
            <span className="text-muted-foreground">{label}</span>
            <span className={cn("font-medium", highlight && "text-green-600")}>
                {value || 'N/A'}
            </span>
        </div>
    );

    const DocPreviewRow = ({ name, verified, url }) => (
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-center gap-3">
                <FileText className={cn("w-4 h-4", verified ? "text-primary" : "text-muted-foreground")} />
                <span className={cn("text-sm", verified ? "text-foreground" : "text-muted-foreground")}>
                    {name}
                </span>
            </div>
            <div className="flex items-center gap-2">
                {verified ? (
                    <>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                            onClick={() => window.open(url, '_blank')}
                            title="Ver documento"
                        >
                            <Eye className="w-4 h-4" />
                        </Button>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                    </>
                ) : (
                    <Clock className="w-4 h-4 text-muted-foreground" />
                )}
            </div>
        </div>
    );

    const CollapsibleSection = ({ title, icon, children, defaultOpen = false }) => {
        const [isOpen, setIsOpen] = useState(defaultOpen);
        return (
            <Card>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                >
                    <div className="flex items-center gap-2 font-medium">
                        {icon}
                        {title}
                    </div>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </button>
                {isOpen && (
                    <CardContent className="pt-0 pb-4 px-4 border-t">
                        <div className="pt-4">
                            {children}
                        </div>
                    </CardContent>
                )}
            </Card>
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            {/* Navigation Arrows */}
            {hasPrev && (
                <button
                    onClick={onPrev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-background/80 text-foreground hover:bg-background shadow-lg transition-all hover:scale-110 z-50"
                >
                    <ChevronLeft className="w-8 h-8" />
                </button>
            )}

            {hasNext && (
                <button
                    onClick={onNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-background/80 text-foreground hover:bg-background shadow-lg transition-all hover:scale-110 z-50"
                >
                    <ChevronRight className="w-8 h-8" />
                </button>
            )}

            {/* Modal Content */}
            <div className="bg-background w-full max-w-4xl h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-border">
                {/* Header */}
                <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-card">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            Solicitud #{request.id}
                            <span className={cn(
                                "px-2 py-0.5 rounded-full text-xs font-medium",
                                request.status === 'approved' ? "bg-green-500/20 text-green-600" :
                                    request.status === 'rejected' ? "bg-red-500/20 text-red-600" :
                                        request.status === 'review' ? "bg-blue-500/20 text-blue-600" :
                                            "bg-muted text-muted-foreground"
                            )}>
                                {request.status.toUpperCase()}
                            </span>
                        </h2>
                        <p className="text-sm text-muted-foreground">{client?.name} • {new Date(request.date).toLocaleDateString()}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Tabs */}
                <div className="flex px-6 border-b border-border bg-card/50">
                    <TabButton id="summary" label="Resumen" icon={<DollarSign className="w-4 h-4" />} />
                    <TabButton id="client" label="Cliente" icon={<User className="w-4 h-4" />} />
                    <TabButton id="vehicle" label="Vehículo" icon={<Car className="w-4 h-4" />} />
                    <TabButton id="documents" label="Documentos" icon={<FileText className="w-4 h-4" />} />
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 bg-muted/10">
                    {activeTab === 'summary' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Credit Score Card */}
                                <Card className={cn(
                                    "border-l-4",
                                    creditScore.score >= 80 ? "border-l-green-500" :
                                        creditScore.score >= 60 ? "border-l-yellow-500" :
                                            creditScore.score >= 40 ? "border-l-orange-500" :
                                                "border-l-red-500"
                                )}>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Credit Score</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-end gap-2 mb-4">
                                            <span className={cn(
                                                "text-4xl font-bold",
                                                creditScore.score >= 80 ? "text-green-600" :
                                                    creditScore.score >= 60 ? "text-yellow-600" :
                                                        creditScore.score >= 40 ? "text-orange-600" :
                                                            "text-red-600"
                                            )}>
                                                {creditScore.score}
                                            </span>
                                            <span className="text-muted-foreground mb-1">/ 100</span>
                                            <span className={cn(
                                                "ml-auto px-3 py-1 rounded-full text-xs font-bold",
                                                creditScore.score >= 80 ? "bg-green-100 text-green-700" :
                                                    creditScore.score >= 60 ? "bg-yellow-100 text-yellow-700" :
                                                        creditScore.score >= 40 ? "bg-orange-100 text-orange-700" :
                                                            "bg-red-100 text-red-700"
                                            )}>
                                                {creditScore.rating}
                                            </span>
                                        </div>

                                        <div className="space-y-3">
                                            <div>
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span>Perfil vs Vehículo</span>
                                                    <span>{creditScore.breakdown.profileVehicleMatch}/35</span>
                                                </div>
                                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                                    <div className="h-full bg-primary" style={{ width: `${(creditScore.breakdown.profileVehicleMatch / 35) * 100}%` }} />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span>Calidad Información</span>
                                                    <span>{creditScore.breakdown.informationQuality}/35</span>
                                                </div>
                                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                                    <div className="h-full bg-primary" style={{ width: `${(creditScore.breakdown.informationQuality / 35) * 100}%` }} />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span>Documentación</span>
                                                    <span>{creditScore.breakdown.dataCompleteness}/30</span>
                                                </div>
                                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                                    <div className="h-full bg-primary" style={{ width: `${(creditScore.breakdown.dataCompleteness / 30) * 100}%` }} />
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Quick Stats */}
                                <div className="space-y-4">
                                    <Card>
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-sm font-medium text-muted-foreground">Capacidad de Pago</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold text-foreground">
                                                {((client?.monthlyIncome / vehicle?.price) * 100).toFixed(1)}%
                                            </div>
                                            <p className="text-xs text-muted-foreground">Relación Ingreso / Precio Vehículo</p>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-sm font-medium text-muted-foreground">Estabilidad Laboral</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold text-foreground">
                                                {client?.employmentYears || 0} Años
                                            </div>
                                            <p className="text-xs text-muted-foreground">Tiempo en empleo actual</p>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>

                            {/* Additional Info Sections */}
                            <div className="space-y-4">
                                <CollapsibleSection
                                    title="Especificaciones del Crédito"
                                    icon={<Info className="w-4 h-4 text-primary" />}
                                >
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <span className="text-xs text-muted-foreground">Monto a Financiar (Est.)</span>
                                            <p className="font-medium">${(vehicle?.price * 0.8).toLocaleString()}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-xs text-muted-foreground">Tasa de Interés (Ref.)</span>
                                            <p className="font-medium">12% - 16% E.A.</p>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-xs text-muted-foreground">Plazo Estimado</span>
                                            <p className="font-medium">48 - 60 Meses</p>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-xs text-muted-foreground">Cuota Inicial Mínima</span>
                                            <p className="font-medium">20% (${(vehicle?.price * 0.2).toLocaleString()})</p>
                                        </div>
                                    </div>
                                </CollapsibleSection>

                                <CollapsibleSection
                                    title="Preguntas Frecuentes"
                                    icon={<HelpCircle className="w-4 h-4 text-primary" />}
                                >
                                    <div className="space-y-3">
                                        <div>
                                            <h4 className="text-sm font-medium mb-1">¿Qué documentos adicionales se pueden requerir?</h4>
                                            <p className="text-xs text-muted-foreground">Dependiendo del perfil de riesgo, se podrían solicitar extractos bancarios de los últimos 3 meses o declaración de renta.</p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium mb-1">¿El seguro es obligatorio?</h4>
                                            <p className="text-xs text-muted-foreground">Sí, el vehículo debe contar con seguro todo riesgo endosado a favor de la entidad financiera durante la vigencia del crédito.</p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium mb-1">¿Se permiten abonos a capital?</h4>
                                            <p className="text-xs text-muted-foreground">Sí, se pueden realizar abonos a capital en cualquier momento sin penalidad, reduciendo el plazo o el valor de la cuota.</p>
                                        </div>
                                    </div>
                                </CollapsibleSection>
                            </div>
                        </div>
                    )}

                    {activeTab === 'client' && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="w-5 h-5 text-primary" />
                                    Información del Cliente
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-1">
                                <InfoRow label="Nombre Completo" value={client?.name} />
                                <InfoRow label="Identificación" value={`${client?.idType || ''}-${client?.idNumber || ''}`} />
                                <InfoRow label="Email" value={client?.email} />
                                <InfoRow label="Teléfono" value={client?.phone} />
                                <InfoRow label="Dirección" value={client?.address} />
                                <InfoRow label="Fecha Nacimiento" value={client?.birthDate} />
                                <InfoRow label="Estado Civil" value={client?.maritalStatus} />
                                <InfoRow label="Ocupación" value={client?.occupation} />
                                <InfoRow label="Ingreso Mensual" value={`$${client?.monthlyIncome?.toLocaleString()}`} highlight />
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === 'vehicle' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="overflow-hidden">
                                <img src={vehicle?.image} alt="Vehicle" className="w-full h-64 object-cover" />
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Car className="w-5 h-5 text-primary" />
                                        Detalles del Vehículo
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-1">
                                    <InfoRow label="Marca" value={vehicle?.make} />
                                    <InfoRow label="Modelo" value={vehicle?.model} />
                                    <InfoRow label="Año" value={vehicle?.year} />
                                    <InfoRow label="Precio" value={`$${vehicle?.price?.toLocaleString()}`} highlight />
                                    <InfoRow label="Kilometraje" value={vehicle?.mileage ? `${vehicle.mileage} km` : 'N/A'} />
                                    <InfoRow label="Color" value={vehicle?.color || 'N/A'} />
                                    <InfoRow label="Transmisión" value={vehicle?.transmission || 'N/A'} />
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {activeTab === 'documents' && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-primary" />
                                    Documentación Adjunta
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <DocPreviewRow
                                    name="Documento de Identidad"
                                    verified={request.documents?.idCard}
                                    url={request.documentUrls?.idCard}
                                />
                                <DocPreviewRow
                                    name="Comprobante de Ingresos"
                                    verified={request.documents?.incomeProof}
                                    url={request.documentUrls?.incomeProof}
                                />
                                <DocPreviewRow
                                    name="Comprobante de Domicilio"
                                    verified={request.documents?.addressProof}
                                    url={request.documentUrls?.addressProof}
                                />
                                <DocPreviewRow
                                    name="Proforma del Vehículo"
                                    verified={request.documents?.vehicleProforma}
                                    url={request.documentUrls?.vehicleProforma}
                                />
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-border bg-card flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                        Acciones de evaluación
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={() => onDecision('rejected')}
                            className="border-red-500/30 text-red-600 hover:bg-red-500/10"
                        >
                            <XCircle className="w-4 h-4 mr-2" />
                            Rechazar
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => onDecision('review')}
                            className="border-orange-500/30 text-orange-600 hover:bg-orange-500/10"
                        >
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            Revisión
                        </Button>
                        <Button
                            onClick={() => onDecision('approved')}
                            className="bg-green-600 hover:bg-green-500 text-white"
                        >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Aprobar
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
