import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ThemeProvider from './Contexts/ThemeContext/ThemeProvider.jsx'
import AuthProvider from './Contexts/AuthContext/AuthProvider.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Create a single QueryClient instance for the app
const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(

  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
      <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
    </ThemeProvider>
    </AuthProvider>
  </StrictMode>,
)


// github: https://github.com/Programming-Hero-Web-Course4/b11a12-client-side-sowmitraguho