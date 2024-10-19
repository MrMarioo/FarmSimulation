import React from 'react';

const Crop = ({ crop, readyToHarvest }) => {
  if (!crop) {
    return <p>Brak uprawy</p>;
  }

  return (
    <div>
      <p>Uprawa: {crop}</p>
      {readyToHarvest ? <p>Gotowe do zbiorów!</p> : <p>Rośnie...</p>}
    </div>
  );
};

export default Crop;
