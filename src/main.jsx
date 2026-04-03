import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import CaixaLocalProvider from './components/CaixaLocalContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CaixaLocalProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </CaixaLocalProvider>
  </React.StrictMode>
);
