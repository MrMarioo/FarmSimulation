import React from 'react';

const Crop = ({ crop }) => {
  if (!crop) {
    return <p>Brak uprawy</p>;
  }

  return (
    <div>
      <p>Uprawa: {crop}</p>
      <p>Rośnie...</p>
    </div>
  );
};

export default Crop;
