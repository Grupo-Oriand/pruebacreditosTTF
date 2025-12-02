import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Car, ArrowRight, Mail, Lock, User, Phone, Building2, AlertCircle } from 'lucide-react';
import { authenticateUser } from '../data/mockUsers';

const Login = () => {
  const { login, clients } = useApp();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    fullName: '',
    phone: '',
    companyName: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Limpiar error al escribir
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLogin) {
      // 1. Intentar autenticar con usuarios mock (Dealer, Bancos, etc.)
      const mockUser = authenticateUser(formData.username, formData.password);

      if (mockUser) {
        login(mockUser.role, mockUser.fullName);
        switch (mockUser.role) {
          case 'dealer': navigate('/dealer'); break;
          case 'client': navigate('/client'); break;
          case 'financial': navigate('/financial'); break;
          default: navigate('/dealer');
        }
        return;
      }

      // 2. Si no es mock, buscar en la lista de clientes registrados por el dealer
      // Aseguramos que clients exista y sea un array antes de buscar
      const clientList = clients || [];
      const foundClient = clientList.find(c =>
        c.username === formData.username && c.password === formData.password
      );

      if (foundClient) {
        // Es un cliente registrado dinámicamente
        login('client', foundClient.name);
        navigate('/client');
        return;
      }

      // 3. Si no se encuentra en ninguno
      setError('Usuario o contraseña incorrectos');
    } else {
      // Lógica de registro - siempre registra como concesionario
      console.log('Registrando concesionario:', formData);
      login('dealer', formData.fullName);
      navigate('/dealer');
    }
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

        {/* Toggle entre Login y Registro */}
        <div className="flex gap-2 mb-6 p-1 bg-dark-bg rounded-xl border border-dark-border">
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all ${isLogin
              ? 'bg-primary-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-slate-300'
              }`}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all ${!isLogin
              ? 'bg-primary-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-slate-300'
              }`}
          >
            Registrarse
          </button>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-400">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isLogin ? (
            // Formulario de Inicio de Sesión
            <>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Usuario</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    name="username"
                    className="input-field pl-12"
                    placeholder="Ingresa tu usuario"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    name="password"
                    className="input-field pl-12"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="flex items-center justify-between text-sm pt-2">
                <label className="flex items-center text-slate-400 cursor-pointer">
                  <input type="checkbox" className="mr-2 rounded border-dark-border bg-dark-bg" />
                  Recordarme
                </label>
                <a href="#" className="text-primary-500 hover:text-primary-400 transition-colors">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </>
          ) : (
            // Formulario de Registro de Concesionario
            <>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Nombre Completo</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    name="fullName"
                    className="input-field pl-12"
                    placeholder="Juan Pérez"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Nombre del Concesionario</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    name="companyName"
                    className="input-field pl-12"
                    placeholder="AutoVentas S.A."
                    value={formData.companyName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Correo Electrónico</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    className="input-field pl-12"
                    placeholder="correo@ejemplo.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Teléfono</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="tel"
                    name="phone"
                    className="input-field pl-12"
                    placeholder="+57 300 123 4567"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    name="password"
                    className="input-field pl-12"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </>
          )}

          <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 mt-6">
            {isLogin ? 'Ingresar al Sistema' : 'Crear Cuenta'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
