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

  const [eventLog, setEventLog] = useState([]);
  const [day, setDay] = useState(1);
  const [points, setPoints] = useState(1000); // Punkty za zbiory
  const [daysSinceLastEvent, setDaysSinceLastEvent] = useState(0); // Licznik dni od ostatniego losowego zdarzenia
  const [weather, setWeather] = useState("sunny"); // Prognoza pogody

  const logEvent = (message) => {
    setEventLog((prevLog) => [`Day ${day}: ${message}`, ...prevLog]);
  };

  const updateGrowth = (field) => {
    if (field.growthStage > 0 && !field.readyToHarvest) {
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

  // Generowanie losowej prognozy pogody
  const generateWeather = () => {
    const weatherOptions = ["sunny", "rain", "drought"];
    const randomWeather =
      weatherOptions[Math.floor(Math.random() * weatherOptions.length)];

    switch (randomWeather) {
      case "sunny":
        // Brak wpływu na pola, dzień bez zmian
        logEvent("Słoneczny dzień. Brak zmian na polach.");
        break;

      case "rain":
        // Deszcz: zwiększa poziom wody na wszystkich polach
        setFields((prevFields) =>
          prevFields.map((field) => ({
            ...field,
            water: Math.min(field.water + 30, 100), // Zwiększamy wodę maksymalnie do 100
            daneWoda: [...field.daneWoda, Math.min(field.water + 30, 100)],
          }))
        );
        logEvent("Deszcz zwiększył poziom wody na polach.");
        break;

      case "drought":
        // Susza: obniża poziom wody i zdrowie roślin
        setFields((prevFields) =>
          prevFields.map((field) => ({
            ...field,
            water: Math.max(field.water - 20, 0), // Zmniejszamy wodę, minimalnie do 0
            health: Math.max(field.health - 10, 0), // Zmniejszamy zdrowie, minimalnie do 0
            daneWoda: [...field.daneWoda, Math.max(field.water - 20, 0)],
            daneZdrowie: [...field.daneZdrowie, Math.max(field.health - 10, 0)],
          }))
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
    // Generowanie nowej pogody każdego dnia

    const randomEventChance = Math.random();
    if (daysSinceLastEvent >= 3) {
      if (randomEventChance < 0.3) {
        logEvent("Deszcz zwiększył poziom wody.");
        setFields(
          fields.map((field) => ({ ...field, water: field.water + 20 }))
        );
      } else if (randomEventChance < 0.5) {
        logEvent("Susza obniżyła poziom wody.");
        setFields(
          fields.map((field) => ({ ...field, water: field.water - 20 }))
        );
      } else if (randomEventChance < 0.7) {
        logEvent("Szkodniki zaatakowały uprawy!");
        setFields(
          fields.map((field) =>
            field.crop ? { ...field, health: field.health - 20 } : field
          )
        );
      }
      setDaysSinceLastEvent(0);
    }

    const timer = setTimeout(() => {
      setDaysSinceLastEvent(daysSinceLastEvent + 1);
      setDay(day + 1);
      generateWeather();
      setFields(fields.map((field) => updateGrowth(field)));
    }, 5000);
    return () => clearTimeout(timer);
  }, [day, fields, daysSinceLastEvent]);

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
    
      setFields(prevFields =>
        prevFields.map(field => {
          if (!field.crop) {
            anyFieldSeeded = true; // Ustawiamy flagę, jeśli udało się zasiać pole
            return { ...field, crop: "Pszenica", growthStage: 1, growthTime: 3 };
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
      setResources({ ...resources, water: resources.water - 10 }); // Zużycie wody
      logEvent(`Podlano pole ${id}. Zużyto 10 jednostek wody.`);
    } else {
      logEvent("Brak wystarczającej ilości wody do podlania.");
    }
  };

  // Funkcja do nawożenia (zmniejsza zasoby nawozów)
  const fertilizeField = (id) => {
    if (resources.fertilizers > 0) {
      setFields(
        fields.map((field) =>
          field.id === id
            ? {
                ...field,
                health: field.health + 10,
                daneZdrowie: [...field.daneZdrowie, field.health + 10],
              }
            : field
        )
      );
      setResources({ ...resources, fertilizers: resources.fertilizers - 5 }); // Zużycie nawozów
      logEvent(`Nawożono pole ${id}. Zużyto 5 jednostek nawozów.`);
    } else {
      logEvent("Brak wystarczającej ilości nawozów.");
    }
  };

  // Funkcja do zbioru plonów
  const harvestCrop = (id) => {
    const field = fields.find((f) => f.id === id);
    if (field && field.readyToHarvest) {
      let harvestPoints = 100; // Podstawowa liczba punktów za zbiory

      // Zwiększenie liczby punktów, jeśli użytkownik posiada młyn
      if (buildings.mill) {
        harvestPoints += 50; // Dodatkowe 50 punktów za przetworzenie plonów w młynie
        logEvent(
          `Plony z pola ${id} zostały przetworzone w młynie, zyskano dodatkowe punkty.`
        );
      }

      // Zwiększenie limitu przechowywania, jeśli użytkownik posiada magazyn
      if (buildings.warehouse) {
        harvestPoints += 20; // Dodatkowe 20 punktów za możliwość przechowywania większej ilości plonów
        logEvent(
          `Plony z pola ${id} zostały przechowane w magazynie, zyskano dodatkowe punkty.`
        );
      }

      setPoints(points + harvestPoints); // Aktualizacja liczby punktów
      logEvent(
        `Zebrano ${field.crop} z pola ${id}, uzyskano ${harvestPoints} punktów.`
      );
      setFields(
        fields.map((f) =>
          f.id === id
            ? { ...f, crop: null, growthStage: 0, readyToHarvest: false }
            : f
        )
      );
    } else {
      logEvent("Nie ma gotowych do zbioru plonów na tym polu.");
    }
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
          />
        ))}
      </div>
      <EventLog log={eventLog} />
    </div>
  );
};

export default Farm;
