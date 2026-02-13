import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/login/LoginPage'
import RegisterDelegatePage from './pages/RegisterDelegate/RegisterDelegate'
import DelegatesListPage from './pages/delegatesList/DelegatesList'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/registrar-delegado" element={<RegisterDelegatePage />} />
        <Route path="/lista-delegados" element={<DelegatesListPage />} />
        <Route path="*" element={<div>404</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
