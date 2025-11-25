import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Car, Building2, Users, ArrowRight } from 'lucide-react';

const Login = () => {
  const { login } = useApp();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('dealer');

  const handleLogin = (e) => {
    e.preventDefault();
    login(selectedRole, 'Demo User');
    if (selectedRole === 'dealer') navigate('/dealer');
    if (selectedRole === 'client') navigate('/client');
    if (selectedRole === 'financial') navigate('/financial');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1920')] bg-cover bg-center relative">
      <div className="absolute inset-0 bg-dark-bg/80 backdrop-blur-sm"></div>
      
      <div className="relative z-10 w-full max-w-md p-8 glass-panel rounded-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-500/20 mb-4">
            <Car className="w-8 h-8 text-primary-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">AutoCredit Pro</h1>
          <p className="text-slate-400">Sistema de Gestión de Créditos</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="grid grid-cols-3 gap-2 mb-6">
            <button
              type="button"
              onClick={() => setSelectedRole('dealer')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${selectedRole === 'dealer' ? 'bg-primary-600 border-primary-500 text-white' : 'bg-dark-bg border-dark-border text-slate-400 hover:border-slate-500'}`}
            >
              <Building2 className="w-6 h-6" />
              <span className="text-xs font-medium">Concesionario</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('client')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${selectedRole === 'client' ? 'bg-primary-600 border-primary-500 text-white' : 'bg-dark-bg border-dark-border text-slate-400 hover:border-slate-500'}`}
            >
              <Users className="w-6 h-6" />
              <span className="text-xs font-medium">Cliente</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('financial')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${selectedRole === 'financial' ? 'bg-primary-600 border-primary-500 text-white' : 'bg-dark-bg border-dark-border text-slate-400 hover:border-slate-500'}`}
            >
              <Building2 className="w-6 h-6" />
              <span className="text-xs font-medium">Financiera</span>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Usuario</label>
              <input type="text" className="input-field" placeholder="admin" defaultValue="admin" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Contraseña</label>
              <input type="password" className="input-field" placeholder="••••••••" defaultValue="password" />
            </div>
          </div>

          <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
            Ingresar al Sistema
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
