import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import AuthProvider from './context/AuthContext.tsx'
import { QueryProvider } from './lib/react-query/QueryProvider.tsx'
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryProvider>
        <AuthProvider>
          <App />
          <Analytics />
          <SpeedInsights />
        </AuthProvider>
      </QueryProvider>
    </BrowserRouter>
  </React.StrictMode>
)
