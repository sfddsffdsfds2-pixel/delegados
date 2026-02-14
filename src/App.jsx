import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/login/LoginPage'
import RegisterDelegatePage from './pages/RegisterDelegate/RegisterDelegate'
import DelegatesListPage from './pages/delegatesList/DelegatesListPage'
import { ConfirmProvider } from 'material-ui-confirm';
import HomePage from './pages/HomePage'
import Header from './generalComponents/Header'
import { Toolbar } from '@mui/material'
import { AuthProvider } from './contexts/AuthContex'

function App() {
  return (
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
  )
}

export default App
