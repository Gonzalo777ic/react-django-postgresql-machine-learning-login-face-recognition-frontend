import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [faceImage, setFaceImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    // Validar el tipo de archivo
    if (file && !file.type.startsWith('image/')) {
      setErrorMessage('Por favor, sube una imagen válida.');
      setFaceImage(null);
    } else {
      setFaceImage(file);
      setErrorMessage(''); // Resetear mensaje de error si la imagen es válida
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password || !faceImage) {
      setErrorMessage('Por favor completa todos los campos.');
      return;
    }

    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('face_image', faceImage);

    try {
      const response = await axios.post('http://localhost:8000/api/register/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Si la respuesta es exitosa, muestra el mensaje de éxito
      if (response.status === 200) {
        setSuccessMessage('Registro exitoso. Puedes iniciar sesión.');
        setErrorMessage('');  // Limpiar el error si el registro es exitoso
      }
    } catch (error) {
      // Capturar errores específicos y generales
      setErrorMessage('Error en el registro: ' + (error.response?.data?.message || 'Error desconocido.'));
      setSuccessMessage('');
    }
  };

  return (
    <div>
      <h2>Registrarse</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre de usuario:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Foto facial:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
        </div>
        <button type="submit">Registrar</button>
      </form>

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </div>
  );
};

export default Register;
