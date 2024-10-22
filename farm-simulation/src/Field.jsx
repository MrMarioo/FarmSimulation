import React from "react";
import Crop from "./Crop";

const Field = ({ field, onPlant, onWater, onFertilize, onHarvest }) => {
  return (
    <div style={{ border: "1px solid black", padding: "10px", width: "150px" }}>
      <h3>Pole {field.id}</h3>
      <p>Poziom wody: {field.water}</p>
      <p>Zdrowie: {field.health}</p>
      <Crop crop={field.crop} readyToHarvest={field.readyToHarvest} />

      {!field.readyToHarvest ? (
        <>
          <button onClick={() => onWater(field.id)}>Podlej pole</button>
          <button onClick={() => onFertilize(field.id)}>Nawóź pole</button>
          <button onClick={() => onPlant(field.id, "Pszenica", 3)}>
            Zasadź Pszenicę
          </button>
          <button onClick={() => onPlant(field.id, "Kukurydza", 5)}>
            Zasadź Kukurydzę
          </button>
        </>
      ) : (
        <button onClick={() => onHarvest(field.id)}>Zbierz plony</button>
      )}
    </div>
  );
};

export default Field;
