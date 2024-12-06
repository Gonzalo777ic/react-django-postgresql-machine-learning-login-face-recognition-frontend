import React, { useState } from 'react';
import axios from 'axios';

const RandomForestRegressor = ({ csvData, onBack }) => {
  const [dependentVariable, setDependentVariable] = useState('');
  const [independentVariables, setIndependentVariables] = useState([]);
  const [evaluationResults, setEvaluationResults] = useState(null);
  const [isDatasetValid, setIsDatasetValid] = useState(false);

  // Obtener columnas del CSV
  const columns = csvData ? Object.keys(csvData[0]) : [];

  // Validar variable dependiente
  const validateDependentVariable = () => {
    if (!csvData || !dependentVariable) return false;

    const values = csvData.map((row) => parseFloat(row[dependentVariable]));
    const isContinuous = values.every((value) => !isNaN(value));
    return isContinuous;
  };

  // Validar dataset
  const validateDataset = () => {
    if (!csvData) return false;
    return independentVariables.length > 0;
  };

  // Ejecutar modelo RandomForestRegressor
  const handleRunModel = async () => {
    if (!validateDataset() || !validateDependentVariable()) {
      alert('El dataset no cumple con los requisitos previos.');
      return;
    }

    // Enviar datos al backend
    try {
      const response = await axios.post('http://localhost:8000/api/random-forest', {
        dependentVariable,
        independentVariables,
        data: csvData,
      });

      // Suponiendo que el backend devuelve un archivo de predicciones y resultados
      const { predictions, metrics } = response.data;
      setEvaluationResults({ predictions, metrics });
    } catch (error) {
      console.error('Error al enviar los datos al backend:', error);
      alert('Ocurrió un error al procesar el modelo.');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Random Forest Regressor</h2>
      <p>Configura y evalúa un modelo de regresión utilizando Random Forest.</p>

      <div style={styles.section}>
        <h3>1. Selección de Variables</h3>
        <label>
          Variable dependiente:
          <select
            value={dependentVariable}
            onChange={(e) => setDependentVariable(e.target.value)}
            style={styles.select}
          >
            <option value="">Seleccione una variable</option>
            {columns.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>
        </label>

        <label>
          Variables independientes:
          {columns.map((col) => (
            <div key={col}>
              <input
                type="checkbox"
                checked={independentVariables.includes(col)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setIndependentVariables([...independentVariables, col]);
                  } else {
                    setIndependentVariables(independentVariables.filter((v) => v !== col));
                  }
                }}
              />
              {col}
            </div>
          ))}
        </label>
      </div>

      <div style={styles.section}>
        <h3>2. Evaluación del Modelo</h3>
        <button onClick={handleRunModel} style={styles.button}>
          Aceptar y Ejecutar Modelo
        </button>
        {evaluationResults && (
          <div style={styles.results}>
            <h4>Resultados:</h4>
            <p>Predicciones: {evaluationResults.predictions}</p>
            <p>RMSE: {evaluationResults.metrics.RMSE}</p>
            <p>R2: {evaluationResults.metrics.R2}</p>
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
  select: {
    display: 'block',
    margin: '10px 0',
    padding: '8px',
    width: '100%',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  results: {
    marginTop: '20px',
    padding: '10px',
    backgroundColor: '#eaf4f8',
    borderRadius: '5px',
  },
};

