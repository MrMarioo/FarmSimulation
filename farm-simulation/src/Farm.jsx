import React, { useState, useEffect } from "react";
import Field from "./Field";
import EventLog from "./EventLog";

const Farm = () => {
  const [fields, setFields] = useState([
    {
      id: 1,
      crop: null,
      water: 100,
      health: 100,
      growthStage: 0,
      growthTime: 0,
      readyToHarvest: false,
      daneWoda: [100],
      daneZdrowie: [100],
    },
    {
      id: 2,
      crop: null,
      water: 100,
      health: 100,
      growthStage: 0,
      growthTime: 0,
      readyToHarvest: false,
      daneWoda: [100],
      daneZdrowie: [100],
    },
    {
      id: 3,
      crop: null,
      water: 100,
      health: 100,
      growthStage: 0,
      growthTime: 0,
      readyToHarvest: false,
      daneWoda: [100],
      daneZdrowie: [100],
    },
  ]);
  const [eventLog, setEventLog] = useState([]);
  const [day, setDay] = useState(1);
  const [points, setPoints] = useState(0); // Nowy stan dla punktów

  const logEvent = (message) => {
    setEventLog((prevLog) => [`Day ${day}: ${message}`, ...prevLog]);
  };

  // Funkcja do aktualizacji wzrostu roślin
  const updateGrowth = (field) => {
    if       (field.growthStage > 0 && !field.readyToHarvest) {
      if (field.growthTime > 0) {
        return { ...field, growthTime: field.growthTime - 1 };
      } else {
        logEvent(
          `Uprawa ${field.crop} na polu ${field.id} jest gotowa do zbiorów!`
        );
        return { ...field, readyToHarvest: true };
      }
    }
    return field;
  };

  useEffect(() => {
    const randomEvent = Math.random();

    if (randomEvent < 0.) {
      logEvent("Deszcz zwiększył poziom wody.");
      setFields(fields.map((field) => ({ ...field, water: field.water + 20 })));
    } else if (randomEvent < 0.5) {
      logEvent("Susza obniżyła poziom wody.");
      setFields(fields.map((field) => ({ ...field, water: field.water - 20 })));
    } else if (randomEvent < 0.7) {
      logEvent("Szkodniki zaatakowały uprawy!");
      setFields(
        fields.map((field) =>
          field.crop ? { ...field, health: field.health - 20 } : field
        )
      );
    }

    // Zwiększ dzień co kilka sekund
    const timer = setTimeout(() => {
      setDay(day + 1);
      // Aktualizuj wzrost roślin na każdym polu
      setFields(fields.map((field) => updateGrowth(field)));
    }, 5000);
    return () => clearTimeout(timer);
  }, [day, fields]);

  const plantCrop = (id, crop, growthTime) => {
    setFields(
      fields.map((field) =>
        field.id === id
          ? {
              ...field,
              crop: crop,
              health: 100,
              water: 100,
              growthStage: 1,
              growthTime: growthTime,
              readyToHarvest: false,
            }
          : field
      )
    );
    logEvent(`Zasadzono ${crop} na polu ${id}.`);
  };

  const waterField = (id) => {
    setFields(
      fields.map((field) =>
        field.id === id
          ? {
              ...field,
              water: field.water + 10,
              daneWoda: [...field.daneWoda, field.water + 10],
            }
          : field
      )
    );
    logEvent(`Podlano pole ${id}.`);
  };

  // Funkcja do zbioru plonów
  const harvestCrop = (id) => {
    const field = fields.find((f) => f.id === id);
    if (field && field.readyToHarvest) {
      logEvent(`Zebrano ${field.crop} z pola ${id}.`);
      setPoints(points + 100); // Dodawanie punktów za zbiory
      setFields(
        fields.map((f) =>
          f.id === id
            ? { ...f, crop: null, growthStage: 0, readyToHarvest: false }
            : f
        )
      );
    }
  };

  return (
    <div>
      <h2>Farma</h2>
      <p>Dzień: {day}</p>
      <p>Punkty: {points}</p>
      <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
        {fields.map((field) => (
          <Field
            key={field.id}
            field={field}
            onPlant={plantCrop}
            onWater={waterField}
            onHarvest={harvestCrop}
          />
        ))}
      </div>
      <EventLog log={eventLog} />
    </div>
  );
};

export default Farm;
