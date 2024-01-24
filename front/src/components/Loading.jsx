import React from 'react';

function Loading({ isLoading }) {
  if (!isLoading) {
    return null; // Ne rien afficher si isLoading est à false
  }
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
    </div>
  );
}

export default Loading;