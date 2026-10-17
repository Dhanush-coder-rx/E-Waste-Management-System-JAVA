import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import HomeImage from './Home.png'; 

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container" style={{ backgroundImage: `url(${HomeImage})` }}>
      <h1 className="home-heading">E-Waste{"\n"}Management System</h1>
      <button className="login-button" onClick={() => navigate('/login')}>
        Go to Login
      </button>
    </div>
  );
}
