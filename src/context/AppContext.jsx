import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Mock Data
  const [user, setUser] = useState(null); // Current logged in user

  // Database Simulation
  const [vehicles, setVehicles] = useState([
    { id: 1, make: 'Toyota', model: 'Corolla', year: 2024, price: 25000, image: 'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?auto=format&fit=crop&q=80&w=1000' },
    { id: 2, make: 'Ford', model: 'Mustang', year: 2023, price: 45000, image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=1000' },
    { id: 3, make: 'Tesla', model: 'Model 3', year: 2024, price: 42000, image: 'https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&q=80&w=1000' },
  ]);

  const [clients, setClients] = useState([
    { id: 1, name: 'Juan Pérez', email: 'juan@example.com', phone: '555-0101', status: 'Active' },
  ]);

  const [requests, setRequests] = useState([
    // { id: 1, clientId: 1, vehicleId: 1, status: 'pending_docs', documents: {} }
  ]);

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
      clients, addClient,
      requests, createRequest, updateRequestStatus, uploadDocument
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
