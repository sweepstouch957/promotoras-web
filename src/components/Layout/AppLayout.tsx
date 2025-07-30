'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AppLayoutProps {
  children: React.ReactNode;
  currentPage?: string;
  showBottomNav?: boolean;
  showAppBar?: boolean;
}

export default function AppLayout({ 
  children, 
  currentPage = 'dashboard',
  showBottomNav = true,
  showAppBar = true 
}: AppLayoutProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [bottomNavValue, setBottomNavValue] = useState(currentPage);
  const router = useRouter();

  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      subtitle: 'Panel principal', 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
        </svg>
      ),
      href: '/dashboard'
    },
    { 
      id: 'search-shifts', 
      label: 'Buscar Turnos', 
      subtitle: 'Encuentra turnos disponibles', 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
      ),
      href: '/search-shifts'
    },
    { 
      id: 'performance', 
      label: 'Rendimiento', 
      subtitle: 'Estadísticas y progreso', 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
        </svg>
      ),
      href: '/performance'
    },
    { 
      id: 'profile', 
      label: 'Mi Perfil', 
      subtitle: 'Configurar Perfil', 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8V21h19.2v-1.8c0-3.2-6.4-4.8-9.6-4.8z"/>
</svg>

      ),
      href: '/profile'
    },
  ];

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleBottomNavChange = (newValue: string) => {
    setBottomNavValue(newValue);
    const item = menuItems.find(item => item.id === newValue);
    if (item) {
      router.push(item.href);
    }
  };

  const handleMenuItemClick = (item: any) => {
    setDrawerOpen(false);
    router.push(item.href);
  };

  return (
    <div className="app-layout">
      {/* Hamburger Menu Button */}
      <div className="hamburger-container">
        <button className="hamburger-menu" onClick={handleDrawerToggle}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
          </svg>
        </button>
      </div>

      {/* Sidebar Overlay */}
      {drawerOpen && (
        <div className="sidebar-overlay" onClick={handleDrawerToggle}>
          <div className="sidebar-panel" onClick={(e) => e.stopPropagation()}>
            {/* Sidebar Header */}
            <div className="sidebar-header">
              <div className="sidebar-logo">
                
  <img 
    src="/logo.png" 
    alt="Logo" 
    width="24" 
    height="24" 
    style={{ fill: '#e91e63' }} // Nota: solo aplica si el PNG es monocromo transparente
  />

                <span className="sidebar-logo-text">sweeps<strong>TOUCH</strong></span>
              </div>
              <button className="sidebar-close" onClick={handleDrawerToggle}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#e91e63">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>

            {/* Sidebar Menu */}
            <div className="sidebar-menu">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  className={`sidebar-menu-item ${currentPage === item.id ? 'active' : ''}`}
                  onClick={() => handleMenuItemClick(item)}
                >
                  <div className="sidebar-menu-icon">{item.icon}</div>
                  <div className="sidebar-menu-content">
                    <div className="sidebar-menu-label">{item.label}</div>
                    <div className="sidebar-menu-subtitle">{item.subtitle}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="app-content">
        {children}
      </div>

      {/* Bottom Navigation */}
      {showBottomNav && (
        <div className="bottom-navigation">
          <div className="bottom-nav-container navbar-fixed-position">
            <button
              className={`bottom-nav-item ${bottomNavValue === 'dashboard' ? 'active' : ''}`}
              onClick={() => handleBottomNavChange('dashboard')}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
              <span>Dashboard</span>
            </button>
            <button
              className={`bottom-nav-item ${bottomNavValue === 'search-shifts' ? 'active' : ''}`}
              onClick={() => handleBottomNavChange('search-shifts')}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
              <span>Turnos</span>
            </button>
            <button
              className={`bottom-nav-item ${bottomNavValue === 'performance' ? 'active' : ''}`}
              onClick={() => handleBottomNavChange('performance')}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
              </svg>
              <span>Rendimiento</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

