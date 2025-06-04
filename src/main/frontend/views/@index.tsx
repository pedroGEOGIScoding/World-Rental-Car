import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth, AuthProvider } from '../auth/AuthContext';
import { Notification } from '@vaadin/react-components/Notification.js';
import { Button } from '@vaadin/react-components/Button.js';

export const config: ViewConfig = {
    menu: { order: 0, icon: 'line-awesome/svg/home-solid.svg' },
    title: 'Home' };

// Main content component separated to use auth hook
function HomeContent() {
  const navigate = useNavigate();
  const { isAuthenticated, user, login, logout, loading, error } = useAuth();

  // Handle auth errors
  useEffect(() => {
    if (error) {
      Notification.show(`Authentication error: ${error}`, { 
        position: 'middle',
        duration: 3000,
        theme: 'error'
      });
    }
  }, [error]);

  const handleBookCar = () => {
    if (isAuthenticated) {
      navigate("/bookcar/bookingCar/bookcarDates");
    } else {
      Notification.show('Please log in to book a car', {
        position: 'middle',
        duration: 3000,
        theme: 'info'
      });
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        backgroundImage: 'url("images/RentalCarBack.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "90vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(0, 0, 0, 0.5)",
          padding: "clamp(24px, 6vw, 60px) clamp(16px, 8vw, 60px)",
          borderRadius: "clamp(8px, 2vw, 16px)",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
          maxWidth: "600px",
          margin: "auto",
          flexDirection: "column",
        }}
      >
        <h1 style={{ color: "#fff", fontSize: "clamp(2rem, 6vw, 3rem)", marginBottom: "16px", fontWeight: 700, letterSpacing: 2 }}>
          World Rental Car
        </h1>
        <p style={{ color: "#fff", fontSize: "clamp(1.1rem, 3vw, 1.5rem)", marginBottom: "32px", maxWidth: 500, textAlign: "center" }}>
          Explore the world with comfort and style. Rent your perfect car today!
        </p>
        
        {loading ? (
          <p style={{ color: "#fff", marginBottom: "20px" }}>Loading authentication...</p>
        ) : isAuthenticated ? (
          <>
            <div style={{ color: "#fff", marginBottom: "20px", textAlign: "center" }}>
              <p>Welcome, {user?.profile?.email || user?.profile?.name || 'User'}!</p>
              <p>You are logged in</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "15px", width: "100%", maxWidth: "400px" }}>
              <button
                style={{
                  padding: "14px 20px",
                  fontSize: "clamp(1rem, 2vw, 1.2rem)",
                  fontWeight: 600,
                  color: "#fff",
                  background: "#0077ff",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  transition: "background 0.2s",
                  width: "100%",
                  textAlign: "center",
                  whiteSpace: "nowrap",
                  letterSpacing: "0.5px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center"
                }}
                onClick={handleBookCar}
                onMouseOver={e => (e.currentTarget.style.background = '#005fcc')}
                onMouseOut={e => (e.currentTarget.style.background = '#0077ff')}
              >
                Book one of our cars Now
              </button>
              <button
                style={{
                  padding: "10px 15px",
                  fontSize: "1rem",
                  fontWeight: 500,
                  color: "#fff",
                  background: "transparent",
                  border: "1px solid #fff",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "background 0.2s",
                  width: "100%",
                }}
                onClick={() => logout()}
                onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
                onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "15px", width: "100%", maxWidth: "400px" }}>
            <button
              style={{
                padding: "14px 20px",
                fontSize: "clamp(1rem, 2vw, 1.2rem)",
                fontWeight: 600,
                color: "#fff",
                background: "#0077ff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                transition: "background 0.2s",
                width: "100%",
                textAlign: "center",
                whiteSpace: "nowrap",
                letterSpacing: "0.5px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
              onClick={() => login()}
              onMouseOver={e => (e.currentTarget.style.background = '#005fcc')}
              onMouseOut={e => (e.currentTarget.style.background = '#0077ff')}
            >
              Login to book a car or register
            </button>
            <p style={{ color: "#fff", fontSize: "0.9rem", textAlign: "center" }}>
              You must login to book a car
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function HomeView() {
  return (
    <AuthProvider>
      <HomeContent />
    </AuthProvider>
  );
}