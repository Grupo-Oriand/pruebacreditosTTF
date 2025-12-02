import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Upload, CheckCircle, Clock, FileText, AlertCircle, LogOut, User, FileStack, History, Edit2, X, Save, Calendar, MapPin, CreditCard, Phone, Mail, Car } from 'lucide-react';
import { StatusBadge } from '../dealer/DealerDashboard';
import { useNavigate } from 'react-router-dom';

const ClientDashboard = () => {
  const { user, requests, vehicles, clients, updateClient, uploadDocument, logout } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile'); // profile, requests, documents, history

  // Edit Profile State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    birthDate: '',
    idNumber: '',
    address: '',
    email: '',
    phone: ''
  });

  // Encontrar el cliente actual basado en el usuario logueado
  const currentClient = clients.find(c => c.name === user?.name);

  // Inicializar formulario cuando carga el cliente
  useEffect(() => {
    if (currentClient) {
      setEditForm({
        name: currentClient.name || '',
        birthDate: currentClient.birthDate || '',
        idNumber: currentClient.idNumber || '',
        address: currentClient.address || '',
        email: currentClient.email || '',
        phone: currentClient.phone || ''
      });
    }
  }, [currentClient]);

  // Buscar TODAS las solicitudes asociadas a este cliente
  const myRequests = currentClient ? requests.filter(r => r.clientId === currentClient.id) : [];

  // Para la pestaña de documentos, usamos la solicitud más reciente o activa
  const activeRequest = myRequests.length > 0 ? myRequests[myRequests.length - 1] : null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (currentClient) {
      updateClient({
        ...currentClient,
        ...editForm
      });
      setIsEditing(false);
    }
  };

  if (!currentClient) {
    return <div className="text-white p-8">Cargando perfil...</div>;
  }

  return (
    <div className="min-h-screen bg-dark-bg flex">
      {/* Sidebar */}
      <div className="w-80 glass-panel border-r border-dark-border flex flex-col">
        {/* Profile Header */}
        <div className="p-8 flex flex-col items-center text-center border-b border-dark-border/50">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center mb-4 shadow-lg shadow-primary-900/20">
            <span className="text-3xl font-bold text-white">
              {currentClient.name.charAt(0)}
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mb-1">{currentClient.name}</h2>
          <p className="text-sm text-slate-400">{currentClient.email}</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-6 space-y-2">
          <NavButton
            active={activeTab === 'profile'}
            onClick={() => setActiveTab('profile')}
            icon={<User />}
            label="Mi Perfil"
          />
          <NavButton
            active={activeTab === 'requests'}
            onClick={() => setActiveTab('requests')}
            icon={<FileText />}
            label="Mis Solicitudes"
          />
          <NavButton
            active={activeTab === 'documents'}
            onClick={() => setActiveTab('documents')}
            icon={<FileStack />}
            label="Mis Documentos"
          />
          <NavButton
            active={activeTab === 'history'}
            onClick={() => setActiveTab('history')}
            icon={<History />}
            label="Historial de Solicitudes"
          />
        </nav>

        {/* Logout */}
        <div className="p-6 border-t border-dark-border/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors font-medium"
          >
            <LogOut className="w-5 h-5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 overflow-y-auto relative">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-white">
            {activeTab === 'profile' && 'Mi Perfil'}
            {activeTab === 'requests' && 'Mis Solicitudes'}
            {activeTab === 'documents' && 'Gestión de Documentos'}
            {activeTab === 'history' && 'Historial de Solicitudes'}
          </h1>
          <p className="text-slate-400 mt-2">
            {activeTab === 'profile' && 'Administra tu información personal y de contacto.'}
            {activeTab === 'requests' && 'Gestiona tus solicitudes de crédito y revisa las ofertas recibidas.'}
            {activeTab === 'documents' && 'Sube y actualiza la documentación requerida para tu crédito.'}
            {activeTab === 'history' && 'Consulta el registro histórico de tus trámites.'}
          </p>
        </header>

        {activeTab === 'profile' && (
          <div className="max-w-4xl space-y-6">
            {/* Tarjeta de Datos Personales */}
            <div className="glass-panel rounded-2xl overflow-hidden border border-dark-border">
              <div className="bg-dark-surface/50 p-6 border-b border-dark-border flex justify-between items-center">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <User className="text-primary-500 w-5 h-5" />
                  Datos Personales
                </h3>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600/20 hover:bg-primary-600/30 text-primary-400 rounded-lg transition-colors text-sm font-medium"
                >
                  <Edit2 className="w-4 h-4" />
                  Editar
                </button>
              </div>

              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Nombre Completo</label>
                  <p className="text-white text-lg font-medium">{currentClient.name}</p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Fecha de Nacimiento
                  </label>
                  <p className="text-white text-lg font-medium">{currentClient.birthDate || 'No registrada'}</p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold flex items-center gap-1">
                    <CreditCard className="w-3 h-3" /> Cédula de Identidad
                  </label>
                  <p className="text-white text-lg font-medium">{currentClient.idNumber || 'No registrada'}</p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Dirección
                  </label>
                  <p className="text-white text-lg font-medium">{currentClient.address || 'No registrada'}</p>
                </div>
              </div>
            </div>

            {/* Tarjeta de Información de Contacto */}
            <div className="glass-panel rounded-2xl overflow-hidden border border-dark-border">
              <div className="bg-dark-surface/50 p-6 border-b border-dark-border flex justify-between items-center">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Phone className="text-primary-500 w-5 h-5" />
                  Información de Contacto
                </h3>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600/20 hover:bg-primary-600/30 text-primary-400 rounded-lg transition-colors text-sm font-medium"
                >
                  <Edit2 className="w-4 h-4" />
                  Editar
                </button>
              </div>

              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold flex items-center gap-1">
                    <Mail className="w-3 h-3" /> Correo Electrónico
                  </label>
                  <p className="text-white text-lg font-medium">{currentClient.email}</p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold flex items-center gap-1">
                    <Phone className="w-3 h-3" /> Teléfono
                  </label>
                  <p className="text-white text-lg font-medium">{currentClient.phone}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Profile Modal */}
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-dark-bg border border-dark-border rounded-2xl w-full max-w-lg shadow-2xl transform transition-all max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-dark-border flex justify-between items-center sticky top-0 bg-dark-bg z-10">
                <h3 className="text-xl font-bold text-white">Editar Perfil</h3>
                <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="p-6 space-y-6">
                {/* Sección Datos Personales */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-primary-400 uppercase tracking-wider border-b border-dark-border pb-2">Datos Personales</h4>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Nombre Completo</label>
                    <input
                      type="text"
                      required
                      className="input-field"
                      value={editForm.name}
                      onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Fecha de Nacimiento</label>
                      <input
                        type="date"
                        className="input-field"
                        value={editForm.birthDate}
                        onChange={e => setEditForm({ ...editForm, birthDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Cédula / ID</label>
                      <input
                        type="text"
                        className="input-field"
                        value={editForm.idNumber}
                        onChange={e => setEditForm({ ...editForm, idNumber: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Dirección</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Ej. Calle 123 #45-67"
                      value={editForm.address}
                      onChange={e => setEditForm({ ...editForm, address: e.target.value })}
                    />
                  </div>
                </div>

                {/* Sección Información de Contacto */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-primary-400 uppercase tracking-wider border-b border-dark-border pb-2">Información de Contacto</h4>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Correo Electrónico</label>
                    <input
                      type="email"
                      required
                      className="input-field"
                      value={editForm.email}
                      onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Teléfono</label>
                    <input
                      type="tel"
                      className="input-field"
                      value={editForm.phone}
                      onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-dark-border mt-6">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-lg text-slate-300 hover:bg-white/5 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex items-center gap-2 px-6 py-2"
                  >
                    <Save className="w-4 h-4" />
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="max-w-5xl space-y-6">
            {myRequests.length === 0 ? (
              <EmptyState />
            ) : (
              myRequests.map(request => {
                const vehicle = vehicles.find(v => v.id === request.vehicleId);
                // Simulación de ofertas basadas en el estado
                const offers = request.status === 'approved' || request.status === 'conditioned' ? [
                  { bank: 'Bancolombia', rate: '1.2%', term: '60 meses', amount: vehicle?.price * 0.9 },
                  { bank: 'Davivienda', rate: '1.5%', term: '48 meses', amount: vehicle?.price }
                ] : [];

                return (
                  <div key={request.id} className="glass-panel p-6 rounded-2xl border border-dark-border hover:border-primary-500/30 transition-colors">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Detalles de la Solicitud */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-xl font-bold text-white">{vehicle?.make} {vehicle?.model}</h3>
                            <p className="text-sm text-slate-400">Solicitud #{request.id} • {new Date(request.date).toLocaleDateString()}</p>
                          </div>
                          <StatusBadge status={request.status} />
                        </div>

                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-slate-400 text-sm">Monto Solicitado:</span>
                          <span className="text-primary-400 font-bold text-lg">${vehicle?.price.toLocaleString()}</span>
                        </div>

                        {/* Sección de Ofertas */}
                        {offers.length > 0 ? (
                          <div className="bg-dark-bg/50 rounded-xl p-4 border border-dark-border">
                            <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              Ofertas Recibidas
                            </h4>
                            <div className="grid grid-cols-1 gap-3">
                              {offers.map((offer, idx) => (
                                <div key={idx} className="bg-dark-surface p-4 rounded-lg border border-dark-border flex flex-col sm:flex-row justify-between items-center gap-4">
                                  <div className="w-full sm:w-auto">
                                    <p className="font-bold text-white text-lg">{offer.bank}</p>
                                    <div className="flex items-center gap-3 text-sm text-slate-400 mt-1">
                                      <span className="bg-dark-bg px-2 py-1 rounded border border-dark-border">Plazo: {offer.term}</span>
                                      <span className="bg-dark-bg px-2 py-1 rounded border border-dark-border">Tasa: {offer.rate}</span>
                                    </div>
                                  </div>
                                  <div className="text-right flex flex-col items-end gap-2 w-full sm:w-auto">
                                    <p className="text-white font-bold text-xl">${offer.amount.toLocaleString()}</p>
                                    <div className="flex gap-2 w-full sm:w-auto">
                                      <button className="flex-1 sm:flex-none px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-xs font-bold rounded-lg transition-colors shadow-lg shadow-green-900/20 flex items-center justify-center gap-2">
                                        <CheckCircle className="w-3 h-3" />
                                        Proceder con esta oferta
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="bg-dark-bg/30 rounded-xl p-4 border border-dark-border/50 text-center">
                            <p className="text-slate-500 text-sm">
                              {request.status === 'rejected'
                                ? 'No se recibieron ofertas para esta solicitud.'
                                : 'Esperando ofertas de las entidades financieras...'}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="max-w-3xl">
            {!activeRequest ? (
              <EmptyState />
            ) : (
              <div className="glass-panel p-8 rounded-2xl">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center">
                    <FileStack className="w-6 h-6 text-primary-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Documentación Requerida</h3>
                    <p className="text-slate-400 text-sm">Solicitud #{activeRequest.id}</p>
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
                      <p className="text-blue-300/80 text-sm mt-1">Hemos recibido todos tus documentos. La entidad financiera está evaluando tu solicitud.</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="max-w-4xl">
            <div className="glass-panel rounded-2xl overflow-hidden border border-dark-border">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-dark-surface/50 border-b border-dark-border">
                    <tr>
                      <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Fecha</th>
                      <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">ID Solicitud</th>
                      <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Vehículo</th>
                      <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-border">
                    {myRequests.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="p-8 text-center text-slate-500">No hay historial disponible</td>
                      </tr>
                    ) : (
                      myRequests.map(request => {
                        const vehicle = vehicles.find(v => v.id === request.vehicleId);
                        return (
                          <tr key={request.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-4 text-slate-300">{new Date(request.date).toLocaleDateString()}</td>
                            <td className="p-4 text-slate-300 font-mono">#{request.id}</td>
                            <td className="p-4 text-white font-medium">{vehicle?.make} {vehicle?.model}</td>
                            <td className="p-4">
                              <StatusBadge status={request.status} />
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active
      ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/20'
      : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
      }`}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);

const DocUploader = ({ title, description, isUploaded, onUpload }) => (
  <div className={`p-4 rounded-xl border transition-all ${isUploaded ? 'bg-green-500/5 border-green-500/20' : 'bg-dark-bg border-dark-border'}`}>
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h4 className={`font-semibold ${isUploaded ? 'text-green-400' : 'text-slate-200'}`}>{title}</h4>
          {isUploaded && <CheckCircle className="w-4 h-4 text-green-500" />}
        </div>
        <p className="text-sm text-slate-400">{description}</p>
      </div>

      {!isUploaded ? (
        <button onClick={onUpload} className="ml-4 px-4 py-2 bg-dark-surface hover:bg-dark-border border border-dark-border rounded-lg text-sm font-medium text-primary-400 transition-colors flex items-center gap-2">
          <Upload className="w-4 h-4" /> Subir
        </button>
      ) : (
        <span className="ml-4 px-3 py-1 bg-green-500/10 text-green-500 text-xs font-bold rounded-full uppercase tracking-wider">
          Cargado
        </span>
      )}
    </div>
  </div>
);

const EmptyState = () => (
  <div className="glass-panel p-12 rounded-2xl text-center">
    <div className="w-20 h-20 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
      <FileText className="w-10 h-10 text-slate-400" />
    </div>
    <h3 className="text-xl font-bold text-white mb-2">No hay solicitudes activas</h3>
    <p className="text-slate-400 max-w-md mx-auto">
      Actualmente no tienes ninguna solicitud de crédito en proceso. Contacta a tu concesionario para iniciar una nueva solicitud.
    </p>
  </div>
);

export default ClientDashboard;
