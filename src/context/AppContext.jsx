
import React, { createContext, useContext, useState, useEffect } from 'react';
import { testRequests } from '../data/testRequests';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Mock Data
  const [user, setUser] = useState(null); // Current logged in user

  // Helper para inicializar estado desde localStorage
  const getInitialState = (key, defaultValue) => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  };

  // Database Simulation con persistencia
  const [vehicles, setVehicles] = useState(() => getInitialState('vehicles', [
    { id: 1, make: 'Toyota', model: 'Corolla', year: 2024, price: 25000, image: 'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?auto=format&fit=crop&q=80&w=1000' },
    { id: 2, make: 'Ford', model: 'Mustang', year: 2023, price: 45000, image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=1000' },
    { id: 3, make: 'Tesla', model: 'Model 3', year: 2024, price: 42000, image: 'https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&q=80&w=1000' },
  ]));

  const [clients, setClients] = useState(() => getInitialState('clients', [
    { id: 1, name: 'Juan Pérez', email: 'juan@example.com', phone: '555-0101', status: 'Active', username: 'cliente1', password: 'password123' },
  ]));

  const [sellers, setSellers] = useState(() => getInitialState('sellers', []));

  // Cargar solicitudes de prueba automáticamente en desarrollo
  const [requests, setRequests] = useState(() => getInitialState('requests', testRequests));

  // Guardar en localStorage cuando cambien los datos
  useEffect(() => { localStorage.setItem('vehicles', JSON.stringify(vehicles)); }, [vehicles]);
  useEffect(() => { localStorage.setItem('clients', JSON.stringify(clients)); }, [clients]);
  useEffect(() => { localStorage.setItem('sellers', JSON.stringify(sellers)); }, [sellers]);
  useEffect(() => { localStorage.setItem('requests', JSON.stringify(requests)); }, [requests]);

  const login = (role, name) => {
    setUser({ role, name });
  };

  const logout = () => {
    setUser(null);
  };

  const addVehicle = (vehicle) => {
    setVehicles([...vehicles, { ...vehicle, id: Date.now() }]);
  };

  const addClient = (client) => {
    setClients([...clients, { ...client, id: Date.now() }]);
  };

  const addSeller = (seller) => {
    setSellers([...sellers, { ...seller, id: Date.now() }]);
  };

  const updateClient = (updatedClient) => {
    setClients(clients.map(c => c.id === updatedClient.id ? updatedClient : c));
  };

  const createRequest = (clientId, vehicleId) => {
    const newRequest = {
      id: Date.now(),
      clientId,
      vehicleId,
      status: 'pending_docs', // pending_docs, review, approved, rejected, conditioned
      date: new Date().toISOString(),
      documents: {
        idCard: false,
        incomeProof: false,
        addressProof: false
      }
    };
    setRequests([...requests, newRequest]);
  };

  const updateRequestStatus = (requestId, status) => {
    setRequests(requests.map(r => r.id === requestId ? { ...r, status } : r));
  };

  const uploadDocument = (requestId, docType) => {
    setRequests(requests.map(r => {
      if (r.id === requestId) {
        const updatedDocs = { ...r.documents, [docType]: true };
        // Check if all docs are uploaded
        const allUploaded = Object.values(updatedDocs).every(v => v);
        return {
          ...r,
          documents: updatedDocs,
          status: allUploaded ? 'review' : 'pending_docs'
        };
      }
      return r;
    }));
  };

  return (
    <AppContext.Provider value={{
      user, login, logout,
      vehicles, addVehicle,
      clients, addClient, updateClient,
      sellers, addSeller,
      requests, createRequest, updateRequestStatus, uploadDocument
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
