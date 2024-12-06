// src/Components/AlgoritmosML/LogisticRegression.js
import React, { useState } from "react";

const LogisticRegression = ({ csvData }) => {
  const [dependentVariable, setDependentVariable] = useState("");
  const [independentVariables, setIndependentVariables] = useState([]);
  const [evaluationResults, setEvaluationResults] = useState({});
  const [error, setError] = useState("");

  const columnNames = csvData && Object.keys(csvData[0]); // Nombres de las columnas

  // Manejar selección de la variable dependiente
  const handleDependentVariableChange = (e) => {
    const selected = e.target.value;
    if (isBinaryOrCategorical(selected)) {
      setDependentVariable(selected);
      setError("");
    } else {
      setError("La variable seleccionada no es binaria o categórica.");
      setDependentVariable("");
    }
  };

  // Validar si una columna es binaria o categórica
  const isBinaryOrCategorical = (column) => {
    const uniqueValues = [...new Set(csvData.map((row) => row[column]))];
    return uniqueValues.length <= 10; // Ejemplo: <=10 valores únicos es categórico
  };

  // Manejar selección de variables independientes
  const handleIndependentVariableChange = (e) => {
    const selected = e.target.value;
    setIndependentVariables((prev) =>
      prev.includes(selected)
        ? prev.filter((v) => v !== selected)
        : [...prev, selected]
    );
  };

  // Evaluar distribución equilibrada de clases
  const evaluateClassBalance = () => {
    const counts = csvData.reduce((acc, row) => {
      acc[row[dependentVariable]] =
        (acc[row[dependentVariable]] || 0) + 1;
      return acc;
    }, {});

    setEvaluationResults({
      classDistribution: counts,
      isBalanced: Object.values(counts).every(
        (count) => count > Math.min(...Object.values(counts)) * 0.5
      ),
    });
  };

  return (
    <div style={styles.container}>
      <h3>Regresión Logística</h3>

      {/* Requerimiento 1: Variable dependiente */}
      <div style={styles.section}>
        <h4>1. Selección de Variable Dependiente</h4>
        <p>Seleccione una variable dependiente:</p>
        <select
          onChange={handleDependentVariableChange}
          value={dependentVariable}
          style={styles.select}
        >
          <option value="">Seleccione</option>
          {columnNames.map((col) => (
            <option key={col} value={col}>
              {col}
            </option>
          ))}
        </select>
        {error && <p style={styles.error}>{error}</p>}
      </div>

      {/* Requerimiento 2: Variables independientes */}
      <div style={styles.section}>
        <h4>2. Selección de Variables Independientes</h4>
        <p>Seleccione variables independientes:</p>
        {columnNames.map((col) =>
          col !== dependentVariable ? (
            <div key={col} style={styles.checkboxContainer}>
              <label>
                <input
                  type="checkbox"
                  value={col}
                  checked={independentVariables.includes(col)}
                  onChange={handleIndependentVariableChange}
                />
                {col}
              </label>
            </div>
          ) : null
        )}
      </div>

      {/* Requerimiento 5: Evaluar distribución equilibrada */}
      {dependentVariable && (
        <div style={styles.section}>
          <h4>5. Evaluar Distribución Equilibrada de Clases</h4>
          <button onClick={evaluateClassBalance} style={styles.button}>
            Evaluar distribución equilibrada
          </button>
          {evaluationResults.classDistribution && (
            <div>
              <h5>Resultados:</h5>
              <pre>
                {JSON.stringify(
                  evaluationResults.classDistribution,
                  null,
                  2
                )}
              </pre>
              <p>
                ¿Está balanceada?{" "}
                {evaluationResults.isBalanced ? "Sí" : "No"}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Requerimientos adicionales pueden añadirse aquí */}
    </div>
  );
};

export default LogisticRegression;

// Estilos
const styles = {
  container: {
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    marginTop: "20px",
    backgroundColor: "#f9f9f9",
  },
  section: {
    marginBottom: "20px",
  },
  select: {
    padding: "10px",
    margin: "10px 0",
    borderRadius: "4px",
    border: "1px solid #ccc",
    width: "100%",
  },
  checkboxContainer: {
    margin: "5px 0",
  },
  button: {
    backgroundColor: "#10576D",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    fontSize: "14px",
  },
};
