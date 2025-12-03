import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { ClientSidebar } from '../../components/client/ClientSidebar';
import { ProfileSection } from '../../components/client/ProfileSection';
import { RequestsSection } from '../../components/client/RequestsSection';
import { DocumentsSection } from '../../components/client/DocumentsSection';
import { HistorySection } from '../../components/client/HistorySection';
import { EditProfileModal } from '../../components/client/EditProfileModal';

const ClientDashboard = () => {
  const { user, requests, vehicles, clients, updateClient, uploadDocument, logout } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    birthDate: '',
    idNumber: '',
    address: '',
    email: '',
    phone: ''
  });

  const currentClient = clients.find(c => c.name === user?.name);
  const myRequests = currentClient ? requests.filter(r => r.clientId === currentClient.id) : [];
  const activeRequest = myRequests.length > 0 ? myRequests[myRequests.length - 1] : null;

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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSaveProfile = () => {
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

  const tabTitles = {
    profile: 'Mi Perfil',
    requests: 'Mis Solicitudes',
    documents: 'Gestión de Documentos',
    history: 'Historial de Solicitudes'
  };

  const tabDescriptions = {
    profile: 'Administra tu información personal y de contacto.',
    requests: 'Gestiona tus solicitudes de crédito y revisa las ofertas recibidas.',
    documents: 'Sube y actualiza la documentación requerida para tu crédito.',
    history: 'Consulta el registro histórico de tus trámites.'
  };

  return (
    <div className="min-h-screen bg-dark-bg flex">
      <ClientSidebar
        currentClient={currentClient}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      <div className="flex-1 p-10 overflow-y-auto relative">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-white">{tabTitles[activeTab]}</h1>
          <p className="text-slate-400 mt-2">{tabDescriptions[activeTab]}</p>
        </header>

        {activeTab === 'profile' && (
          <ProfileSection 
            client={currentClient} 
            onEdit={() => setIsEditing(true)} 
          />
        )}

        {activeTab === 'requests' && (
          <RequestsSection 
            requests={myRequests} 
            vehicles={vehicles} 
          />
        )}

        {activeTab === 'documents' && (
          <DocumentsSection 
            activeRequest={activeRequest} 
            uploadDocument={uploadDocument} 
          />
        )}

        {activeTab === 'history' && (
          <HistorySection 
            requests={myRequests} 
            vehicles={vehicles} 
          />
        )}
      </div>

      <EditProfileModal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        editForm={editForm}
        setEditForm={setEditForm}
        onSave={handleSaveProfile}
      />
    </div>
  );
};

export default ClientDashboard;
