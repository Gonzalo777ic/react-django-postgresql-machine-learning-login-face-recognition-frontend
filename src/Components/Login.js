import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isFaceLogin, setIsFaceLogin] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null); // Para almacenar la imagen subida o capturada
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  const startCamera = () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Tu navegador no soporta acceso a la cámara.');
      return;
    }

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

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (canvas && video) {
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setError('No se ha capturado una imagen válida.');
            return;
          }
          const file = new File([blob], 'captured_image.jpg', { type: 'image/jpeg' });
          handleFileUpload(file);
          stopCamera();
        },
        'image/jpeg',
        0.95
      );
    } else {
      setError('No se pudo capturar la imagen.');
    }
  };

  const handleFileUpload = (file) => {
    if (file) {
      setUploadedImage(file);
    } else {
      setError('No se pudo cargar la imagen.');
    }
  };

  const handleFaceLogin = async () => {
    setIsLoading(true);
    setError(null);

    if (!username || !uploadedImage) {
      setError('Debes proporcionar un nombre de usuario y una imagen.');
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('username', username);
    formData.append('face_image', uploadedImage);

    try {
      const response = await axios.post('http://localhost:8000/api/face-login/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      localStorage.setItem('user_name', response.data.user_name); // Aquí guardamos el nombre
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Error en el reconocimiento facial.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/api/login/', {
        username,
        password,
      });
      const { access, refresh, user_name } = response.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      if (user_name) {
        localStorage.setItem('user_name', user_name); // Guardamos el nombre de usuario
      } else {
        console.error('No se recibió el nombre de usuario');
      }

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
            <label htmlFor="upload">Subir una imagen:</label>
            <input
              type="file"
              id="upload"
              accept="image/*"
              onChange={(e) => handleFileUpload(e.target.files[0])}
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
      <div>
        <p>
          ¿No tienes una cuenta? <Link to="/register"><button>Registrarse</button></Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
