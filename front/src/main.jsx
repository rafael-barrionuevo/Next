import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "react-credit-cards-2/dist/es/styles-compiled.css";
import App from './App.jsx'

import { Provider } from "react-redux";
import { store } from "./store";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
