import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.jsx'
import ButtonShowcase from './components/common/ButtonShowCase.jsx'

createRoot(document.getElementById('root')).render(
    <App />
    // <ButtonShowcase />
)
