import { createMenuItems, useViewConfig } from '@vaadin/hilla-file-router/runtime.js';
import { effect, signal } from '@vaadin/hilla-react-signals';
import { AppLayout, DrawerToggle, Icon, SideNav, SideNavItem } from '@vaadin/react-components';
import { Suspense, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { useAuth, AuthProvider } from '../auth/AuthContext';

const documentTitleSignal = signal('');
effect(() => {
  document.title = documentTitleSignal.value;
});

// Publish for Vaadin to use
(window as any).Vaadin.documentTitleSignal = documentTitleSignal;

// Layout content component that uses auth context
function LayoutContent() {
  const currentTitle = useViewConfig()?.title;
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (currentTitle) {
      documentTitleSignal.value = currentTitle;
    }
  }, [currentTitle]);

  const menuItems = createMenuItems();
  
  // Style for disabled menu items
  const disabledStyle = {
    opacity: 0.5,
    pointerEvents: 'none' as const,
    cursor: 'not-allowed' as const
  };

  return (
    <AppLayout primarySection="drawer">
      <div slot="drawer" className="flex flex-col justify-between h-full p-m">
        <header className="flex flex-col gap-m">
          <span className="font-semibold text-l">World Rental Car</span>
          <SideNav onNavigate={({ path }) => navigate(path!)} location={location}>
            {menuItems.map(({ to, title, icon }) => (
              <SideNavItem 
                path={to} 
                key={to}
                style={!isAuthenticated && to !== '/' ? disabledStyle : {}}
                disabled={!isAuthenticated && to !== '/'}
                onClick={(e) => {
                  if (!isAuthenticated && to !== '/') {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }}
              >
                {icon ? <Icon src={icon} slot="prefix"></Icon> : <></>}
                {title}
                {!isAuthenticated && to !== '/' && (
                  <span style={{ marginLeft: '8px', fontSize: '0.8em', color: '#888' }}>
                    (Login required)
                  </span>
                )}
              </SideNavItem>
            ))}
          </SideNav>
          {loading && (
            <div className="text-center text-sm text-secondary">Loading authentication...</div>
          )}
          {!loading && !isAuthenticated && (
            <div className="text-center text-sm text-secondary mt-m">
              Please login to access all features
            </div>
          )}
        </header>
      </div>

      <DrawerToggle slot="navbar" aria-label="Menu toggle"></DrawerToggle>
      <h1 slot="navbar" className="text-l m-0">
        {documentTitleSignal}
      </h1>

      <Suspense>
        <Outlet />
      </Suspense>
    </AppLayout>
  );
}

// Main Layout component with AuthProvider
export default function MainLayout() {
  return (
    <AuthProvider>
      <LayoutContent />
    </AuthProvider>
  );
}