"use client";

import React, { useEffect, useRef } from "react";
import { createChart, LineSeries } from "lightweight-charts";

const Graph = ({ companyName, api }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = createChart(chartRef.current, {
      width: 500,
      height: 250,

      layout: {
        background: {
          color: "#111827",
        },
        textColor: "#ffffff",
      },

      grid: {
        vertLines: {
          color: "#374151",
        },
        horzLines: {
          color: "#374151",
        },
      },
    });

    const lineSeries = chart.addSeries(LineSeries);

    const fetchData = async () => {
      try {
        const response = await fetch(api);
        const data = await response.json();

        const formattedData = data.prices.map((item) => ({
          time: Math.floor(item[0] / 1000),
          value: item[1],
        }));

        lineSeries.setData(formattedData);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    fetchData();

    return () => {
      chart.remove();
    };
  }, [api]);

  return (
    <div className="bg-gray-900 p-4 rounded-lg shadow-lg">
      <h2 className="text-white text-xl font-bold mb-4">
        {companyName}
      </h2>

      <div ref={chartRef}></div>
    </div>
  );
};

export default Graph;