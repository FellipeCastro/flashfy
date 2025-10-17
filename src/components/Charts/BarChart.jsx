import { Bar } from "react-chartjs-2";
import {
Chart as ChartJS,
CategoryScale,
LinearScale,
BarElement,
Title,
Tooltip,
Legend,
} from "chart.js";

ChartJS.register(
CategoryScale,
LinearScale,
BarElement,
Title,
Tooltip,
Legend
);

const BarChart = ({ chartData, chartOptions }) => {
const defaultOptions = {
responsive: true,
plugins: {
legend: {
position: "top",
},
title: {
display: true,
text: "Atividade de Estudo",
font: {
size: 16,
},
},
},
scales: {
y: {
ticks: {
stepSize: 1, // Garante que o eixo Y mostre apenas números inteiros
},
},
},
};

const options = { ...defaultOptions, ...chartOptions };

return <Bar data={chartData} options={options} />;

};

export default BarChart;