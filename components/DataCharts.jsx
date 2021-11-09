import React from "react";
import { Bar } from "react-chartjs-2";

const DataCharts = ({ data: { singleStep } }) => {
  console.log("🚀 ~ file: DataCharts.jsx ~ line 5 ~ DataCharts ~ data", data);
  return (
    <div>
      <h1>Results</h1>
      {/* <Bar /> */}
    </div>
  );
};

export default DataCharts;
