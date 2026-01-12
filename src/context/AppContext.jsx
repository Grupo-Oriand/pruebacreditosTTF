
import React, { createContext, useContext, useState, useEffect } from 'react';
import { testRequests } from '../data/testRequests';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Mock Data
  const [user, setUser] = useState(null); // Current logged in user

  // Versión de datos para forzar migración cuando sea necesario
  const DATA_VERSION = '2.0-toyota-only';

  // Helper para inicializar estado desde localStorage con validación
  const getInitialState = (key, defaultValue) => {
    // Verificar versión de datos
    const savedVersion = localStorage.getItem('dataVersion');

    // Si la versión no coincide, limpiar todo y usar valores por defecto
    if (savedVersion !== DATA_VERSION) {
      console.log('🔄 Migrando datos a versión:', DATA_VERSION);
      localStorage.clear();
      localStorage.setItem('dataVersion', DATA_VERSION);
      return defaultValue;
    }

    const saved = localStorage.getItem(key);
    if (!saved) return defaultValue;

    try {
      const parsed = JSON.parse(saved);

      // Validación específica para vehículos: solo Toyota
      if (key === 'vehicles') {
        const validVehicles = parsed.filter(v => v.make === 'Toyota');
        if (validVehicles.length !== parsed.length) {
          console.log('🚗 Limpiando vehículos no-Toyota');
          return defaultValue;
        }
        return validVehicles.length > 0 ? validVehicles : defaultValue;
      }

      // Validación para solicitudes: verificar que los vehículos existan
      if (key === 'requests') {
        // Resetear a solicitudes de prueba si hay inconsistencias
        return defaultValue;
      }

      return parsed;
    } catch (e) {
      console.error('Error parsing localStorage:', e);
      return defaultValue;
    }
  };

  // Database Simulation con persistencia
  const [vehicles, setVehicles] = useState(() => getInitialState('vehicles', [
    { id: 1, make: 'Toyota', model: 'Corolla', year: 2024, price: 25000, image: 'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?auto=format&fit=crop&q=80&w=1000' },
    { id: 2, make: 'Toyota', model: 'Camry', year: 2024, price: 32000, image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&q=80&w=1000' },
    { id: 3, make: 'Toyota', model: 'RAV4', year: 2024, price: 35000, image: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&q=80&w=1000' },
    { id: 4, make: 'Toyota', model: 'Hilux', year: 2024, price: 38000, image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1000' },
    { id: 5, make: 'Toyota', model: 'Land Cruiser', year: 2024, price: 85000, image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&q=80&w=1000' },
  ]));

  const [clients, setClients] = useState(() => getInitialState('clients', [
    {
      id: 1,
      name: 'Juan Pérez',
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan@example.com',
      phone: '555-0101',
      idType: 'V',
      idNumber: '12345678',
      birthDate: '1990-05-15',
      maritalStatus: 'casado',
      address: 'Av. Principal, Caracas',
      occupation: 'Ingeniero de Software',
      monthlyIncome: 5000,
      employmentYears: 8,
      status: 'Active',
      username: 'cliente1',
      password: 'password123'
    },
  ]));

  const [sellers, setSellers] = useState(() => getInitialState('sellers', []));

  // Cargar solicitudes de prueba automáticamente en desarrollo
  const [requests, setRequests] = useState(() => getInitialState('requests', testRequests));

  // Sistema de notificaciones
  const [notifications, setNotifications] = useState(() => getInitialState('notifications', []));

  // Guardar en localStorage cuando cambien los datos
  useEffect(() => {
    localStorage.setItem('dataVersion', DATA_VERSION);
    localStorage.setItem('vehicles', JSON.stringify(vehicles));
  }, [vehicles]);
  useEffect(() => { localStorage.setItem('clients', JSON.stringify(clients)); }, [clients]);
  useEffect(() => { localStorage.setItem('sellers', JSON.stringify(sellers)); }, [sellers]);
  useEffect(() => { localStorage.setItem('requests', JSON.stringify(requests)); }, [requests]);
  useEffect(() => { localStorage.setItem('notifications', JSON.stringify(notifications)); }, [notifications]);

  const login = (role, name, additionalData = {}) => {
    setUser({ role, name, ...additionalData });
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
      needsCompletion: true, // Nueva bandera para indicar que necesita completar formulario
      documents: {
        idCard: false,
        incomeProof: false,
        addressProof: false,
        vehicleProforma: false
      }
    };
    setRequests([...requests, newRequest]);

    // Crear notificación para el cliente
    const newNotification = {
      id: Date.now() + 1,
      clientId,
      requestId: newRequest.id,
      type: 'new_request',
      title: 'Nueva Solicitud de Crédito',
      message: 'Se ha creado una nueva solicitud de crédito. Completa el formulario para continuar.',
      read: false,
      date: new Date().toISOString()
    };
    setNotifications([...notifications, newNotification]);

    return newRequest.id;
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications(notifications.map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    ));
  };

  const completeRequestForm = (requestId, formData) => {
    setRequests(requests.map(r =>
      r.id === requestId ? { ...r, ...formData, needsCompletion: false } : r
    ));
  };

  const updateRequestStatus = (requestId, status) => {
    setRequests(requests.map(r => r.id === requestId ? { ...r, status } : r));
  };

  const uploadDocument = (requestId, docType, file) => {
    setRequests(requests.map(r => {
      if (r.id === requestId) {
        const updatedDocs = { ...r.documents, [docType]: true };

        // Crear URL temporal para el archivo si se proporciona
        let fileUrl = null;
        if (file) {
          fileUrl = URL.createObjectURL(file);
        }

        const updatedDocUrls = {
          ...(r.documentUrls || {}),
          [docType]: fileUrl
        };

        // Check if all docs are uploaded
        const allUploaded = Object.values(updatedDocs).every(v => v);
        return {
          ...r,
          documents: updatedDocs,
          documentUrls: updatedDocUrls,
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
      requests, createRequest, updateRequestStatus, uploadDocument,
      notifications, markNotificationAsRead, completeRequestForm
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
