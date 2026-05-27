"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Box,
  Avatar,
} from "@mui/material";
import { useAuth } from "@/hooks/useAuth";
import { useLocationTracker } from "@/hooks/useLocationTracker";
import { useShiftNotification } from "@/hooks/useShiftNotification";
import { ShiftNotificationBanner } from "@/components/ShiftNotificationBanner";

interface AppLayoutProps {
  children: React.ReactNode;
  currentPage?: string;
  showBottomNav?: boolean;
  showAppBar?: boolean;
}

export default function AppLayout({
  children,
  currentPage = "dashboard",
  showBottomNav = true,
  showAppBar = true,
}: AppLayoutProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [bottomNavValue, setBottomNavValue] = useState(currentPage);
  const router = useRouter();

  const { user, logout } = useAuth();
  useLocationTracker();
  const userId = user?.id || user?._id;
  const { pending: shiftNotification, dismiss: dismissNotification } = useShiftNotification(userId);
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      subtitle: "Panel principal",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
        </svg>
      ),
      href: "/dashboard",
    },
    {
      id: "work",
      label: "Trabajo",
      subtitle: "Registrar contactos",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
        </svg>
      ),
      href: "/work",
    },
    {
      id: "search-shifts",
      label: "Turnos",
      subtitle: "Encuentra turnos disponibles",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
        </svg>
      ),
      href: "/search-shifts",
    },
    {
      id: "performance",
      label: "Rendimiento",
      subtitle: "Estadísticas y progreso",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
        </svg>
      ),
      href: "/performance",
    },
    {
      id: "profile",
      label: "Mi Perfil",
      subtitle: "Configurar Perfil",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8V21h19.2v-1.8c0-3.2-6.4-4.8-9.6-4.8z" />
        </svg>
      ),
      href: "/profile",
    },
    {
      id: "logout",
      label: "Cerrar Sesión",
      subtitle: "Salir de la cuenta",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 13v-2H7V8l-5 4 5 4v-3h9zm3-10H5c-1.1 0-2 .9-2 2v6h2V5h14v14H5v-6H3v6c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
        </svg>
      ),
      href: "/login",
    },
  ];

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleBottomNavChange = (event: any, newValue: string) => {
    setBottomNavValue(newValue);
    const item = menuItems.find((item) => item.id === newValue);
    if (item) {
      router.push(item.href);
    }
  };

  const handleMenuItemClick = (item: any) => {
    if (item.id === "logout") {
      logout();
      window.location.href = "/login";
      return;
    }
    setDrawerOpen(false);
    router.push(item.href);
  };

  return (
    <div className="app-layout">
      {/* Shift assignment notification */}
      <ShiftNotificationBanner
        notification={shiftNotification}
        onDismiss={dismissNotification}
      />
      {/* Hamburger Menu Button */}
      <div className="hamburger-container">
        <button className="hamburger-menu" onClick={handleDrawerToggle}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
          </svg>
        </button>
      </div>

      {/* Sidebar Overlay */}
      <div
        className={`sidebar-overlay ${drawerOpen ? "active" : ""}`}
        onClick={handleDrawerToggle}
      >
        <div className="sidebar-panel" onClick={(e) => e.stopPropagation()}>
          {/* Sidebar Header */}
          <div className="sidebar-header">
            <div className="sidebar-logo">
              <img
                src="/logo.png"
                alt="Logo"
                width="24"
                height="24"
                style={{ fill: "#e91e63" }}
              />
              <span className="sidebar-logo-text">
                sweeps<strong>TOUCH</strong>
              </span>
            </div>
            <button className="sidebar-close" onClick={handleDrawerToggle}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#e91e63">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
          </div>

          {/* Sidebar Menu */}
          <div className="sidebar-menu">
            {menuItems.map((item) => (
              <button
                key={item.id}
                className={`sidebar-menu-item ${
                  currentPage === item.id ? "active" : ""
                }`}
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

      {/* Main Content */}
      <div className="app-content">{children}</div>

      {/* Bottom Navigation */}
      {showBottomNav && (
        <Paper
          elevation={3}
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            p: 1,
            borderRadius: "0 0",
            borderTop: "1px solid #eee",
            display: "flex",
            alignItems: "center",
          }}
        >
          <BottomNavigation
            showLabels
            value={bottomNavValue}
            onChange={handleBottomNavChange}
            sx={{ flex: 1, px: 1 }}
          >
            {menuItems.slice(0, 4).map((item) => (
              <BottomNavigationAction
                key={item.id}
                label={item.label}
                icon={item.icon}
                value={item.id}
                sx={{
                  color: bottomNavValue === item.id ? "#ff0aa2" : "gray",
                  borderRadius: "16px",
                  px: 2,
                  py: 0.5,
                  backgroundColor:
                    bottomNavValue === item.id ? "#ffe1ef" : "transparent",
                  minWidth: 70,
                  mx: 1,
                }}
              />
            ))}
          </BottomNavigation>

          {/* Avatar at end (moved outside BottomNavigation to fix 'showLabel' prop DOM warning) */}
          <Box sx={{ px: 1, pt: 0.5 }}>
            <Avatar
              src="https://cdn-icons-png.flaticon.com/512/869/869869.png"
              sx={{
                width: 32,
                height: 32,
                border: "2px solid #fff",
                boxShadow: "0 0 0 2px #ff0aa2",
              }}
            />
          </Box>
        </Paper>
      )}
    </div>
  );
}
