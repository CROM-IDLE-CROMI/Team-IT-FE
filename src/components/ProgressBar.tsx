import React from 'react';

// The props interface remains the same
interface ProgressBarProps {
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  const dynamicBarStyle = {
    width: `${clampedProgress}%`,
  };

  return (
    <div className="progress-container">
      <div className="progress-bar" style={dynamicBarStyle}>
        {clampedProgress > 10 ? `${clampedProgress}%` : ''}
      </div>
    </div>
  );
};

export default ProgressBar;