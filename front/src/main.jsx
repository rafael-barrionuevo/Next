import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "react-credit-cards-2/dist/es/styles-compiled.css";
import App from './App.jsx'
import { Provider } from "react-redux";
import { store } from "./store";
import './tailwind.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
