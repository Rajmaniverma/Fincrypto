"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

import {
  createChart,
  CandlestickSeries,
} from "lightweight-charts";

const SubGraph = () => {
  const chartRef = useRef(null);

  const [change, setChange] = useState(0);
  const [changePercent, setChangePercent] = useState(0);
  const [isProfit, setIsProfit] = useState(true);

  const searchParams = useSearchParams();

  const api = searchParams.get("api");
  const companyName = searchParams.get("company");

  useEffect(() => {
    if (!chartRef.current || !api) return;

    const chart = createChart(chartRef.current, {
      width: chartRef.current.clientWidth,
      height: 600,

      layout: {
        background: {
          color: "#111827",
        },
        textColor: "#ffffff",
      },

      grid: {
        vertLines: {
          color: "#1f2937",
        },
        horzLines: {
          color: "#1f2937",
        },
      },

      rightPriceScale: {
        visible: true,
      },

      timeScale: {
        visible: true,
        timeVisible: true,
      },
    });

const candleSeries = chart.addSeries(CandlestickSeries, {
  upColor: "#22c55e",
  downColor: "#ef4444",
  borderVisible: false,
  wickUpColor: "#22c55e",
  wickDownColor: "#ef4444",
});

    const fetchData = async () => {
      try {
        const response = await fetch(api);
        const data = await response.json();

        const formattedData = data.map((item) => ({
          time: Math.floor(item[0] / 1000),
          open: item[1],
          high: item[2],
          low: item[3],
          close: item[4],
        }));

        candleSeries.setData(formattedData);

        const firstPrice = formattedData[0]?.open;
        const lastPrice =
          formattedData[formattedData.length - 1]?.close;

        if (firstPrice && lastPrice) {
          const diff = lastPrice - firstPrice;
          const percent = (diff / firstPrice) * 100;

          setChange(diff);
          setChangePercent(percent);
          setIsProfit(diff >= 0);
        }

        chart.timeScale().fitContent();
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchData();

    const handleResize = () => {
      chart.applyOptions({
        width: chartRef.current.clientWidth,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [api]);

  return (
    <div className="min-h-screen bg-gray-950 py-10 px-4">
      <div className="max-w-6xl mx-auto bg-gray-900 rounded-xl shadow-xl p-6">

        <h1 className="text-4xl font-bold text-white mb-8">
          {companyName}
        </h1>

        <div
          className={`mb-8 p-6 rounded-xl ${
            isProfit ? "bg-green-900" : "bg-red-900"
          }`}
        >
          <h2 className="text-lg text-white">
            {isProfit ? "Growth" : "Decline"}
          </h2>

          <div className="flex items-center gap-4 mt-2">
            <span className="text-3xl font-bold text-white">
              {isProfit ? "▲" : "▼"}{" "}
              {Math.abs(change).toFixed(2)}
            </span>

            <span className="text-xl text-white">
              ({isProfit ? "+" : "-"}
              {Math.abs(changePercent).toFixed(2)}%)
            </span>
          </div>
        </div>

        <div
          ref={chartRef}
          className="w-full h-[600px] rounded-xl overflow-hidden"
        />
      </div>
    </div>
  );
};

export default SubGraph;