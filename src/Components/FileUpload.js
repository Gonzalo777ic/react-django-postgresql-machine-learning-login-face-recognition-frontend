import React, { useState } from "react";
import Papa from "papaparse"; // Librería para leer archivos CSV
import LogisticRegression from "./AlgoritmosML/LogisticRegression"; // Importar el modelo
import MLPRegressor from "./AlgoritmosML/MLPRegressor";
import RFRegressor from "./AlgoritmosML/RFRegressor"; // Importar el nuevo modelo

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [csvData, setCsvData] = useState(null);
    const [error, setError] = useState("");
    const [showButtons, setShowButtons] = useState(false);
    const [selectedModel, setSelectedModel] = useState(null);

    // Manejar la selección del archivo
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.name.endsWith(".csv")) {
            setFile(selectedFile);
            setError("");
            setCsvData(null);
            setShowButtons(false);
            setSelectedModel(null);
        } else {
            setError("Por favor, cargue un archivo válido (.csv).");
            setFile(null);
            setCsvData(null);
        }
    };

    // Leer el archivo CSV y mostrar la tabla
    const handleFileUpload = () => {
        if (!file) {
            setError("No se ha seleccionado ningún archivo.");
            return;
        }
        Papa.parse(file, {
            complete: (result) => {
                if (result.errors.length > 0) {
                    setError("Error al procesar el archivo. Verifique el formato del CSV.");
                    setCsvData(null);
                } else if (result.data.length === 0 || Object.keys(result.data[0]).length === 0) {
                    setError("El archivo está vacío o no tiene datos válidos.");
                    setCsvData(null);
                } else {
                    setCsvData(result.data);
                    setShowButtons(true);
                    setError(""); // Limpiar errores
                }
            },
            header: true,
            skipEmptyLines: true,
        });
    };

    // Manejar la selección del modelo
    const handleModelSelection = (model) => {
        setSelectedModel(model);
    };

    return (
        <div style={styles.container}>
            <h2>Aplicación de Machine Learning</h2>
            <p>Sube tu archivo CSV y selecciona un modelo para procesarlo.</p>

            <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                style={styles.inputFile}
            />
            {error && <p style={styles.error}>{error}</p>}

            <button onClick={handleFileUpload} style={styles.button}>
                Mostrar CSV
            </button>

            {/* Mostrar la tabla con el contenido del CSV */}
            {csvData && csvData.length > 0 && (
                <div style={styles.tableContainer}>
                    <h3>Contenido del CSV</h3>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Índice</th>
                                {Object.keys(csvData[0]).map((header, index) => (
                                    <th key={index} style={styles.th}>
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {csvData.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    <td style={styles.td}>{rowIndex + 1}</td>
                                    {Object.values(row).map((cell, cellIndex) => (
                                        <td key={cellIndex} style={styles.td}>
                                            {cell}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Mostrar los botones para los modelos */}
            {showButtons && !selectedModel && (
                <div style={styles.buttonsContainer}>
                    <h3>Selecciona un modelo para aplicar:</h3>
                    <button
                        style={styles.modelButton}
                        onClick={() => handleModelSelection("logistic_regression")}
                    >
                        Regresión Logística
                    </button>
                    <button
                        style={styles.modelButton}
                        onClick={() => handleModelSelection("random_forest_classifier")}
                    >
                        Random Forest Classifier
                    </button>
                    <button
                        style={styles.modelButton}
                        onClick={() => handleModelSelection("linear_regression")}
                    >
                        Regresión Lineal
                    </button>
                    <button
                        style={styles.modelButton}
                        onClick={() => handleModelSelection("RFRegressor")}
                    >
                        Random Forest Regressor
                    </button>
                    <button
                        style={styles.modelButton}
                        onClick={() => handleModelSelection("kmeans")}
                    >
                        K-Means
                    </button>
                    <button
                        style={styles.modelButton}
                        onClick={() => handleModelSelection("MLPRegressor")}
                    >
                        MLPRegressor
                    </button>
                </div>
            )}

            {/* Mostrar el componente del modelo seleccionado */}
            {selectedModel === "logistic_regression" && (
                <LogisticRegression csvData={csvData} />
            )}
            {selectedModel === "RFRegressor" && (
                <RFRegressor csvData={csvData} onBack={() => setSelectedModel(null)} />
            )}
            {selectedModel === "MLPRegressor" && (
                <MLPRegressor csvData={csvData} onBack={() => setSelectedModel(null)} />
            )}
        </div>
    );
};

export default FileUpload;

// Estilos
const styles = {
    container: {
        padding: "20px",
        maxWidth: "1000px",
        margin: "auto",
        textAlign: "center",
    },
    inputFile: {
        padding: "10px",
        margin: "10px 0",
        borderRadius: "4px",
        border: "1px solid #ccc",
    },
    error: {
        color: "red",
        fontSize: "14px",
    },
    button: {
        backgroundColor: "#10576D",
        color: "white",
        padding: "10px 20px",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
    },
    tableContainer: {
        marginTop: "20px",
        maxHeight: "400px",
        overflowY: "auto",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
    },
    th: {
        backgroundColor: "#10576D",
        color: "white",
        padding: "8px",
    },
    td: {
        padding: "8px",
        textAlign: "center",
        borderBottom: "1px solid #ddd",
    },
    buttonsContainer: {
        marginTop: "20px",
    },
    modelButton: {
        margin: "5px",
        padding: "10px 15px",
        backgroundColor: "#FF6F61",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
};
