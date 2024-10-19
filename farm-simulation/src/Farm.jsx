import React, { useState, useEffect } from 'react';
import Field from './Field';
import EventLog from './EventLog';

const Farm = () => {
  const [fields, setFields] = useState([
    { id: 1, crop: null, water: 100, health: 100 },
    { id: 2, crop: null, water: 100, health: 100 },
    { id: 3, crop: null, water: 100, health: 100 },
  ]);
  const [eventLog, setEventLog] = useState([]);
  const [day, setDay] = useState(1);

  const logEvent = (message) => {
    setEventLog((prevLog) => [`Day ${day}: ${message}`, ...prevLog]);
  };

  useEffect(() => {
    const randomEvent = Math.random();

    if (randomEvent < 0.3) {
      // Zdarzenie deszczu
      logEvent("Deszcz zwiększył poziom wody.");
      setFields(fields.map(field => ({ ...field, water: field.water + 20 })));
    } else if (randomEvent < 0.5) {
      // Zdarzenie suszy
      logEvent("Susza obniżyła poziom wody.");
      setFields(fields.map(field => ({ ...field, water: field.water - 20 })));
    } else if (randomEvent < 0.7) {
      // Szkodniki
      logEvent("Szkodniki zaatakowały uprawy!");
      setFields(fields.map(field => 
        field.crop ? { ...field, health: field.health - 20 } : field
      ));
    }

    // Zwiększ dzień co kilka sekund
    const timer = setTimeout(() => setDay(day + 1), 5000);
    return () => clearTimeout(timer);
  }, [day, fields]);

  const plantCrop = (id, crop) => {
    setFields(fields.map(field =>
      field.id === id ? { ...field, crop: crop, health: 100 } : field
    ));
    logEvent(`Zasadzono ${crop} na polu ${id}.`);
  };

  const waterField = (id) => {
    setFields(fields.map(field =>
      field.id === id ? { ...field, water: field.water + 10 } : field
    ));
    logEvent(`Podlano pole ${id}.`);
  };

  return (
    <div>
      <h2>Farma</h2>
      <p>Dzień: {day}</p>
      <div style={{ display: 'flex', gap: '10px', justifyContent: "center" }}>
        {fields.map(field => (
          <Field
            key={field.id}
            field={field}
            onPlant={plantCrop}
            onWater={waterField}
          />
        ))}
      </div>
      <EventLog log={eventLog} />
    </div>
  );
};

export default Farm;
