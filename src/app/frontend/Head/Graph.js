"use client";

import React, { useEffect, useRef, useState } from "react";
import { createChart, LineSeries } from "lightweight-charts";
import { useRouter } from "next/navigation";

const Graph = ({ companyName, api }) => {
  const chartRef = useRef(null);
    const router = useRouter();
  const [change, setChange] = useState(0);
  const [changePercent, setChangePercent] = useState(0);
  const [isProfit, setIsProfit] = useState(true);
const senddata = (api,companyName) => {
  router.push(
  `./frontend/Head/SubGraph?api=${encodeURIComponent(api)}&company=${encodeURIComponent(companyName)}`
);
};

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = createChart(chartRef.current, {
      width: 300,
      height: 150,
      

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

    const lineSeries = chart.addSeries(LineSeries, {
      color: "#22c55e",
      lineWidth: 2,
    });

    const fetchData = async () => {
      try {
        const response = await fetch(api);
        const data = await response.json();

        const formattedData = data.prices.map((item) => ({
          time: Math.floor(item[0] / 1000),
          value: item[1],
        }));

        lineSeries.setData(formattedData);

        const firstPrice = formattedData[0]?.value;
        const lastPrice =
          formattedData[formattedData.length - 1]?.value;

        if (
          firstPrice !== undefined &&
          lastPrice !== undefined
        ) {
          const diff = lastPrice - firstPrice;
          const percent = (diff / firstPrice) * 100;

          setChange(diff);
          setChangePercent(percent);
          setIsProfit(diff >= 0);

          lineSeries.applyOptions({
            color: diff >= 0 ? "#22c55e" : "#ef4444",
          });
        }

        chart.timeScale().fitContent();
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
    <div className="bg-gray-900 p-4 rounded-lg shadow-lg cursor-pointer" onClick={()=>senddata(api,companyName)}>
      <h2 className="text-white text-xl font-bold mb-2">
        {companyName}
      </h2>

      <div className="flex items-center gap-3 mb-4">
        <span
          className={`text-lg font-bold ${
            isProfit ? "text-green-500" : "text-red-500"
          }`}
        >
          {isProfit ? "▲" : "▼"} {Math.abs(change).toFixed(2)}
        </span>

        <span
          className={`font-semibold ${
            isProfit ? "text-green-500" : "text-red-500"
          }`}
        >
          ({isProfit ? "+" : "-"}
          {Math.abs(changePercent).toFixed(2)}%)
        </span>
      </div>

      <div ref={chartRef} />
    </div>
  );
};

export default Graph;