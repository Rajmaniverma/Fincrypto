"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  createChart,
  LineSeries,
  CandlestickSeries,
} from "lightweight-charts";
import { VscGraphLine } from "react-icons/vsc";
import { LuChartCandlestick } from "react-icons/lu";

const SubGraphClient = () => {
  const chartRef = useRef(null);

  const [api, setApi] = useState(null);
  const [cApi, setCApi] = useState(null);

  const [change, setChange] = useState(0);
  const [changePercent, setChangePercent] = useState(0);
  const [isProfit, setIsProfit] = useState(true);

  const [Gtype, setGtype] = useState(true); // true = line, false = candle

  const searchParams = useSearchParams();

  const CompanyName =
    searchParams.get("company") ?? "Unknown Company";

  // Fetch Graph URLs from backend
  useEffect(() => {
    async function fetchCompanyData() {
      try {
        const response = await fetch("/api/graph", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            CompanyName,
          }),
        });

        const data = await response.json();

        setApi(data.Graph);
        setCApi(data.Candle);
        console.log(api);
        console.log(cApi)
      } catch (error) {
        console.error(error);
      }
    }

    fetchCompanyData();
  }, [CompanyName]);

  // Create Chart
  useEffect(() => {
    if (!chartRef.current) return;
    if (!api || !cApi) return;

    chartRef.current.innerHTML = "";

    const chart = createChart(chartRef.current, {
      width: chartRef.current.clientWidth,
      height: chartRef.current.clientHeight,
      layout: {
        background: {
          color: "#111827",
        },
        textColor: "#d1d5db",
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

    const loadChart = async () => {
      try {
        // LINE CHART
        if (Gtype) {
          const lineSeries = chart.addSeries(LineSeries, {
            color: "#22c55e",
            lineWidth: 2,
          });

          const response = await fetch(api);
          const data = await response.json();

          const formattedData = data.prices.map((item) => ({
            time: Math.floor(item[0] / 1000),
            value: Number(item[1]),
          }));

          lineSeries.setData(formattedData);

          const firstPrice = formattedData[0]?.value;
          const lastPrice =
            formattedData[formattedData.length - 1]?.value;

          if (firstPrice && lastPrice) {
            const diff = lastPrice - firstPrice;
            const percent = (diff / firstPrice) * 100;

            setChange(diff);
            setChangePercent(percent);
            setIsProfit(diff >= 0);

            lineSeries.applyOptions({
              color: diff >= 0 ? "#22c55e" : "#ef4444",
            });
          }
        }

        // CANDLE CHART
        else {
          const candleSeries = chart.addSeries(
            CandlestickSeries,
            {
              upColor: "#22c55e",
              downColor: "#ef4444",
              borderVisible: false,
              wickUpColor: "#22c55e",
              wickDownColor: "#ef4444",
            }
          );

          const response = await fetch(cApi);
          const data = await response.json();

          const formattedData = data.map(
            ([timestamp, open, high, low, close]) => ({
              time: Math.floor(timestamp / 1000),
              open: Number(open),
              high: Number(high),
              low: Number(low),
              close: Number(close),
            })
          );

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
        }

        chart.timeScale().fitContent();
      } catch (error) {
        console.error("Chart Error:", error);
      }
    };

    loadChart();

    const handleResize = () => {
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
  }, [api, cApi, Gtype]);


  return (
    <div className="w-screen h-screen bg-gray-900 flex flex-col overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-white text-3xl font-bold">
            {CompanyName}
          </h2>

          <div className="flex gap-4">
            <button
              className={`text-2xl cursor-pointer ${
                Gtype ? "text-green-500" : "text-gray-500"
              }`}
              onClick={() => setGtype(true)}
            >
              <VscGraphLine />
            </button>

            <button
              className={`text-2xl cursor-pointer ${
                !Gtype ? "text-green-500" : "text-gray-500"
              }`}
              onClick={() => setGtype(false)}
            >
              <LuChartCandlestick />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-4">
          <span
            className={`text-xl font-bold ${
              isProfit
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {isProfit ? "▲" : "▼"}{" "}
            {Math.abs(change).toFixed(2)}
          </span>

          <span
            className={`text-lg font-semibold ${
              isProfit
                ? "text-green-500"
                : "text-red-500"
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