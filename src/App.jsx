import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/login/LoginPage'
import RegisterDelegatePage from './pages/registerDelegate/RegisterDelegate';
import DelegatesListPage from './pages/delegatesList/DelegatesListPage'
import { ConfirmProvider } from 'material-ui-confirm';
import HomePage from './pages/HomePage'
import Header from './generalComponents/Header'
import { AuthProvider } from './contexts/AuthContex'
import AppTheme from './shared-theme/AppTheme'
import { Toolbar } from '@mui/material'

function App() {
  return (
    <AppTheme>
      <AuthProvider>
        <BrowserRouter>
          <ConfirmProvider>
            <Header />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/iniciar-sesión" element={<LoginPage />} />
              <Route path="/registrar-delegado" element={<RegisterDelegatePage />} />
              <Route path="/lista-delegados" element={<DelegatesListPage />} />
              <Route path="*" element={<div>404</div>} />
            </Routes>
          </ConfirmProvider>
        </BrowserRouter>
      </AuthProvider>
    </AppTheme>
  )
}

export default App
