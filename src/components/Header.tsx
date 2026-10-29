import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Bell,
  Volume2,
  VolumeX,
  Palmtree,
  Cloud,
  RefreshCw,
  LogOut,
  User as UserIcon,
  Check,
  Music
} from 'lucide-react';
import { playSound } from '../utils/audio';
import { User } from '../lib/firebase';

export type NavTab = 'inicio' | 'pasaporte' | 'vecinos' | 'capturopedia' | 'wiki' | 'catalogo' | 'galeria';

interface HeaderProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenNotifications: () => void;
  onOpenProjectK?: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  hasNotificationsBadge: boolean;
  onReplayTutorial: () => void;
  currentUser: User | null;
  isSyncing: boolean;
  lastSyncTime: Date | null;
  onSignInGoogle: () => void;
  onSignOut: () => void;
  onManualSync: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenNotifications,
  onOpenProjectK,
  soundEnabled,
  setSoundEnabled,
  hasNotificationsBadge,
  onReplayTutorial,
  currentUser,
  isSyncing,
  lastSyncTime,
  onSignInGoogle,
  onSignOut,
  onManualSync
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const navItems: { id: NavTab; label: string }[] = [
    { id: 'inicio', label: 'Inicio' },
    { id: 'pasaporte', label: 'Pasaporte' },
    { id: 'vecinos', label: 'Mis Vecinos' },
    { id: 'capturopedia', label: 'Capturopedia' },
    { id: 'wiki', label: 'Aldeanopedia' },
    { id: 'catalogo', label: 'Catálogo & Arte' },
    { id: 'galeria', label: 'Galería' }
  ];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTabClick = (tab: NavTab) => {
    if (soundEnabled) playSound('pop');
    setActiveTab(tab);
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (next) playSound('bell');
  };

  const formatLastSync = (date: Date | null) => {
    if (!date) return 'Sin sincronizar aún';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF6F0]/95 backdrop-blur-md border-b border-[#E4D8C8]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 sm:gap-6 h-16">
          {/* Brand Wordmark */}
          <button
            onClick={() => handleTabClick('inicio')}
            className="flex items-center gap-2 sm:gap-2.5 text-left text-base sm:text-lg font-bold tracking-tight text-[#3C342C] whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-[#489D6C] text-[#FAF6F0] flex items-center justify-center shadow-xs">
              <Palmtree className="w-4 h-4" />
            </div>
            <span className="font-heading tracking-wide">NookHub</span>
          </button>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-6 text-sm font-medium text-[#7A6F64]">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`relative py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    isActive
                      ? 'text-[#489D6C] font-semibold'
                      : 'hover:text-[#3C342C]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#489D6C] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Cluster: Cloud Sync, Google Sign In, Notifications, Sound, Settings */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Cloud Sync Status / Google Auth */}
            {currentUser ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => {
                    if (soundEnabled) playSound('pop');
                    setIsProfileOpen(!isProfileOpen);
                  }}
                  className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1 rounded-full border border-[#D5C7B5] bg-[#FCFAF6] hover:bg-[#F0E8DC] transition-colors cursor-pointer shadow-2xs"
                  title="Gestionar cuenta de Google y respaldo en la nube"
                >
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || 'Usuario'}
                      className="w-6 h-6 rounded-full object-cover border border-[#489D6C]"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-[#489D6C] text-[#FAF6F0] flex items-center justify-center text-xs font-bold">
                      {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 'U'}
                    </div>
                  )}

                  <span className="hidden md:inline-block text-xs font-medium text-[#3C342C] max-w-[90px] truncate">
                    {currentUser.displayName || 'Isleño'}
                  </span>

                  {isSyncing ? (
                    <RefreshCw className="w-3.5 h-3.5 text-[#489D6C] animate-spin" />
                  ) : (
                    <div className="flex items-center gap-0.5 text-[#489D6C]" title="Sincronizado con la nube">
                      <Cloud className="w-3.5 h-3.5" />
                      <Check className="w-2.5 h-2.5 -ml-1 text-[#489D6C]" />
                    </div>
                  )}
                </button>

                {/* Profile & Sync Popover */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-[#E4D8C8] bg-[#FAF6F0] p-4 shadow-xl z-50 text-xs text-[#3C342C] space-y-3">
                    <div className="flex items-center gap-3 pb-3 border-b border-[#E4D8C8]">
                      {currentUser.photoURL ? (
                        <img
                          src={currentUser.photoURL}
                          alt="Avatar"
                          className="w-10 h-10 rounded-full object-cover border border-[#489D6C]"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#489D6C] text-[#FAF6F0] flex items-center justify-center font-bold">
                          {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 'U'}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-sm truncate">{currentUser.displayName || 'Isleño'}</p>
                        <p className="text-[11px] text-[#7A6F64] truncate">{currentUser.email}</p>
                      </div>
                    </div>

                    <div className="bg-[#FCFAF6] p-2.5 rounded-xl border border-[#E4D8C8]/60 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#7A6F64] flex items-center gap-1.5">
                          <Cloud className="w-3.5 h-3.5 text-[#489D6C]" />
                          Nube de NookHub
                        </span>
                        <span className="font-semibold text-[#489D6C]">
                          {isSyncing ? 'Guardando...' : 'Conectado'}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#A89C8F]">
                        Último respaldo: {formatLastSync(lastSyncTime)}
                      </p>
                    </div>

                    <div className="pt-1 flex flex-col gap-2">
                      <button
                        onClick={() => {
                          if (soundEnabled) playSound('stamp');
                          onManualSync();
                          setIsProfileOpen(false);
                        }}
                        disabled={isSyncing}
                        className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#489D6C] hover:bg-[#3D855B] text-[#FAF6F0] font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                        <span>{isSyncing ? 'Guardando en la nube...' : 'Sincronizar ahora'}</span>
                      </button>

                      <button
                        onClick={() => {
                          if (soundEnabled) playSound('pop');
                          onSignOut();
                          setIsProfileOpen(false);
                        }}
                        className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-[#E4D8C8] bg-[#FAF6F0] hover:bg-[#F0E8DC] text-[#7A6F64] hover:text-[#C86343] font-medium transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Cerrar sesión</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => {
                  if (soundEnabled) playSound('nook');
                  onSignInGoogle();
                }}
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-full border border-[#D5C7B5] bg-[#FCFAF6] hover:bg-[#F0E8DC] text-[#3C342C] transition-all shadow-2xs cursor-pointer group"
                title="Inicia sesión con Google para sincronizar tus datos insulares"
              >
                {/* Google Logo SVG */}
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span className="hidden sm:inline">Iniciar con Google</span>
                <span className="sm:hidden text-[11px]">Google</span>
              </button>
            )}

            {/* Sound toggle */}
            <button
              onClick={toggleSound}
              title={soundEnabled ? 'Silenciar efectos de sonido' : 'Activar efectos de sonido'}
              className="p-1.5 sm:p-2 text-[#7A6F64] hover:text-[#3C342C] hover:bg-[#F0E8DC] rounded-lg transition-colors cursor-pointer"
              aria-label="Alternar sonido"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-[#489D6C]" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Notification & Events trigger */}
            <button
              onClick={() => {
                if (soundEnabled) playSound('bell');
                onOpenNotifications();
              }}
              className="relative p-1.5 sm:p-2 text-[#7A6F64] hover:text-[#3C342C] hover:bg-[#F0E8DC] rounded-lg transition-colors cursor-pointer"
              aria-label="Ver eventos y cumpleaños de hoy"
            >
              <Bell className="w-4 h-4" />
              {hasNotificationsBadge && (
                <span className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 w-2 h-2 bg-[#C86343] rounded-full ring-2 ring-[#FAF6F0]" />
              )}
            </button>

            {/* Project K trigger */}
            {onOpenProjectK && (
              <button
                onClick={() => {
                  if (soundEnabled) playSound('stamp');
                  onOpenProjectK();
                }}
                title="Lista de Tareas para Conseguir a Totakeke (Proyecto K)"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-full border border-[#E6B84A]/60 bg-[#FCFAF6] hover:bg-[#FDF8EE] text-[#3C342C] transition-colors cursor-pointer shadow-2xs"
              >
                <Music className="w-3.5 h-3.5 text-[#E6B84A]" />
                <span className="hidden sm:inline">Proyecto K</span>
              </button>
            )}

            {/* Tutorial launcher button */}
            <button
              onClick={() => {
                if (soundEnabled) playSound('nook');
                onReplayTutorial();
              }}
              title="Volver a ver el asistente de configuración"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#FAF6F0] bg-[#489D6C] hover:bg-[#3D855B] rounded-lg shadow-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ajustes</span>
            </button>
          </div>
        </div>

        {/* Mobile/Tablet Horizontal Scrolling Sub-Nav (also complemented by MobileBottomNav) */}
        <div className="lg:hidden flex items-center gap-2 overflow-x-auto py-2 border-t border-[#E4D8C8]/60 no-scrollbar">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`px-3 py-1 text-xs rounded-full whitespace-nowrap shrink-0 transition-colors ${
                  isActive
                    ? 'bg-[#489D6C] text-[#FAF6F0] font-medium shadow-xs'
                    : 'text-[#7A6F64] bg-[#F0E8DC] hover:text-[#3C342C]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
