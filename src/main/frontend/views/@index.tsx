import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import React from "react";
import { useNavigate } from "react-router";

export const config: ViewConfig = {
    menu: { order: 0, icon: 'line-awesome/svg/home-solid.svg' },
    title: 'Home' };

export default function HomeView() {
  const navigate = useNavigate();



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
            maxWidth: "400px",
            width: "100%",
            textAlign: "center",
            whiteSpace: "nowrap",
            letterSpacing: "0.5px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
          onClick={() => navigate("/bookcar/bookingCar/bookcarDates")}
          onMouseOver={e => (e.currentTarget.style.background = '#005fcc')}
          onMouseOut={e => (e.currentTarget.style.background = '#0077ff')}
        >
          Book one of our cars Now
        </button>
      </div>
    </div>
  );
}