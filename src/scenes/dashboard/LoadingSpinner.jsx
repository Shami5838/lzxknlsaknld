import React from "react";

const LoadingSpinner = () => {
  const spinnerContainerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  };

  const spinnerStyle = {
    width: "200px",
    height: "200px",
    border: "5px solid rgba(255, 255, 255, 0.3)",
    borderRadius: "50%",
    borderTopColor: "black",
    animation: "spin 1s linear infinite",
  };

  const keyframes = `
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `;

  return (
    <div style={spinnerContainerStyle}>
      <style>{keyframes}</style>
      <div style={spinnerStyle}></div>
    </div>
  );
};

export default LoadingSpinner;
