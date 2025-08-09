import { createRoot } from 'react-dom/client'
import App from './App.minimal.tsx'
import "./index.css"

console.log('🚀 Starting LinkedIn Analytics App...')

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element not found')
}

createRoot(rootElement).render(<App />)