import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import './tailwind.css'
import HomePage from './HomePage.jsx'
import WatchContent from './WatchContent.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/video" element={<WatchContent />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
