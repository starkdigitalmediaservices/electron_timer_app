import { useState, useEffect } from 'react';

export default function Config() {
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken'); // Check token in localStorage
    console.log('pmsApi userToken : ', token);
    if (token) {
      setUserToken(token); // Set token if it exists
    } else {
      setUserToken(null); // Set null if no token is found
    }
  }, []); // Empty dependency array ensures this only runs on mount

  return userToken;
}
