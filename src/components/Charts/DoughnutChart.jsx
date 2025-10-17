import { Doughnut } from "react-chartjs-2";
import {
Chart as ChartJS,
ArcElement,
Tooltip,
Legend,
Title,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const DoughnutChart = ({ chartData, chartOptions }) => {
const defaultOptions = {
responsive: true,
plugins: {
legend: {
position: "top",
},
title: {
display: true,
text: "Decks por Matéria",
font: {
size: 16,
},
},
},
};

const options = { ...defaultOptions, ...chartOptions };

return <Doughnut data={chartData} options={options} />;

};

export default DoughnutChart;