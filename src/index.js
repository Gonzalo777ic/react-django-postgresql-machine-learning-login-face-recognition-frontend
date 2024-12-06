import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';  // Importa el componente App
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// Para la medición del rendimiento (opcional)
reportWebVitals();
