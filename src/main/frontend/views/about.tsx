import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import React from "react";

export const config: ViewConfig = { menu: { order: 12, icon: 'line-awesome/svg/info-solid.svg' }, title: 'About' };

export default function AboutView() {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        backgroundImage: 'url("images/RentalCarBack.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <div
        style={{
          background: "rgba(0, 0, 0, 0.6)",
          padding: "clamp(32px, 8vw, 64px) clamp(16px, 8vw, 48px)",
          borderRadius: "clamp(12px, 2vw, 24px)",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
          maxWidth: "700px",
          width: "90vw",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, marginBottom: "24px", letterSpacing: 2 }}>
          About World Rental Car
        </h1>
        <p style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", marginBottom: "24px", lineHeight: 1.6 }}>
          At World Rental Car, we believe every journey should be comfortable, safe, and memorable. With years of experience in the car rental industry, our mission is to provide top-quality vehicles and exceptional customer service. Whether you're traveling for business or leisure, our diverse fleet and dedicated team ensure you have the perfect car for every adventure.
        </p>
        <p style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)", marginBottom: 0, opacity: 0.85 }}>
          Discover the freedom of the open road with us—your trusted partner for car rentals worldwide.
        </p><div className="flex flex-col"></div>
      </div>
    </div>
  );
}