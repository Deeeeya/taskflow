import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'

function App() {
  return (
    // BrowserRouter wraps the entire app and enables routing, like a traffic controller
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>Home</div>} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/dashboard' element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App