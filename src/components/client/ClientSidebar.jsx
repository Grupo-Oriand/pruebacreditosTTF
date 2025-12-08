import React from 'react';
import { LogOut, User, FileText, FileStack, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const NavButton = ({ active, onClick, icon, label }) => (
  <Button
    variant="ghost"
    onClick={onClick}
    className={cn(
      "w-full justify-start gap-3",
      active && "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
    )}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </Button>
);

export const ClientSidebar = ({ currentClient, activeTab, setActiveTab, onLogout }) => {
  return (
    <div className="w-80 border-r bg-card flex flex-col">
      {/* Profile Header */}
      <div className="p-8 flex flex-col items-center text-center border-b">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center mb-4 shadow-lg">
          <span className="text-3xl font-bold text-primary-foreground">
            {currentClient.name.charAt(0)}
          </span>
        </div>
        <h2 className="text-xl font-bold mb-1">{currentClient.name}</h2>
        <p className="text-sm text-muted-foreground">{currentClient.email}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6 space-y-2">
        <NavButton
          active={activeTab === 'profile'}
          onClick={() => setActiveTab('profile')}
          icon={<User className="w-5 h-5" />}
          label="Mi Perfil"
        />
        <NavButton
          active={activeTab === 'requests'}
          onClick={() => setActiveTab('requests')}
          icon={<FileText className="w-5 h-5" />}
          label="Mis Solicitudes"
        />
        <NavButton
          active={activeTab === 'documents'}
          onClick={() => setActiveTab('documents')}
          icon={<FileStack className="w-5 h-5" />}
          label="Mis Documentos"
        />
        <NavButton
          active={activeTab === 'history'}
          onClick={() => setActiveTab('history')}
          icon={<History className="w-5 h-5" />}
          label="Historial de Solicitudes"
        />
      </nav>
    </div>
  );
};
