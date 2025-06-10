import { BrowserRouter, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import AppRoutes from './routes';

import { ToastContainer } from 'react-toastify';
import PageContainer from './components/layout/PageContainer';
import { DashBordProvider } from './context/DashBoardContext';
import { SmartSheetProvider } from './context/SmartSheetContext';
import { ProfileProvider } from './context/ProfileContext';
import { useEffect } from 'react';
import { NetworkProvider } from './context/NetworkContext';
import { UpsolveProvider } from './context/UpsolveContext';
import { StumbleProvider } from './context/StumbleContext';
import ConceptsProvider from './context/ConceptsContext';

const ScrollToTopOnNewPage = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ProfileProvider>
        <ThemeProvider>
          <AuthProvider>
            <DashBordProvider>
              <SmartSheetProvider>
                <NetworkProvider>
                  <UpsolveProvider>
                    <StumbleProvider>
                      <ConceptsProvider>
                        <PageContainer>
                          <ScrollToTopOnNewPage />
                          <AppRoutes />
                          <ToastContainer
                            autoClose={1500}
                          />
                        </PageContainer>
                      </ConceptsProvider>
                    </StumbleProvider>
                  </UpsolveProvider>
                </NetworkProvider>
              </SmartSheetProvider>
            </DashBordProvider>
          </AuthProvider>
        </ThemeProvider>
      </ProfileProvider>
    </BrowserRouter>
  );
}

export default App;