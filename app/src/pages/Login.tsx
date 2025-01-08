import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, getUserID } from '../pmsApi';
export const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(username) && password) {
      try {
        const response = await loginUser(username, password);
        console.log('handleLogin response: ', response);
  
        if (response.data?.code === 200) {
          const token = response.data?.data?.token?.access_token;
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('accessToken', token); // Save token in localStorage
          const responseUserId = await getUserID();
          console.log('responseUserId: ', responseUserId);
          localStorage.setItem('userId', responseUserId.data?.tw_id); // Save token in localStorage

          if(responseUserId.code === 200) {
                navigate('/DailyTasks');
          }
        } else {
          setError('Invalid credentials'); // Set error state
        }
      } catch (error) {
        console.error('Login error: ', error);
        setError('Login failed. Please try again.'); // Handle errors
      }
    } else {
      setError('Invalid credentials'); // Show error message for invalid inputs
    }
  };
  

  return (
    <div>
      <h1>Login</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <button onClick={handleLogin}>Login</button>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error */}
    </div>
  );
};
