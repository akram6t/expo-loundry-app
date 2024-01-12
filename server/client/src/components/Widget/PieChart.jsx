import React, { useEffect, useState } from "react";
import Chart from "chart.js/auto";
// import { Bar } from "react-chartjs-2";
import { Pie } from "react-chartjs-2";
import "./widget.css";
// import { order_status } from "../../data/order_status";

Chart.register();

function PieChart({...props }) {
  const [countArray, setCountArray] = useState([]);
  const data = {
    labels: props.data.map(item => item.tag),
    datasets: [
        {
            data: [...countArray], // Replace with your actual data
            backgroundColor: props.data.map(item => item.color),
            hoverBackgroundColor: props.data.map(item => item.color),
          }
    ],
  };

  const options = {
    responsive: true,
    // maintainAspectRatio: false,
    aspectRatio: 1,
  };

useEffect(() => {
  const cArr = props.data.map(item => {
    return item.count !== null ? item.count : 0;
  })
  setCountArray(cArr);
}, [props.data]);

  return (
    <div className={`widgetCard p-3 md:py-4 md:px-6 ${props.className}`}>
      <h1 className="text-medium font-semibold pb-4">Order Status</h1>
      <div className="">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
}

export default PieChart;
