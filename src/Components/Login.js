import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Asegúrate de tener el Link importado
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isFaceLogin, setIsFaceLogin] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  // Iniciar la cámara para el login facial
  const startCamera = () => {
    setIsCameraActive(true);
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      })
      .catch((err) => {
        setError('Error al acceder a la cámara.');
        console.error(err);
      });
  };

  // Detener la cámara
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      setIsCameraActive(false);
    }
  };

  // Capturar foto desde la cámara
  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (canvas && video) {
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      console.log('Imagen capturada:', canvas.toDataURL('image/jpeg'));  // Verifica el contenido del canvas
      stopCamera();
    }
  };

  // Subir imagen desde el dispositivo
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedImage(file);
    }
  };

  // Login usando reconocimiento facial
  const handleFaceLogin = async () => {
    setIsLoading(true);

    const canvas = canvasRef.current;

    if (!username || (!canvas && !uploadedImage)) {
      setError('Debes proporcionar un nombre de usuario y subir o tomar una foto.');
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('username', username);

    if (uploadedImage) {
      formData.append('face_image', uploadedImage);
    } else {
      const faceImage = canvas.toDataURL('image/jpeg');
      formData.append('face_image_base64', faceImage);
    }

    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.post('http://localhost:8000/api/face-login/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Error en el reconocimiento facial.');
    } finally {
      setIsLoading(false);
    }
  };

  // Login con usuario y contraseña
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/api/login/', {
        username,
        password,
      });
      const { access, refresh } = response.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      navigate('/');
    } catch (error) {
      setError('Credenciales inválidas.');
    }
  };

  return (
    <div>
      <h2>Iniciar sesión</h2>
      {isFaceLogin ? (
        <div>
          <div>
            <label htmlFor="username">Nombre de usuario:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="upload">Subir una foto:</label>
            <input
              type="file"
              id="upload"
              accept="image/*"
              onChange={handleFileUpload}
            />
          </div>
          {isCameraActive ? (
            <div>
              <video ref={videoRef} width="320" height="240" />
              <button onClick={capturePhoto}>Capturar Foto</button>
            </div>
          ) : (
            <button onClick={startCamera}>Activar Cámara</button>
          )}
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          <button onClick={handleFaceLogin} disabled={isLoading}>
            {isLoading ? 'Cargando...' : 'Login con rostro'}
          </button>
          <button onClick={stopCamera}>Detener Cámara</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Nombre de usuario:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">Contraseña:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">Iniciar sesión</button>
        </form>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={() => setIsFaceLogin(!isFaceLogin)}>
        {isFaceLogin ? 'Usar contraseña' : 'Usar reconocimiento facial'}
      </button>

      {/* Botón para redirigir a la página de registro */}
      <div>
        <p>¿No tienes una cuenta? <Link to="/register"><button>Registrarse</button></Link></p>
      </div>
    </div>
  );
};

export default Login;
