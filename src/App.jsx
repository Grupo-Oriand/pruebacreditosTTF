import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Login from './pages/Login';
import DealerDashboard from './pages/dealer/DealerDashboard';
import ClientDashboard from './pages/client/ClientDashboard';
import FinancialDashboard from './pages/financial/FinancialDashboard';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useApp();
  if (!user) return <Navigate to="/" />;

  // Si allowedRoles es un array, verificamos si el rol del usuario está incluido
  if (Array.isArray(allowedRoles)) {
    if (!allowedRoles.includes(user.role)) return <Navigate to="/" />;
  }
  // Si es un string único (compatibilidad hacia atrás)
  else if (allowedRoles && user.role !== allowedRoles) {
    return <Navigate to="/" />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dealer/*" element={
        <ProtectedRoute allowedRoles={['dealer', 'dealer_manager', 'seller']}>
          <DealerDashboard />
        </ProtectedRoute>
      } />
      <Route path="/client/*" element={
        <ProtectedRoute allowedRoles={['client']}>
          <ClientDashboard />
        </ProtectedRoute>
      } />
      <Route path="/financial/*" element={
        <ProtectedRoute allowedRoles={['financial']}>
          <FinancialDashboard />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

function App() {
  return (
    <AppProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AppProvider>
  );
}

export default App;
