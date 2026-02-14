import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ConfirmProvider } from 'material-ui-confirm'

import LoginPage from './pages/login/LoginPage'
import RegisterDelegatePage from './pages/registerDelegate/RegisterDelegate'
import DelegatesListPage from './pages/delegatesList/DelegatesListPage'
import HomePage from './pages/HomePage'

import Header from './generalComponents/Header'
import { PrivateRoute, PublicRoute} from './generalComponents/Routes'
import { AuthProvider, useAuth } from './contexts/AuthContex'
import AppTheme from './shared-theme/AppTheme'


/* Contenido principal */
const AppContent = () => {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={
            <HomePage />
        } />

        <Route
          path="/iniciar-sesión"
          element={<PublicRoute element={<LoginPage />} />}
        />

        <Route path="/registrar-delegado" element={<RegisterDelegatePage />} />

        {/* 🔒 Rutas privadas */}
        <Route
          path="/lista-delegados"
          element={
            <PrivateRoute>
              <DelegatesListPage />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<div>404</div>} />
      </Routes>
    </>
  )
}


function App() {
  return (
    <AppTheme>
      <AuthProvider>
        <BrowserRouter>
          <ConfirmProvider>
            <AppContent />
          </ConfirmProvider>
        </BrowserRouter>
      </AuthProvider>
    </AppTheme>
  )
}

export default App
