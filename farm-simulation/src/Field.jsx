import React from "react";
import Crop from "./Crop";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartSimple } from "@fortawesome/free-solid-svg-icons";

const Field = ({ field, onPlant, onWater, onFertilize, onHarvest, onShowStatistics }) => {
  return (
    <div
      style={{
        border: "1px solid black",
        padding: "10px",
        width: "175px",
      }}
    >
      <h3>Pole {field.id}</h3>
      <p>Poziom wody: {field.water}</p>
      <p>Zdrowie: {field.health}</p>
      <p>Poziom wzrostu: {field.growthProgress}%</p>
      <Crop crop={field.crop} readyToHarvest={field.readyToHarvest} />

      {!field.readyToHarvest ? (
        <>
          <button onClick={() => onWater(field.id)}>Podlej pole</button>
          <button onClick={() => onFertilize(field.id)}>Nawóź pole</button>
          <button onClick={() => onPlant(field.id, "pszenica", 3)}>
            Zasadź Pszenicę
          </button>
          <button onClick={() => onPlant(field.id, "kukurydza", 5)}>
            Zasadź Kukurydzę
          </button>
        </>
      ) : (
        <button onClick={() => onHarvest(field.id)}>Zbierz plony</button>
      )}

      <button
        onClick={() => onShowStatistics(field)}
        style={{ marginTop: "10px", cursor: "pointer" }}
      >
        Statystyki
      </button>
    </div>
  );
};

export default Field;
