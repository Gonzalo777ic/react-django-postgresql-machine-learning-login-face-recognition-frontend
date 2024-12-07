import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';  // Importa el componente App
import reportWebVitals from './reportWebVitals'
import { getCSRFToken } from './csrf'; // Importa la función para obtener el CSRF Token

// Obtener el token CSRF antes de iniciar la aplicación
getCSRFToken().then(() => {
  ReactDOM.render(<App />, document.getElementById('root'));
});


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// Para la medición del rendimiento (opcional)
reportWebVitals();
