import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ThemeProvider from './Contexts/ThemeContext/ThemeProvider.jsx'
import AuthProvider from './Contexts/AuthContext/AuthProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
      <App />
    </ThemeProvider>
    </AuthProvider>
  </StrictMode>,
)


// github: https://github.com/Programming-Hero-Web-Course4/b11a12-client-side-sowmitraguho