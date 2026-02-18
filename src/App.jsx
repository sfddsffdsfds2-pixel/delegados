import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ConfirmProvider } from 'material-ui-confirm'

import LoginPage from './pages/login/LoginPage'
import RegisterDelegatePage from './pages/registerDelegate/RegisterDelegatePage'
import EditDelegatePage from './pages/editDelegate/EditDelegatePage'
import HomePage from './pages/HomePage'

import Header from './generalComponents/Header'
import { PrivateRoute, PublicRoute } from './generalComponents/Routes'
import { AuthProvider } from './contexts/AuthContex'
import AppTheme from './shared-theme/AppTheme'
import { NotificationProvider } from './contexts/NotificationContext'
import DelegatesListPageAdmin from './pages/delegatesList/DelegatesListPageAdmin'
import NotFoundPage from './generalComponents/NotFoundPage'
import DelegatesListPageJR from './pages/delegatesList/DelegatesListPageJR'


/* Contenido principal */
const AppContent = () => {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/"
          element={<PublicRoute element={<HomePage />} />}
        />

        <Route
          path="/iniciar-sesion"
          element={<PublicRoute element={<LoginPage />} />}
        />

        <Route
          path="/registrar-delegado"
          element={
            <PrivateRoute allowedRoles={['admin', 'super_admin']}>
              <RegisterDelegatePage />
            </PrivateRoute>
          }
        />

        <Route
          path="/editar-delegado/:ci"
          element={
            <PrivateRoute allowedRoles={['admin', 'super_admin']}>
              <EditDelegatePage />
            </PrivateRoute>
          }
        />

        {/* 🔒 Rutas privadas */}
        <Route
          path="/lista-delegados-admin"
          element={
            <PrivateRoute allowedRoles={['admin', 'super_admin']}>
              <DelegatesListPageAdmin />
            </PrivateRoute>
          }
        />
 
        <Route
          path="/lista-delegados-jr"
          element={
            <PrivateRoute allowedRoles={['jefe_recinto', 'super_admin']}>
              <DelegatesListPageJR />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<NotFoundPage message='Página no encontrada' showButton={true} />} />
      </Routes>
    </>
  )
}


function App() {
  return (
    <AppTheme mode="dark">
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
