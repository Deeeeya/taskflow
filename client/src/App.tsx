import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import RegisterPage from './pages/RegisterPage'
import AuthProvider from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    // BrowserRouter wraps the entire app and enables routing, like a traffic controller
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<div>Home</div>} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/dashboard' element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App