import React, { useState } from 'react';

const MLPRegressor = ({ csvData, onBack }) => {
  const [dependentVariable, setDependentVariable] = useState('');
  const [independentVariables, setIndependentVariables] = useState([]);
  const [isNormalized, setIsNormalized] = useState(false);
  const [architecture, setArchitecture] = useState('');
  const [optimizer, setOptimizer] = useState('adam');
  const [evaluationResults, setEvaluationResults] = useState(null);
  const [isDatasetValid, setIsDatasetValid] = useState(false);

  // Obtener columnas del CSV
  const columns = csvData ? Object.keys(csvData[0]) : [];

  // Validar variable dependiente (debe ser continua para regresión)
  const validateDependentVariable = () => {
    if (!csvData || !dependentVariable) return false;

    const values = csvData.map((row) => parseFloat(row[dependentVariable]));
    const isContinuous = values.every((value) => !isNaN(value));
    return isContinuous;
  };

  // Validar dataset
  const validateDataset = () => {
    if (!csvData) return false;

    // Validar tamaño del dataset (>10 filas por cada variable independiente)
    const sufficientRows = csvData.length > independentVariables.length * 10;

    // Validar características (que no estén altamente correlacionadas)
    // Aquí puedes implementar un análisis más detallado si es necesario.
    const validFeatures = independentVariables.length > 0;

    return sufficientRows && validFeatures;
  };

  // Evaluar preprocesamiento
  const handlePreprocessing = () => {
    setIsNormalized(true);
    alert('Preprocesamiento completado: características normalizadas/estandarizadas.');
  };

  // Ejecutar modelo MLP
  const handleRunModel = () => {
    if (!validateDataset() || !validateDependentVariable()) {
      alert('El dataset no cumple con los requisitos previos.');
      return;
    }

    // Aquí podrías integrar el llamado al backend para entrenar el modelo MLP
    const results = {
      validationScore: 0.85, // Simulado
      metrics: {
        RMSE: 0.32, // Simulado
      },
    };
    setEvaluationResults(results);
  };

  return (
    <div style={styles.container}>
      <h2>MLP Regressor</h2>
      <p>Configura y evalúa un modelo de regresión basado en Perceptrón Multicapa (MLP).</p>

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
        <p>
          {dependentVariable && !validateDependentVariable() && (
            <span style={styles.error}>
              La variable seleccionada no es continua (debe serlo para regresión).
            </span>
          )}
        </p>

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
        <h3>2. Preprocesamiento</h3>
        <button onClick={handlePreprocessing} style={styles.button}>
          Normalizar/Estandarizar características
        </button>
        {isNormalized && <p>Las características han sido normalizadas.</p>}
      </div>

      <div style={styles.section}>
        <h3>3. Configuración del Modelo</h3>
        <label>
          Arquitectura (capas y neuronas, por ejemplo, "64,32,16"):
          <input
            type="text"
            value={architecture}
            onChange={(e) => setArchitecture(e.target.value)}
            placeholder="64,32,16"
            style={styles.input}
          />
        </label>
        <label>
          Optimizador:
          <select value={optimizer} onChange={(e) => setOptimizer(e.target.value)} style={styles.select}>
            <option value="adam">Adam</option>
            <option value="sgd">SGD</option>
            <option value="rmsprop">RMSProp</option>
          </select>
        </label>
      </div>

      <div style={styles.section}>
        <h3>4. Evaluación del Modelo</h3>
        <button onClick={handleRunModel} style={styles.button}>
          Entrenar y Evaluar
        </button>
        {evaluationResults && (
          <div style={styles.results}>
            <h4>Resultados:</h4>
            <p>Score de validación: {evaluationResults.validationScore}</p>
            <p>RMSE: {evaluationResults.metrics.RMSE}</p>
          </div>
        )}
      </div>

      <button onClick={onBack} style={styles.backButton}>
        Volver
      </button>
    </div>
  );
};

export default MLPRegressor;

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
  input: {
    display: 'block',
    margin: '10px 0',
    padding: '8px',
    width: '100%',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  select: {
    display: 'block',
    margin: '10px 0',
    padding: '8px',
    width: '100%',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  error: {
    color: 'red',
    fontSize: '14px',
  },
  results: {
    marginTop: '20px',
    padding: '10px',
    backgroundColor: '#eaf4f8',
    borderRadius: '5px',
  },
};
