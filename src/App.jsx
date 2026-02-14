import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ConfirmProvider } from 'material-ui-confirm'

import LoginPage from './pages/login/LoginPage'
import RegisterDelegatePage from './pages/registerDelegate/RegisterDelegate'
import HomePage from './pages/HomePage'

import Header from './generalComponents/Header'
import { PrivateRoute, PublicRoute } from './generalComponents/Routes'
import { AuthProvider, useAuth } from './contexts/AuthContex'
import AppTheme from './shared-theme/AppTheme'
import { NotificationProvider } from './contexts/NotificationContext'
import DelegatesListPageAdmin from './pages/delegatesList/DelegatesListPageAdmin'


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
          path="/iniciar-sesion"
          element={<PublicRoute element={<LoginPage />} />}
        />

        <Route
          path="/registrar-delegado"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <RegisterDelegatePage />
            </PrivateRoute>
          }
        />

        {/* 🔒 Rutas privadas */}
        <Route
          path="/lista-delegados-admin"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <DelegatesListPageAdmin />
            </PrivateRoute>
          }
        />

         <Route
          path="/lista-delegados-jr"
          element={
            <PrivateRoute allowedRoles={['jefe_recinto']}>
              <DelegatesListPageAdmin />
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
          <NotificationProvider>
            <ConfirmProvider>
              <AppContent />
            </ConfirmProvider>
          </NotificationProvider>
        </BrowserRouter>
      </AuthProvider>
    </AppTheme>
  )
}

export default App
