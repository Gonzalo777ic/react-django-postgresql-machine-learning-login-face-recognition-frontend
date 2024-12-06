// src/Components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import logo from './Images/SageML_logo.png'; // Importa el logo

const Navbar = () => {
  return (
    <nav style={styles.navbar}>
      {/* Logo con enlace al homepage */}
      <Link to="/" style={styles.logoContainer}>
        <img src={logo} alt="SageML Logo" style={styles.logo} />
        <div style={styles.link}>SageML</div>
      </Link>

      {/* Enlaces de navegación */}
      <ul style={styles.navLinks}>
        <li>
          <Link to="/aplicacion" style={styles.startButton}>
            Start
          </Link>
        </li>
        <li>
          <Link to="/login" style={styles.link}>
            Iniciar sesión
          </Link>
        </li>
      </ul>
    </nav>
  );
};

const styles = {
  navbar: {
    backgroundColor: '#10576D',
    padding: '10px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
  },
  logo: {
    height: '40px', // Ajusta el tamaño del logo
  },
  navLinks: {
    listStyle: 'none',
    display: 'flex',
    alignItems: 'center',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    margin: '0 10px',
  },
  startButton: {
    color: 'white',
    textDecoration: 'none',
    margin: '0 10px',
    padding: '5px 15px',
    backgroundColor: '#ff7f50', // Color distintivo para el botón "Start"
    borderRadius: '5px',
    fontWeight: 'bold',
  },
};

export default Navbar;
