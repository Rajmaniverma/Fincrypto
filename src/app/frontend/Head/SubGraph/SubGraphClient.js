"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createChart, LineSeries } from "lightweight-charts";

const SubGraphClient = () => {
  const chartRef = useRef(null);

  const [change, setChange] = useState(0);
  const [changePercent, setChangePercent] = useState(0);
  const [isProfit, setIsProfit] = useState(true);

  const searchParams = useSearchParams();

  const api = searchParams.get("api") ?? "";
  const companyName =
    searchParams.get("company") ?? "Unknown Company";

  useEffect(() => {
    if (!chartRef.current || !api) return;

    const chart = createChart(chartRef.current, {
      width: chartRef.current.clientWidth,
      height: chartRef.current.clientHeight,

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

      rightPriceScale: {
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },

      timeScale: {
        rightOffset: 5,
        borderColor: "#374151",
      },
    });

    const lineSeries = chart.addSeries(LineSeries, {
      color: "#22c55e",
      lineWidth: 3,
    });

    const fetchData = async () => {
      try {
        const response = await fetch(api);

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();

        let formattedData = [];

        if (data.prices) {
          formattedData = data.prices.map((item) => ({
            time: Math.floor(item[0] / 1000),
            value: item[1],
          }));
        } else if (Array.isArray(data)) {
          formattedData = data.map((item) => ({
            time: Math.floor(item[0] / 1000),
            value: item[4],
          }));
        }

        if (!formattedData.length) return;

        lineSeries.setData(formattedData);

        const firstPrice = formattedData[0].value;
        const lastPrice =
          formattedData[formattedData.length - 1].value;

        const diff = lastPrice - firstPrice;
        const percent = (diff / firstPrice) * 100;

        setChange(diff);
        setChangePercent(percent);
        setIsProfit(diff >= 0);

        lineSeries.applyOptions({
          color: diff >= 0 ? "#22c55e" : "#ef4444",
        });

        chart.timeScale().fitContent();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    const handleResize = () => {
      if (!chartRef.current) return;

      chart.applyOptions({
        width: chartRef.current.clientWidth,
        height: chartRef.current.clientHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [api]);

  return (
    <div className="w-screen h-screen bg-gray-900 overflow-hidden flex flex-col">
      <div className="p-4">
        <h2 className="text-white text-3xl font-bold">
          {companyName}
        </h2>

        <div className="flex items-center gap-3 mt-3">
          <span
            className={`text-xl font-bold ${
              isProfit ? "text-green-500" : "text-red-500"
            }`}
          >
            {isProfit ? "▲" : "▼"}{" "}
            {Math.abs(change).toFixed(2)}
          </span>

          <span
            className={`text-lg font-semibold ${
              isProfit ? "text-green-500" : "text-red-500"
            }`}
          >
            ({isProfit ? "+" : "-"}
            {Math.abs(changePercent).toFixed(2)}%)
          </span>
        </div>
      </div>

      <div
        ref={chartRef}
        className="flex-1 w-full"
      />
    </div>
  );
};

export default SubGraphClient;