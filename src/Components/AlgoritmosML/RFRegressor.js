import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getCSRFToken } from '../../csrf'; // Importa la función para obtener el token CSRF
import GraficoRFR from '../../Components/Images/graficoRFR.png'; // Ajusta la ruta si es necesario


const RandomForestRegressor = ({ onBack }) => {
  const [evaluationResults, setEvaluationResults] = useState(null);

  // Configurar el token CSRF al montar el componente
  useEffect(() => {
    getCSRFToken();
  }, []);

  // Ejecutar modelo RandomForestRegressor
  const handleRunModel = async () => {
    try {
      const response = await axios.post('http://localhost:8000/ejecutar_ml/', {}, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.error) {
        alert('Error en el backend: ' + response.data.error);
        return;
      }

      const { futuro_predicciones, mae, mse, rmse, r2, grafico_path } = response.data;
      setEvaluationResults({ futuro_predicciones, mae, mse, rmse, r2, grafico_path });
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
      if (error.response) {
        console.log('Respuesta del backend:', error.response.data);
      }
    }
  };

  return (
    <div style={styles.container}>
      <h2>Random Forest Regressor</h2>
      <p>Configura y evalúa un modelo de regresión utilizando Random Forest.</p>

      <div style={styles.section}>
        <h3>1. Descripción del Modelo</h3>
        <p>
          Random Forest es un algoritmo de aprendizaje automático basado en un conjunto de árboles de decisión. Es un método de ensamblaje que utiliza múltiples árboles para mejorar la precisión del modelo y reducir el sobreajuste.
        </p>
        <h4>Requisitos Previos</h4>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Requerimiento</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Variable Dependiente Y</td>
              <td>Debe ser una variable continua.</td>
            </tr>
            <tr>
              <td>Variables Predictoras X</td>
              <td>Las variables pueden ser continuas o categóricas. Si son categóricas, deben ser transformadas a valores numéricos.</td>
            </tr>
            <tr>
              <td>Tamaño</td>
              <td>No hay un tamaño mínimo, pero más datos tienden a mejorar el rendimiento.</td>
            </tr>
            <tr>
              <td>Manejo de Valores Faltantes</td>
              <td>Se puede hacer imputación o ramificación.</td>
            </tr>
            <tr>
              <td>Normalización de Variables</td>
              <td>No es necesario normalizar las variables.</td>
            </tr>
            <tr>
              <td>Overfitting</td>
              <td>Random Forest es robusto frente al sobreajuste, pero es importante ajustar parámetros como el número de árboles y la profundidad máxima de los mismos.</td>
            </tr>
            <tr>
              <td>Diversidad Entre los Árboles</td>
              <td>El modelo aleatoriza las muestras y características en cada árbol para mejorar la generalización.</td>
            </tr>
            <tr>
              <td>Importancia de las Características</td>
              <td>El modelo puede medir la importancia de cada característica en la predicción.</td>
            </tr>
          </tbody>
        </table>

        <h4>Métricas de Evaluación</h4>
        <p>
          <strong>R² (Coeficiente de Determinación):</strong> Mide la proporción de la varianza de la variable dependiente que es explicada por las variables independientes. Un valor de 1 indica un modelo perfecto.
        </p>
        <p>
          <strong>MAE (Error Absoluto Medio):</strong> Mide la media de las diferencias absolutas entre las predicciones y los valores reales. Cuanto menor sea, mejor será el modelo.
        </p>
        <p>
          <strong>MSE (Error Cuadrático Medio):</strong> Es la media de los errores al cuadrado. Penaliza más los errores grandes.
        </p>
        <p>
          <strong>RMSE (Raíz del Error Cuadrático Medio):</strong> Es la raíz cuadrada del MSE, proporcionando una medida de error en las mismas unidades que los datos originales.
        </p>
      </div>

      <div style={styles.section}>
        <h3>2. Evaluación del Modelo</h3>
        <button onClick={handleRunModel} style={styles.button}>
          Aceptar y Ejecutar Modelo
        </button>
        {evaluationResults && (
          <div style={styles.results}>
            <h4>Resultados:</h4>
            <p><strong>Predicciones Futuras:</strong></p>
            <ul>
              {evaluationResults.futuro_predicciones.map((prediction, index) => (
                <li key={index}>
                  {prediction.AÑO}-{prediction.MES}: {prediction.TOTAL_PREDICCION.toFixed(2)}
                </li>
              ))}
            </ul>
            <h4>Métricas de Evaluación:</h4>
            <p><strong>MAE:</strong> {evaluationResults.mae}</p>
            <p><strong>MSE:</strong> {evaluationResults.mse}</p>
            <p><strong>RMSE:</strong> {evaluationResults.rmse}</p>
            <p><strong>R²:</strong> {evaluationResults.r2}</p>
            <img src={GraficoRFR} alt="Gráfico RFR" />
            </div>
        )}
      </div>

      <button onClick={onBack} style={styles.backButton}>
        Volver
      </button>
    </div>
  );
};

export default RandomForestRegressor;

// Estilos
const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: 'auto',
    textAlign: 'left',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
  },
  section: {
    marginBottom: '20px',
  },
  button: {
    backgroundColor: '#10576D',
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    margin: '10px 0',
  },
  backButton: {
    backgroundColor: '#FF6F61',
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  results: {
    marginTop: '20px',
    padding: '10px',
    backgroundColor: '#eaf4f8',
    borderRadius: '5px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    margin: '20px 0',
  },
  tableHeader: {
    backgroundColor: '#f2f2f2',
    fontWeight: 'bold',
  },
  tableCell: {
    padding: '8px',
    border: '1px solid #ddd',
  },
};
