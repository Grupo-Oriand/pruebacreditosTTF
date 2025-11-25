import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Car, Users, FileText, Search, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DealerDashboard = () => {
  const { vehicles, clients, requests, addVehicle, addClient, createRequest, logout } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview'); // overview, vehicles, clients, new-request

  // Forms State
  const [newVehicle, setNewVehicle] = useState({ make: '', model: '', year: '', price: '', image: '' });
  const [newClient, setNewClient] = useState({ name: '', email: '', phone: '' });
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedClient, setSelectedClient] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAddVehicle = (e) => {
    e.preventDefault();
    addVehicle({ ...newVehicle, image: newVehicle.image || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1000' });
    setNewVehicle({ make: '', model: '', year: '', price: '', image: '' });
    alert('Vehículo agregado correctamente');
  };

  const handleAddClient = (e) => {
    e.preventDefault();
    addClient(newClient);
    setNewClient({ name: '', email: '', phone: '' });
    alert('Cliente registrado correctamente');
  };

  const handleCreateRequest = (e) => {
    e.preventDefault();
    if (!selectedClient || !selectedVehicle) return;
    createRequest(parseInt(selectedClient), parseInt(selectedVehicle));
    setActiveTab('overview');
    alert('Solicitud creada y enviada al cliente');
  };

  return (
    <div className="min-h-screen bg-dark-bg flex">
      {/* Sidebar */}
      <div className="w-64 glass-panel border-r border-dark-border p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-lg bg-primary-600 flex items-center justify-center">
            <Building2 className="text-white w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-white">Dealer Portal</h2>
            <p className="text-xs text-slate-400">Panel de Control</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <NavButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<FileText />} label="Resumen" />
          <NavButton active={activeTab === 'vehicles'} onClick={() => setActiveTab('vehicles')} icon={<Car />} label="Inventario" />
          <NavButton active={activeTab === 'clients'} onClick={() => setActiveTab('clients')} icon={<Users />} label="Clientes" />
          <NavButton active={activeTab === 'new-request'} onClick={() => setActiveTab('new-request')} icon={<Plus />} label="Nueva Solicitud" />
        </nav>

        <button onClick={handleLogout} className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors mt-auto pt-6 border-t border-dark-border">
          <LogOut className="w-5 h-5" />
          <span>Cerrar Sesión</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-white">
            {activeTab === 'overview' && 'Resumen de Solicitudes'}
            {activeTab === 'vehicles' && 'Gestión de Vehículos'}
            {activeTab === 'clients' && 'Gestión de Clientes'}
            {activeTab === 'new-request' && 'Crear Nueva Solicitud'}
          </h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-white">Vendedor Demo</p>
              <p className="text-xs text-slate-400">Concesionario Central</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-700"></div>
          </div>
        </header>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 gap-6">
            <div className="grid grid-cols-3 gap-6 mb-6">
              <StatCard title="Solicitudes Activas" value={requests.length} icon={<FileText className="text-blue-400" />} />
              <StatCard title="Vehículos en Stock" value={vehicles.length} icon={<Car className="text-green-400" />} />
              <StatCard title="Clientes Registrados" value={clients.length} icon={<Users className="text-purple-400" />} />
            </div>
            
            <div className="glass-panel rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Solicitudes Recientes</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-slate-400 border-b border-dark-border">
                      <th className="pb-3 pl-2">ID</th>
                      <th className="pb-3">Cliente</th>
                      <th className="pb-3">Vehículo</th>
                      <th className="pb-3">Estado</th>
                      <th className="pb-3">Fecha</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-300">
                    {requests.map(req => {
                      const client = clients.find(c => c.id === req.clientId);
                      const vehicle = vehicles.find(v => v.id === req.vehicleId);
                      return (
                        <tr key={req.id} className="border-b border-dark-border/50 hover:bg-white/5">
                          <td className="py-4 pl-2">#{req.id.toString().slice(-4)}</td>
                          <td className="py-4">{client?.name}</td>
                          <td className="py-4">{vehicle?.make} {vehicle?.model}</td>
                          <td className="py-4"><StatusBadge status={req.status} /></td>
                          <td className="py-4">{new Date(req.date).toLocaleDateString()}</td>
                        </tr>
                      );
                    })}
                    {requests.length === 0 && (
                      <tr>
                        <td colSpan="5" className="py-8 text-center text-slate-500">No hay solicitudes activas</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'vehicles' && (
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-white mb-4">Agregar Nuevo Vehículo</h3>
              <form onSubmit={handleAddVehicle} className="grid grid-cols-2 gap-4">
                <input required placeholder="Marca (ej. Toyota)" className="input-field" value={newVehicle.make} onChange={e => setNewVehicle({...newVehicle, make: e.target.value})} />
                <input required placeholder="Modelo (ej. Corolla)" className="input-field" value={newVehicle.model} onChange={e => setNewVehicle({...newVehicle, model: e.target.value})} />
                <input required type="number" placeholder="Año" className="input-field" value={newVehicle.year} onChange={e => setNewVehicle({...newVehicle, year: e.target.value})} />
                <input required type="number" placeholder="Precio ($)" className="input-field" value={newVehicle.price} onChange={e => setNewVehicle({...newVehicle, price: e.target.value})} />
                <input placeholder="URL Imagen (Opcional)" className="input-field col-span-2" value={newVehicle.image} onChange={e => setNewVehicle({...newVehicle, image: e.target.value})} />
                <div className="col-span-2 flex justify-end">
                  <button type="submit" className="btn-primary flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Agregar Vehículo
                  </button>
                </div>
              </form>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {vehicles.map(vehicle => (
                <div key={vehicle.id} className="glass-panel rounded-xl overflow-hidden group">
                  <div className="h-48 overflow-hidden relative">
                    <img src={vehicle.image} alt={vehicle.model} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute top-2 right-2 bg-dark-bg/80 backdrop-blur px-2 py-1 rounded text-xs font-bold text-white">
                      {vehicle.year}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-white">{vehicle.make} {vehicle.model}</h3>
                    <p className="text-primary-400 font-semibold">${vehicle.price.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'clients' && (
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-white mb-4">Registrar Nuevo Cliente</h3>
              <form onSubmit={handleAddClient} className="grid grid-cols-2 gap-4">
                <input required placeholder="Nombre Completo" className="input-field col-span-2" value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})} />
                <input required type="email" placeholder="Correo Electrónico" className="input-field" value={newClient.email} onChange={e => setNewClient({...newClient, email: e.target.value})} />
                <input required placeholder="Teléfono" className="input-field" value={newClient.phone} onChange={e => setNewClient({...newClient, phone: e.target.value})} />
                <div className="col-span-2 flex justify-end">
                  <button type="submit" className="btn-primary flex items-center gap-2">
                    <Users className="w-4 h-4" /> Registrar Cliente
                  </button>
                </div>
              </form>
            </div>
            
            <div className="glass-panel rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Cartera de Clientes</h3>
              <div className="grid grid-cols-2 gap-4">
                {clients.map(client => (
                  <div key={client.id} className="p-4 border border-dark-border rounded-lg flex items-center justify-between hover:bg-white/5 transition-colors">
                    <div>
                      <p className="font-bold text-slate-200">{client.name}</p>
                      <p className="text-sm text-slate-400">{client.email}</p>
                    </div>
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">Activo</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'new-request' && (
          <div className="max-w-2xl mx-auto">
            <div className="glass-panel p-8 rounded-2xl">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-primary-500" />
                </div>
                <h2 className="text-2xl font-bold text-white">Nueva Solicitud de Crédito</h2>
                <p className="text-slate-400">Vincular un cliente con un vehículo para iniciar el proceso</p>
              </div>

              <form onSubmit={handleCreateRequest} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Seleccionar Cliente</label>
                  <select required className="input-field" value={selectedClient} onChange={e => setSelectedClient(e.target.value)}>
                    <option value="">-- Seleccione un cliente --</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name} - {c.email}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Seleccionar Vehículo</label>
                  <select required className="input-field" value={selectedVehicle} onChange={e => setSelectedVehicle(e.target.value)}>
                    <option value="">-- Seleccione un vehículo --</option>
                    {vehicles.map(v => <option key={v.id} value={v.id}>{v.make} {v.model} ({v.year}) - ${v.price}</option>)}
                  </select>
                </div>

                <div className="pt-4">
                  <button type="submit" className="btn-primary w-full py-3 text-lg">
                    Generar Solicitud
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Sub-components
const NavButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/20' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);

const StatCard = ({ title, value, icon }) => (
  <div className="glass-panel p-6 rounded-xl flex items-center justify-between">
    <div>
      <p className="text-slate-400 text-sm mb-1">{title}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
    <div className="p-3 bg-white/5 rounded-lg">{icon}</div>
  </div>
);

export const StatusBadge = ({ status }) => {
  const styles = {
    pending_docs: 'bg-yellow-500/20 text-yellow-400',
    review: 'bg-blue-500/20 text-blue-400',
    approved: 'bg-green-500/20 text-green-400',
    rejected: 'bg-red-500/20 text-red-400',
    conditioned: 'bg-orange-500/20 text-orange-400',
  };
  const labels = {
    pending_docs: 'Pendiente Docs',
    review: 'En Revisión',
    approved: 'Aprobado',
    rejected: 'Rechazado',
    conditioned: 'Condicionado',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-slate-500/20 text-slate-400'}`}>
      {labels[status] || status}
    </span>
  );
};

import { Building2 } from 'lucide-react'; // Import missing icon

export default DealerDashboard;
