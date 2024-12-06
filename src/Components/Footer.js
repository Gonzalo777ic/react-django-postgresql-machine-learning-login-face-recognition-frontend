import React from 'react';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <p>Isique Productions</p>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#10576D',
    color: 'white',
    textAlign: 'center',
    padding: '10px',
    width: '100%',
    marginTop: 'auto', // Esto empuja el footer hacia abajo
  }
};

export default Footer;
