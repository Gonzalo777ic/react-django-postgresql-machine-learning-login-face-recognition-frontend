import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Components/Login';
import Register from './Components/Register';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import FileUpload from './Components/FileUpload';
import Profile from './Components/Profile';  // Asegúrate de crear el componente de perfil


const App = () => {
  const [userName, setUserName] = useState(null);

  // Cargar el nombre del usuario desde localStorage
  useEffect(() => {
    const storedName = localStorage.getItem('user_name');
    if (storedName) {
      setUserName(storedName);  // Establecer el nombre de usuario en el estado
    }
    const handleStorageChange = () => {
      const updatedName = localStorage.getItem('user_name');
      setUserName(updatedName);
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };


  }, []);

  return (
    <Router>
      <Navbar userName={userName} /> {/* Pasa el userName a Navbar */}

      <div style={styles.mainContent}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={


              <div style={styles.home}>

                {/* Mostrar mensaje de bienvenida si el usuario está autenticado */}
                {userName && <h2>¡Bienvenido, {userName}!</h2>}
                <p>
                  SageML es una aplicación interactiva diseñada para ayudarte a explorar, comprender y aplicar Machine Learning a tus datos.
                  Con una interfaz educativa y práctica, aprenderás conceptos clave mientras trabajas en problemas del mundo real.
                </p>

                <section style={styles.section}>
                  <h3>¿Qué es Machine Learning?</h3>
                  <p>
                    Machine Learning (aprendizaje automático) es una rama de la inteligencia artificial que permite a las máquinas aprender
                    y tomar decisiones basadas en datos sin ser programadas explícitamente para ello.
                  </p>
                </section>

                <section style={styles.section}>
                  <h3>Tipos de Machine Learning</h3>
                  <ul style={styles.list}>
                    <li>
                      <strong>Aprendizaje supervisado:</strong> El modelo aprende con datos etiquetados para predecir un resultado basado en ejemplos previos.
                      Ejemplo: Predicción de precios de casas.
                    </li>
                    <li>
                      <strong>Aprendizaje no supervisado:</strong> El modelo encuentra patrones en datos no etiquetados, como agrupamiento o reducción de dimensionalidad.
                      Ejemplo: Segmentación de clientes.
                    </li>
                    <li>
                      <strong>Aprendizaje por refuerzo:</strong> El modelo aprende a través de ensayo y error, optimizando sus acciones para maximizar una recompensa.
                      Ejemplo: Entrenamiento de robots para caminar.
                    </li>
                  </ul>
                </section>

                <section style={styles.section}>
                  <h3>Algoritmos de Machine Learning</h3>
                  <ul style={styles.list}>
                    <li>
                      <strong>Regresión lineal:</strong> Modelo simple utilizado para predecir valores continuos.
                    </li>
                    <li>
                      <strong>Árboles de decisión:</strong> Algoritmos basados en reglas para clasificación y regresión.
                    </li>
                    <li>
                      <strong>Redes neuronales:</strong> Modelos inspirados en el cerebro humano, útiles para datos complejos como imágenes y texto.
                    </li>
                    <li>
                      <strong>Clustering K-means:</strong> Algoritmo para agrupar datos en categorías basadas en similitudes.
                    </li>
                  </ul>
                </section>
              </div>
            }
          />
          <Route path="/aplicacion" element={<FileUpload />} />
          <Route path="/profile" element={<Profile userName={userName} />} /> {/* Ruta del perfil */}
        </Routes>
      </div>
      <Footer />
    </Router>
  );
};

const styles = {
  mainContent: {
    padding: '20px',
    minHeight: '80vh',
  },
  home: {
    textAlign: 'center',
    maxWidth: '800px',
    margin: 'auto',
  },
  section: {
    margin: '20px 0',
    textAlign: 'left',
  },
  list: {
    textAlign: 'left',
    margin: '10px 0',
    paddingLeft: '20px',
  },
};

export default App;
