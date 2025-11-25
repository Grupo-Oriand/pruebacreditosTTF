import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Login from './pages/Login';
import DealerDashboard from './pages/dealer/DealerDashboard';
import ClientDashboard from './pages/client/ClientDashboard';
import FinancialDashboard from './pages/financial/FinancialDashboard';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user } = useApp();
  if (!user) return <Navigate to="/" />;
  if (allowedRole && user.role !== allowedRole) return <Navigate to="/" />;
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dealer/*" element={
        <ProtectedRoute allowedRole="dealer">
          <DealerDashboard />
        </ProtectedRoute>
      } />
      <Route path="/client/*" element={
        <ProtectedRoute allowedRole="client">
          <ClientDashboard />
        </ProtectedRoute>
      } />
      <Route path="/financial/*" element={
        <ProtectedRoute allowedRole="financial">
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
