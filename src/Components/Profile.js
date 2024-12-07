import React, { useEffect, useState } from 'react';

const Profile = ({ userName }) => {
  const [userImage, setUserImage] = useState(null);

  useEffect(() => {
    // Supón que tienes una API para obtener la foto del usuario. Aquí simulamos con localStorage.
    const userImageData = localStorage.getItem('user_image');  // Ejemplo: obtener de localStorage o API
    setUserImage(userImageData);
  }, []);

  return (
    <div style={styles.profileContainer}>
      <h2>Perfil de {userName}</h2>
      {userImage ? (
        <img src={userImage} alt="User Profile" style={styles.profileImage} />
      ) : (
        <p>No hay imagen de perfil</p>
      )}
      <p>Username: {userName}</p>
    </div>
  );
};

const styles = {
  profileContainer: {
    textAlign: 'center',
    padding: '20px',
  },
  profileImage: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    marginBottom: '20px',
  },
};

export default Profile;
