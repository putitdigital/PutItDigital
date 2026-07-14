import React from "react";

export default function Preloader() {
  return (
    <div className="preloader-overlay">
      <div className="preloader-panel">
        <div className="preloader-spinner" />
        <div className="preloader-text">
          <span>Loading</span>
          <span className="preloader-dots">
            <span>·</span>
            <span>·</span>
            <span>·</span>
          </span>
        </div>
      </div>
    </div>
  );
}
