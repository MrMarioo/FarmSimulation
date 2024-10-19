import React from 'react';
import Crop from './Crop';

const Field = ({ field, onPlant, onWater }) => {
  return (
    <div style={{ border: '1px solid black', padding: '10px', width: '150px' }}>
      <h3>Pole  {field.id}</h3>
      <p>Poziom wody: {field.water}</p>
      <p>Zdrowie: {field.health}</p>
      <Crop crop={field.crop} />
      <button onClick={() => onWater(field.id)}>Podlej pole</button>
      <button onClick={() => onPlant(field.id, 'Pszenica')}>Zasadź Pszenicę</button>
      <button onClick={() => onPlant(field.id, 'Kukurydza')}>Zasadź Kukurydzę</button>
    </div>
  );
};

export default Field;
