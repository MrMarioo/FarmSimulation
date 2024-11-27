import React, { useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const FieldStatistics = ({ field, onClose }) => {
  const { daneWoda, daneZdrowie, daneWzrostu } = field;

  const chartRef = useRef(null); // Referencja do wykresu

  const data = {
    labels: daneWzrostu.map((_, index) => `Dzień ${index + 1}`),
    datasets: [
      {
        label: 'Poziom Wody',
        data: daneWoda,
        borderColor: 'blue',
        backgroundColor: 'rgba(0, 0, 255, 0.2)',
        borderWidth: 2,
      },
      {
        label: 'Zdrowie Rośliny',
        data: daneZdrowie,
        borderColor: 'green',
        backgroundColor: 'rgba(0, 255, 0, 0.2)',
        borderWidth: 2,
      },
      {
        label: 'Poziom Wzrostu',
        data: daneWzrostu,
        borderColor: 'orange',
        backgroundColor: 'rgba(255, 165, 0, 0.2)',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: `Statystyki pola ${field.id}` },
    },
  };

  const downloadChart = () => {
    // Pobranie elementu canvas i zapisanie go jako obraz
    const chartInstance = chartRef.current;
    if (chartInstance) {
      const url = chartInstance.toBase64Image();
      const link = document.createElement('a');
      link.href = url;
      link.download = `Statystyki_Pola_${field.id}.png`;
      link.click();
    }
  };

  return (
    <div
      style={{
        position: "relative",
        top: "10%",
        left: "10%",
        width: "80%",
        height: "50%",
        background: "white",
        border: "1px solid black",
        padding: "20px",
        zIndex: 1000,
      }}
    >
      <h2>Statystyki pola {field.id}</h2>
      <Line ref={chartRef} data={data} options={options} />
      <button
        onClick={downloadChart}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Pobierz Wykres
      </button>
    </div>
  );
};

export default FieldStatistics;
