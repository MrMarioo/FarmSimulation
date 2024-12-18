import React, { useState, useEffect } from "react";
import Field from "./Field";
import EventLog from "./EventLog";
import FieldStatistics from "./FieldStatistic";
import Modal from "./Modal";

const Farm = () => {
  const [fields, setFields] = useState([
    {
      id: 1,
      crop: null,
      water: 100,
      health: 100,
      growthStage: 0,
      cropType: null,
      growthProgress: 0,
      growthRateModifier: 1,
      plantedDay: 0,
      growthTime: 0,
      readyToHarvest: false,
      daneWoda: [100],
      daneZdrowie: [100],
      daneWzrostu: [0],
    },
    {
      id: 2,
      crop: null,
      water: 100,
      health: 100,
      growthStage: 0,
      cropType: null,
      growthProgress: 0,
      growthRateModifier: 1,
      plantedDay: 0,
      growthTime: 0,
      readyToHarvest: false,
      daneWoda: [100],
      daneZdrowie: [100],
      daneWzrostu: [0],
    },
  ]);

  const cropModifiers = {
    pszenica: {
      growthRate: 1.2, 
      eventVulnerability: 1.5,
    },
    kukurydza: {
      growthRate: 0.8,
      eventVulnerability: 0.7,
    },
  };

  const [resources, setResources] = useState({
    water: 500,
    fertilizers: 1000,
    pesticides: 50,
  });

  const [buildings, setBuildings] = useState({
    warehouse: false, // Magazyn do przechowywania plonów
    mill: false, // Młyn do przetwarzania plonów
  });

  const [tools, setTools] = useState({
    irrigationSystem: false, // System automatycznego nawadniania
    harvester: false, // Narzędzie do szybszego zbierania plonów
    seeder: false, // Narzędzie do automatycznego sadzenia
  });

  const logisticGrowth = (K, P0, r, t) => {
    return K / (1 + ((K - P0) / P0) * Math.exp(-r * t));
  };

  const buyWarehouse = () => {
    if (points >= 300) {
      setBuildings({ ...buildings, warehouse: true });
      setPoints(points - 300);
      logEvent("Zakupiono magazyn.");
    } else {
      logEvent("Brak wystarczających punktów na zakup magazynu.");
    }
  };

  const buyMill = () => {
    if (points >= 400) {
      setBuildings({ ...buildings, mill: true });
      setPoints(points - 400);
      logEvent("Zakupiono młyn.");
    } else {
      logEvent("Brak wystarczających punktów na zakup młyna.");
    }
  };

  const buyIrrigationSystem = () => {
    if (points >= 500) {
      setTools({ ...tools, irrigationSystem: true });
      setPoints(points - 500);
      logEvent("Zakupiono system nawadniania.");
    } else {
      logEvent("Brak wystarczających punktów na zakup systemu nawadniania.");
    }
  };

  const buyHarvester = () => {
    if (points >= 300) {
      setTools({ ...tools, harvester: true });
      setPoints(points - 300);
      logEvent("Zakupiono narzędzie do zbioru.");
    } else {
      logEvent("Brak wystarczających punktów na zakup narzędzia do zbioru.");
    }
  };

  const buySeeder = () => {
    if (points >= 400) {
      setTools({ ...tools, seeder: true });
      setPoints(points - 400);
      logEvent("Zakupiono Seeder, który automatycznie zasiewa pola.");
    } else {
      logEvent("Brak wystarczających punktów na zakup Seeder.");
    }
  };

  const [selectedField, setSelectedField] = useState(null);
  const [eventLog, setEventLog] = useState([]);
  const [day, setDay] = useState(1);
  const [points, setPoints] = useState(1000); // Punkty za zbiory
  const [daysSinceLastEvent, setDaysSinceLastEvent] = useState(0); // Licznik dni od ostatniego losowego zdarzenia
  const [weather, setWeather] = useState("sunny"); // Prognoza pogody

  const logEvent = (message) => {
    setEventLog((prevLog) => [`Day ${day}: ${message}`, ...prevLog]);
  };

  const synchronizeFieldData = (field) => ({
    ...field,
    daneWoda: [...field.daneWoda, field.water],
    daneZdrowie: [...field.daneZdrowie, field.health],
    daneWzrostu: [...field.daneWzrostu, field.growthProgress],
  });

  const updateGrowth = (field, day) => {
    if (field.growthProgress >= 100) {
      return {
        ...field,
        readyToHarvest: true,
      };
    }
  
    const t = day - field.plantedDay;
    const K = 100; // Maksymalny poziom wzrostu
    const P0 = 10; // Początkowy poziom wzrostu
  
    const averageWater = Math.max(field.water / 100, 0); // Normalizujemy do przedziału [0, 1]
    const averageFertilizer = Math.max(field.health / 100, 0); // Normalizujemy do przedziału [0, 1]
  
    const cropModifier = cropModifiers[field.cropType] || { growthRate: 1 };
  
    // Bazowy współczynnik wzrostu (zmniejszony wpływ wody i nawozu)
    const baseRate = 0.03 + (0.05 * (averageWater + averageFertilizer)) / 2;
  
    // Minimalny wzrost nawet przy zerowym poziomie wody i zdrowia
    const r = Math.max(baseRate * field.growthRateModifier * cropModifier.growthRate, 0.01);
  
    // Obliczenie nowego poziomu wzrostu
    const newGrowthProgress = logisticGrowth(K, P0, r, t);
  
    return {
      ...field,
      growthProgress: Math.min(newGrowthProgress, 100).toFixed(0),
    };
  };
  

  const buyNewField = () => {
    if (points >= 200) {
      const newField = {
        id: fields.length + 1,
        crop: null,
        water: 100,
        health: 100,
        growthStage: 0,
        growthTime: 0,
        readyToHarvest: false,
        daneWoda: [100],
        daneZdrowie: [100],
      };
      setFields([...fields, newField]);
      setPoints(points - 200);
      logEvent(`Zakupiono nowe pole!`);
    } else {
      logEvent("Brak wystarczających punktów na zakup nowego pola.");
    }
  };

  const plantCrop = (id, cropType) => {
    setFields((prevFields) =>
      prevFields.map((field) =>
        field.id === id
          ? {
              ...field,
              crop: cropType === "pszenica" ? "Pszenica" : "Kukurydza",
              cropType: cropType,
              growthStage: 1,
              plantedDay: day,
              readyToHarvest: false,
              growthProgress: 0,
              daneZdrowie: [field.health],
              daneWoda: [field.water],
              daneWzrostu: [0],
            }
          : field
      )
    );
    logEvent(`Zasadzono ${cropType} na polu ${id}.`);
  };
  

  // Generowanie losowej prognozy pogody
  const generateWeather = () => {
    const weatherOptions = ["sunny", "sunny","sunny","sunny","rain","rain","rain", "drought", "drought"];
    const randomWeather =
      weatherOptions[Math.floor(Math.random() * weatherOptions.length)];
  
    switch (randomWeather) {
      case "rain":
        setFields((prevFields) =>
          prevFields.map((field) => ({
            ...field,
            water: Math.min(field.water + 15, 100), // Zmniejszono wpływ deszczu
            daneWoda: [...field.daneWoda, Math.min(field.water + 15, 100)],
          }))
        );
        logEvent("Deszcz zwiększył poziom wody.");
        break;
  
      case "drought":
        setFields((prevFields) =>
          prevFields.map((field) => {
            const cropModifier =
              cropModifiers[field.cropType] || { eventVulnerability: 1 };
            const waterLoss = 5 * cropModifier.eventVulnerability; // Zmniejszono utratę wody
            const healthLoss = 3 * cropModifier.eventVulnerability; // Zmniejszono utratę zdrowia
  
            return {
              ...field,
              water: Math.max(field.water - waterLoss, 0),
              health: Math.max(field.health - healthLoss, 0),
              daneWoda: [...field.daneWoda, Math.max(field.water - waterLoss, 0)],
              daneZdrowie: [
                ...field.daneZdrowie,
                Math.max(field.health - healthLoss, 0),
              ],
            };
          })
        );
        logEvent("Susza obniżyła poziom wody i zdrowie roślin.");
        break;
  
      default:
        logEvent("Słoneczny dzień. Brak zmian.");
    }
  };
  
  

  useEffect(() => {
    const randomEventChance = Math.random();
    let eventOccurred = false;

    if (daysSinceLastEvent >= 3) {
      if (randomEventChance < 0.3) {
        eventOccurred = true;
        logEvent("Deszcz zwiększył poziom wody.");
        setFields((prevFields) =>
          prevFields.map((field) => ({
            ...field,
            water: Math.min(field.water + 20, 100), // Deszcz zwiększa poziom wody
            daneWoda: [...field.daneWoda, Math.min(field.water + 20, 100)],
          }))
        );
      }  else if (randomEventChance < 0.5) {
        eventOccurred = true;
        logEvent("Szkodniki zaatakowały uprawy!");
        setFields((prevFields) =>
          prevFields.map((field) => {
            const cropModifier =
              cropModifiers[field.cropType] || { eventVulnerability: 1 };
            const healthLoss = 5 * cropModifier.eventVulnerability; // Szkodniki obniżają zdrowie w zależności od podatności
            return {
              ...field,
              health: Math.max(field.health - healthLoss, 0),
              daneZdrowie: [
                ...field.daneZdrowie,
                Math.max(field.health - healthLoss, 0),
              ],
            };
          })
        );
      }
      setDaysSinceLastEvent(0);
    }
    

    const timer = setTimeout(() => {
      setDay((prevDay) => prevDay + 1);

      setFields((prevFields) =>
        prevFields.map((field) => {
          const updatedField = updateGrowth(field, day + 1);
          return synchronizeFieldData(updatedField);
        })
      );

      setDaysSinceLastEvent((prev) => prev + 1);
      generateWeather();
    }, 5000);

    return () => clearTimeout(timer);
  }, [day, daysSinceLastEvent]);

  useEffect(() => {
    // System automatycznego nawadniania
    if (tools.irrigationSystem) {
      if (day % 10 === 0) {
        setFields((prevFields) =>
          prevFields.map((field) => ({
            ...field,
            water: Math.min(field.water + 20, 100), // Dodanie wody
            daneWoda: [...field.daneWoda, Math.min(field.water + 20, 100)],
          }))
        );
        logEvent("System nawadniania automatycznie podlał wszystkie pola.");
      }
    }
  
    // System automatycznego nawożenia
    if (tools.seeder) {
      if (day % 10 === 0) {
        setFields((prevFields) =>
          prevFields.map((field) => ({
            ...field,
            health: Math.min(field.health + 10, 100), // Dodanie zdrowia przez nawożenie
            daneZdrowie: [...field.daneZdrowie, Math.min(field.health + 10, 100)],
          }))
        );
        logEvent("System nawożenia automatycznie nawoził wszystkie pola.");
      }
    }
  }, [day, tools.irrigationSystem, tools.seeder]);
  

  // Funkcja do zarządzania podlewaniem (zmniejsza zasoby wody)
  const waterField = (id) => {
    if (resources.water > 0) {
      setFields((prevFields) =>
        prevFields.map((field) =>
          field.id === id
            ? synchronizeFieldData({
                ...field,
                water: Math.min(field.water + 10, 100),
              })
            : field
        )
      );
      setResources({ ...resources, water: resources.water - 10 });
      logEvent(`Podlano pole ${id}. Zużyto 10 jednostek wody.`);
    } else {
      logEvent("Brak wystarczającej ilości wody do podlania.");
    }
  };

  // Funkcja do nawożenia (zmniejsza zasoby nawozów)
  const fertilizeField = (id) => {
    if (resources.fertilizers > 0) {
      setFields((prevFields) =>
        prevFields.map((field) =>
          field.id === id
            ? synchronizeFieldData({
                ...field,
                health: Math.min(field.health + 50, 100),
              })
            : field
        )
      );
      setResources({ ...resources, fertilizers: resources.fertilizers - 25 });
      logEvent(`Nawożono pole ${id}. Zużyto 5 jednostek nawozów.`);
    } else {
      logEvent("Brak wystarczającej ilości nawozów.");
    }
  };

  // Funkcja do zbioru plonów
  const harvestCrop = (id) => {
    const field = fields.find((f) => f.id === id);

    if (field && field.readyToHarvest) {
      const harvestPoints = 100;

      logEvent(
        `Zebrano ${field.crop} z pola ${id}, uzyskano ${harvestPoints} punktów.`
      );
      setPoints((prevPoints) => prevPoints + harvestPoints);

      setFields((prevFields) =>
        prevFields.map((f) =>
          f.id === id
            ? {
                ...f,
                crop: null,
                growthProgress: 0,
                readyToHarvest: false,
                daneWzrostu: [...f.daneWzrostu, 0],
              }
            : f
        )
      );
    } else {
      logEvent(`Plon na polu ${id} nie jest jeszcze gotowy do zbioru.`);
    }
  };

  const handleShowStatistics = (field) => {
    setSelectedField(field);
  };

  return (
    <div>
      <h2>Farma</h2>
      <p>Dzień: {day}</p>
      <p>Punkty: {points}</p>
      <p>Prognoza pogody: {weather}</p>
      <div>
        <h3>Zasoby:</h3>
        <p>Woda: {resources.water}</p>
        <p>Nawozy: {resources.fertilizers}</p>
        <p>Pestycydy: {resources.pesticides}</p>
      </div>
      <h3>Zakup nowych zasobów:</h3>
      <button onClick={buyNewField}>Kup nowe pole (200 punktów)</button>
      <button onClick={buyWarehouse}>Kup magazyn (300 punktów)</button>
      <button onClick={buyMill}>Kup system nawożenia (400 punktów)</button>
      <button onClick={buyIrrigationSystem}>
        Kup system nawadniania (500 punktów)
      </button>
      <button onClick={buyHarvester}>
        Kup narzędzie do zbioru (300 punktów)
      </button>
      <button onClick={buySeeder}>Kup Seeder (400 punktów)</button>
      <div
        style={{
          display: "flex",
          gap: "10px",
          justifyContent: "center",
          marginTop: 20,
        }}
      >
        {fields.map((field) => (
          <Field
            key={field.id}
            field={field}
            onPlant={plantCrop}
            onWater={waterField}
            onFertilize={fertilizeField}
            onHarvest={harvestCrop}
            onShowStatistics={handleShowStatistics}
          />
        ))}
        {selectedField && (
          <Modal
            onClose={() => {
              setSelectedField(null);
            }}
          >
            <FieldStatistics field={selectedField} />
          </Modal>
        )}
      </div>
      <EventLog log={eventLog} />
    </div>
  );
};

export default Farm;
