// src/components/ProgressBar.tsx

import React from 'react';

// Define the type for the component's props
interface ProgressBarProps {
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  // Ensure progress is between 0 and 100
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  const containerStyle: React.CSSProperties = {
    width: '100%',
    backgroundColor: '#e9ecef',
    borderRadius: '10px',
  };

  const progressBarStyle: React.CSSProperties = {
    width: `${clampedProgress}%`,
    backgroundColor: '#007bff',
    height: '20px',
    borderRadius: '10px',
    transition: 'width 0.5s ease-in-out',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '12px'
  };

  return (
    <div style={containerStyle}>
      <div style={progressBarStyle}>
        {clampedProgress > 10 ? `${clampedProgress}%` : ''}
      </div>
    </div>
  );
};

export default ProgressBar;