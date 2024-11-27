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
      growthProgress: 0,
      growthRateModifier: 21,
      plantedDay: 0,
      growthTime: 0,
      readyToHarvest: false,
      daneWoda: [100],
      daneZdrowie: [100],
      daneWzrostu: [0],
    },
  ]);

  const [resources, setResources] = useState({
    water: 500,
    fertilizers: 100,
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
    const K = 100;
    const P0 = 10;

    const averageWater = field.water / 100;
    const averageFertilizer = field.health / 100;

    const baseRate = 0.05 + (0.1 * (averageWater + averageFertilizer)) / 2;
    const r = baseRate * field.growthRateModifier;

    const newGrowthProgress = logisticGrowth(K, P0, r, t);

    return {
      ...field,
      growthProgress: Math.min(newGrowthProgress, 100).toFixed(2),
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

  const plantCrop = (id, crop, growthTime) => {
    setFields((prevFields) =>
      prevFields.map((field) =>
        field.id === id
          ? {
              ...field,
              crop: crop,
              growthStage: 1,
              plantedDay: day, // Zapis dnia zasadzenia
              readyToHarvest: false,
              daneZdrowie: [10], // Startowe zdrowie
              daneWoda: [100], // Startowe nawodnienie
            }
          : field
      )
    );
    logEvent(`Zasadzono ${crop} na polu ${id}.`);
  };

  // Generowanie losowej prognozy pogody
  const generateWeather = () => {
    const weatherOptions = ["sunny", "rain", "drought"];
    const randomWeather =
      weatherOptions[Math.floor(Math.random() * weatherOptions.length)];

    switch (randomWeather) {
      case "sunny":
        logEvent("Słoneczny dzień. Brak zmian na polach.");
        break;

      case "rain":
        setFields((prevFields) =>
          prevFields.map((field) =>
            synchronizeFieldData({
              ...field,
              water: Math.min(field.water + 30, 100),
            })
          )
        );
        logEvent("Deszcz zwiększył poziom wody na polach.");
        break;

      case "drought":
        setFields((prevFields) =>
          prevFields.map((field) =>
            synchronizeFieldData({
              ...field,
              water: Math.max(field.water - 20, 0),
              health: Math.max(field.health - 10, 0),
            })
          )
        );
        logEvent("Susza obniżyła poziom wody i zdrowie roślin.");
        break;

      default:
        logEvent("Nieznana pogoda.");
    }

    setWeather(randomWeather);
    logEvent(`Prognoza pogody na dziś: ${randomWeather}`);
  };

  useEffect(() => {
    const randomEventChance = Math.random();
    let eventOccurred = false; // Flaga sprawdzająca, czy zdarzenie wystąpiło

    if (daysSinceLastEvent >= 3) {
      if (randomEventChance < 0.3) {
        eventOccurred = true;
        logEvent("Deszcz zwiększył poziom wody.");
        setFields((prevFields) =>
          prevFields.map((field) => ({
            ...field,
            water: Math.min(field.water + 20, 100),
          }))
        );
      } else if (randomEventChance < 0.5) {
        eventOccurred = true;
        logEvent("Susza obniżyła poziom wody.");
        setFields((prevFields) =>
          prevFields.map((field) => ({
            ...field,
            water: Math.max(field.water - 20, 0),
          }))
        );
      } else if (randomEventChance < 0.7) {
        eventOccurred = true;
        logEvent("Szkodniki zaatakowały uprawy!");
        setFields((prevFields) =>
          prevFields.map((field) => ({
            ...field,
            health: Math.max(field.health - 20, 0),
          }))
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
    if (tools.irrigationSystem) {
      // Podlewanie automatyczne co 3 dni
      if (day % 3 === 0) {
        setFields((prevFields) =>
          prevFields.map((field) => ({
            ...field,
            water: Math.min(field.water + 20, 100), // Nawadnianie bez przekraczania 100
            daneWoda: [...field.daneWoda, Math.min(field.water + 20, 100)],
          }))
        );
        logEvent("System nawadniania automatycznie podlał wszystkie pola.");
      }
    }
  }, [day, tools.irrigationSystem]);

  useEffect(() => {
    if (buildings.mill) {
      if (day % 5 === 0) {
        // Młyn działa co 5 dni
        setPoints((prevPoints) => prevPoints + 50); // Dodawanie dodatkowych punktów
        logEvent(
          "Młyn automatycznie przetworzył plony, uzyskano 50 dodatkowych punktów."
        );
      }
    }
    if (tools.harvester) {
      setFields((prevFields) =>
        prevFields.map((field) => {
          if (field.readyToHarvest) {
            // Automatyczne zbieranie plonów
            let harvestPoints = 100; // Podstawowa liczba punktów za zbiory

            // Zwiększenie liczby punktów, jeśli użytkownik posiada młyn
            if (buildings.mill) {
              harvestPoints += 50; // Dodatkowe 50 punktów za przetworzenie plonów w młynie
              logEvent(
                `Plony z pola ${field.id} zostały przetworzone w młynie, zyskano dodatkowe punkty.`
              );
            }

            // Zwiększenie punktów, jeśli użytkownik posiada magazyn
            if (buildings.warehouse) {
              harvestPoints = Math.floor(harvestPoints * 1.2); // Zwiększenie o 20%
              logEvent(
                `Plony z pola ${field.id} zostały przechowane w magazynie, zyskano dodatkowe punkty.`
              );
            }

            setPoints((prevPoints) => prevPoints + harvestPoints); // Aktualizacja liczby punktów
            logEvent(
              `Harvester automatycznie zebrał ${field.crop} z pola ${field.id}, uzyskano ${harvestPoints} punktów.`
            );
            return {
              ...field,
              crop: null,
              growthStage: 0,
              readyToHarvest: false,
            }; // Resetowanie pola
          }
          return field;
        })
      );
    }

    // Logika działania narzędzia Seeder - automatyczne sadzenie
    if (tools.seeder) {
      let anyFieldSeeded = false; // Flaga, która sprawdzi, czy udało się zasiać jakiekolwiek pole

      setFields((prevFields) =>
        prevFields.map((field) => {
          if (!field.crop) {
            anyFieldSeeded = true; // Ustawiamy flagę, jeśli udało się zasiać pole
            return {
              ...field,
              crop: "Pszenica",
              growthStage: 1,
              growthTime: 3,
            };
          }
          return field;
        })
      );

      if (anyFieldSeeded) {
        logEvent("Seeder automatycznie zasiał pszenicę na dostępnych polach.");
      }
    }
  }, [day]);

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
                health: Math.min(field.health + 10, 100),
              })
            : field
        )
      );
      setResources({ ...resources, fertilizers: resources.fertilizers - 5 });
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
      <button onClick={buyMill}>Kup młyn (400 punktów)</button>
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
