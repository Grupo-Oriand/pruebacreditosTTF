import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Login from './pages/Login';
import ApprovedSummary from './pages/client/ApprovedSummary';
import DealerDashboard from './pages/dealer/DealerDashboard';
import ClientDashboard from './pages/client/ClientDashboard';
import FinancialDashboard from './pages/financial/FinancialDashboard';
import DevPanel from './components/DevPanel';

// Protected route component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useApp();
  if (!user) return <Navigate to="/" />;

  if (Array.isArray(allowedRoles)) {
    if (!allowedRoles.includes(user.role)) return <Navigate to="/" />;
  } else if (allowedRoles && user.role !== allowedRoles) {
    return <Navigate to="/" />;
  }
  return children;
};

// Application routes
const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/dealer/*" element={
      <ProtectedRoute allowedRoles={['dealer', 'dealer_manager', 'seller']}>
        <DealerDashboard />
      </ProtectedRoute>
    } />
    <Route path="/client/approved/:requestId" element={
      <ProtectedRoute allowedRoles={['client']}>
        <ApprovedSummary />
      </ProtectedRoute>
    } />
    <Route path="/client" element={
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

function App() {
  return (
    <AppProvider>
      <Router>
        <AppRoutes />
        <DevPanel />
      </Router>
    </AppProvider>
  );
}

export default App;
