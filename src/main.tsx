import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import App from './App'
import PublicDisplay from './pages/PublicDisplay'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/public" element={<PublicDisplay />} />
        <Route path="/*" element={<App />} />
      </Routes>
    </Router>
  </StrictMode>,
)