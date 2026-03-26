import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

// Icones SVG inline para evitar dependencias externas
const icons = {
  dashboard: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
    </svg>
  ),
  vendedores: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
    </svg>
  ),
  despesas: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z" />
    </svg>
  ),
  receitas: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
    </svg>
  ),
  socios: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  ),
  eventos: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z" />
    </svg>
  ),
  contas: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
    </svg>
  ),
  fluxo: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z" />
    </svg>
  ),
  lotes: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 10V6c0-1.11-.9-2-2-2H4c-1.1 0-1.99.89-1.99 2v4c1.1 0 1.99.9 1.99 2s-.89 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2s.9-2 2-2zm-2-1.46c-1.19.69-2 1.99-2 3.46s.81 2.77 2 3.46V18H4v-2.54c1.19-.69 2-1.99 2-3.46 0-1.48-.8-2.77-1.99-3.46L4 6h16v2.54zM11 15h2v2h-2zm0-4h2v2h-2zm0-4h2v2h-2z" />
    </svg>
  ),
  equipamentos: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z" />
    </svg>
  ),
  menu: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
    </svg>
  ),
};

const menuItems = [
  { path: '/', label: 'Dashboard', icon: 'dashboard' },
  { path: '/vendedores', label: 'Vendedores', icon: 'vendedores' },
  { path: '/despesas', label: 'Despesas', icon: 'despesas' },
  { path: '/receitas', label: 'Receitas', icon: 'receitas' },
  { path: '/socios', label: 'Socios', icon: 'socios' },
  { path: '/eventos', label: 'Eventos', icon: 'eventos' },
  { path: '/contas', label: 'Contas', icon: 'contas' },
  { path: '/fluxo-caixa', label: 'Fluxo de Caixa', icon: 'fluxo' },
  { path: '/lotes', label: 'Lotes de Ingresso', icon: 'lotes' },
  { path: '/equipamentos', label: 'Equipamentos', icon: 'equipamentos' },
];

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#181a1b', // dark background
  },
  sidebar: {
    width: '280px',
    backgroundColor: '#23272a', // dark sidebar
    borderRight: '1px dashed rgba(99, 115, 129, 0.24)',
    padding: '24px 16px',
    position: 'fixed',
    height: '100vh',
    overflowY: 'auto',
    transition: 'all 0.3s ease',
    zIndex: 1000,
  },
  sidebarCollapsed: {
    transform: 'translateX(-100%)',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px 16px',
    marginBottom: '24px',
  },
  logoIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #23272a 0%, #181a1b 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#5BE49B',
    fontWeight: 700,
    fontSize: '18px',
  },
  logoText: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#f4f6f8',
    letterSpacing: '-0.5px',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '10px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    color: '#b0b8c1',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    fontSize: '14px',
    fontWeight: 500,
  },
  navItemActive: {
    backgroundColor: 'rgba(91, 228, 155, 0.12)',
    color: '#5BE49B',
  },
  navItemHover: {
    backgroundColor: 'rgba(99, 115, 129, 0.16)',
  },
  main: {
    flex: 1,
    marginLeft: '280px',
    minHeight: '100vh',
    backgroundColor: '#181a1b',
    color: '#f4f6f8',
    transition: 'margin-left 0.3s ease',
  },
  mainExpanded: {
    marginLeft: 0,
  },
  header: {
    height: '64px',
    backgroundColor: 'rgba(35, 39, 42, 0.95)',
    backdropFilter: 'blur(6px)',
    borderBottom: '1px dashed rgba(99, 115, 129, 0.24)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  menuButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#b0b8c1',
    transition: 'background-color 0.2s',
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#b0b8c1',
  },
  breadcrumbActive: {
    color: '#f4f6f8',
    fontWeight: 600,
  },
  content: {
    padding: '24px',
    maxWidth: '1400px',
    margin: '0 auto',
    backgroundColor: '#23272a',
    borderRadius: '12px',
    color: '#f4f6f8',
  },
};

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [hoveredItem, setHoveredItem] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const currentPage = menuItems.find((item) => item.path === location.pathname);

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside
        style={{
          ...styles.sidebar,
          ...(sidebarOpen ? {} : styles.sidebarCollapsed),
        }}
      >
        <div style={styles.logo}>
          <div style={styles.logoIcon}>T</div>
          <span style={styles.logoText}>Ticomia</span>
        </div>

        <nav style={styles.nav}>
          {menuItems.map((item) => (
            <div
              key={item.path}
              onClick={() => navigate(item.path)}
              onMouseEnter={() => setHoveredItem(item.path)}
              onMouseLeave={() => setHoveredItem(null)}
              style={{
                ...styles.navItem,
                ...(location.pathname === item.path ? styles.navItemActive : {}),
                ...(hoveredItem === item.path && location.pathname !== item.path
                  ? styles.navItemHover
                  : {}),
              }}
            >
              {icons[item.icon]}
              <span>{item.label}</span>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main
        style={{
          ...styles.main,
          ...(sidebarOpen ? {} : styles.mainExpanded),
        }}
      >
        {/* Header */}
        <header style={styles.header}>
          <div style={styles.headerLeft}>
            <button
              style={styles.menuButton}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              onMouseEnter={(e) => (e.target.style.backgroundColor = 'rgba(145, 158, 171, 0.08)')}
              onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
            >
              {icons.menu}
            </button>
            <div style={styles.breadcrumb}>
              <span>Ticomia</span>
              <span>/</span>
              <span style={styles.breadcrumbActive}>{currentPage?.label || 'Dashboard'}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div style={styles.content}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
