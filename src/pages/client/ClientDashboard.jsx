import React from 'react';
import { useApp } from '../../context/AppContext';
import { Upload, CheckCircle, Clock, FileText, AlertCircle, LogOut } from 'lucide-react';
import { StatusBadge } from '../dealer/DealerDashboard';
import { useNavigate } from 'react-router-dom';

const ClientDashboard = () => {
  const { user, requests, vehicles, clients, uploadDocument, logout } = useApp();
  const navigate = useNavigate();

  // Encontrar el cliente actual basado en el usuario logueado
  // Buscamos por nombre ya que es lo que guardamos en el login
  const currentClient = clients.find(c => c.name === user?.name);

  // Buscar la solicitud asociada a este cliente
  const myRequest = currentClient ? requests.find(r => r.clientId === currentClient.id) : null;
  const myVehicle = myRequest ? vehicles.find(v => v.id === myRequest.vehicleId) : null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!myRequest) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
        <div className="glass-panel p-8 rounded-2xl text-center max-w-md">
          <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">No hay solicitudes activas</h2>
          <p className="text-slate-400 mb-6">Contacta a tu concesionario para iniciar una solicitud de crédito.</p>
          <button onClick={handleLogout} className="btn-secondary w-full">Cerrar Sesión</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg p-6">
      <header className="max-w-5xl mx-auto flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-600 flex items-center justify-center">
            <FileText className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-white">Mi Solicitud</h1>
        </div>
        <button onClick={handleLogout} className="btn-secondary flex items-center gap-2">
          <LogOut className="w-4 h-4" /> Salir
        </button>
      </header>

      <main className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Status & Vehicle */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-xl">
            <h3 className="text-slate-400 text-sm font-medium mb-4 uppercase tracking-wider">Estado Actual</h3>
            <div className="flex flex-col items-center text-center py-4">
              <div className="mb-4 transform scale-125">
                <StatusBadge status={myRequest.status} />
              </div>
              <p className="text-slate-300 text-sm">
                {myRequest.status === 'pending_docs' && 'Por favor sube los documentos requeridos para continuar.'}
                {myRequest.status === 'review' && 'Tu solicitud está siendo revisada por nuestros analistas.'}
                {myRequest.status === 'approved' && '¡Felicidades! Tu crédito ha sido aprobado.'}
              </p>
            </div>
          </div>

          {myVehicle && (
            <div className="glass-panel p-6 rounded-xl">
              <h3 className="text-slate-400 text-sm font-medium mb-4 uppercase tracking-wider">Vehículo Seleccionado</h3>
              <img src={myVehicle.image} alt={myVehicle.model} className="w-full h-40 object-cover rounded-lg mb-4" />
              <h4 className="text-xl font-bold text-white">{myVehicle.make} {myVehicle.model}</h4>
              <p className="text-primary-400 font-semibold text-lg">${myVehicle.price.toLocaleString()}</p>
              <div className="mt-4 pt-4 border-t border-dark-border grid grid-cols-2 gap-4 text-sm text-slate-400">
                <div>
                  <span className="block text-xs text-slate-500">Año</span>
                  {myVehicle.year}
                </div>
                <div>
                  <span className="block text-xs text-slate-500">ID Ref</span>
                  #{myVehicle.id}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Tasks */}
        <div className="md:col-span-2 space-y-6">
          <div className="glass-panel p-8 rounded-xl">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <CheckCircle className="text-primary-500" />
              Documentación Requerida
            </h2>

            <div className="space-y-4">
              <DocUploader
                title="Documento de Identidad"
                description="Sube una foto clara de tu DNI o Pasaporte (Frente y Dorso)"
                isUploaded={myRequest.documents.idCard}
                onUpload={() => uploadDocument(myRequest.id, 'idCard')}
              />
              <DocUploader
                title="Comprobante de Ingresos"
                description="Últimos 3 recibos de sueldo o declaración de impuestos"
                isUploaded={myRequest.documents.incomeProof}
                onUpload={() => uploadDocument(myRequest.id, 'incomeProof')}
              />
              <DocUploader
                title="Comprobante de Domicilio"
                description="Factura de servicio (Luz, Agua, Gas) no mayor a 3 meses"
                isUploaded={myRequest.documents.addressProof}
                onUpload={() => uploadDocument(myRequest.id, 'addressProof')}
              />
            </div>

            {myRequest.status === 'review' && (
              <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-start gap-3">
                <Clock className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-blue-400">Documentación Completa</h4>
                  <p className="text-blue-300/80 text-sm mt-1">Hemos recibido todos tus documentos. La entidad financiera está evaluando tu solicitud. Te notificaremos pronto.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

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

export default ClientDashboard;
