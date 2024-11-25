import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const FieldStatistics = ({ field, onClose }) => {
  const { daneWoda, daneZdrowie } = field;

  const data = {
    labels: daneWoda.map((_, index) => `Dzień ${index + 1}`),
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
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Statystyki pola ${field.id}`,
      },
    },
  };

  return (
    <div style={{ position: 'relative', top: '10%', left: '10%', width: '80%', height: '50%', background: 'white', border: '1px solid black', padding: '20px', zIndex: 1000 }}>
      <h2>Statystyki pola {field.id}</h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default FieldStatistics;
