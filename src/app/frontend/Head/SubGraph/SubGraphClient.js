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

  const [Gtype, setGtype] = useState(true);

  // NEW
  const [timeFrame, setTimeFrame] = useState("1D");

  const searchParams = useSearchParams();

  const CompanyName =
    searchParams.get("company") ?? "Unknown Company";

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
      } catch (error) {
        console.error(error);
      }
    }

    fetchCompanyData();
  }, [CompanyName]);

  // Filter according to selected timeframe
const filterDataByTimeFrame = (data) => {
  const now = Math.floor(Date.now() / 1000);

  let seconds;

  switch (timeFrame) {
    case "10M":
      seconds = 10 * 60;
      break;

    case "30M":
      seconds = 30 * 60;
      break;

    case "1H":
      seconds = 60 * 60;
      break;

    case "1D":
      seconds = 24 * 60 * 60;
      break;

    case "1M":
      seconds = 30 * 24 * 60 * 60;
      break;

    case "1Y":
      seconds = 365 * 24 * 60 * 60;
      break;

    default:
      seconds = 24 * 60 * 60;
  }

  return data.filter(
    (item) => item.time >= now - seconds
  );
};

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
        // LINE GRAPH
        if (Gtype) {
          const lineSeries = chart.addSeries(LineSeries, {
            color: "#22c55e",
            lineWidth: 2,
          });

          const response = await fetch(api);
          const data = await response.json();

          const formattedData = data.prices.map(
            (item) => ({
              time: Math.floor(item[0] / 1000),
              value: Number(item[1]),
            })
          );

          const filteredData =
            filterDataByTimeFrame(formattedData);

          lineSeries.setData(filteredData);

          const firstPrice =
            filteredData[0]?.value;
          const lastPrice =
            filteredData[
              filteredData.length - 1
            ]?.value;

          if (firstPrice && lastPrice) {
            const diff =
              lastPrice - firstPrice;

            const percent =
              (diff / firstPrice) * 100;

            setChange(diff);
            setChangePercent(percent);
            setIsProfit(diff >= 0);

            lineSeries.applyOptions({
              color:
                diff >= 0
                  ? "#22c55e"
                  : "#ef4444",
            });
          }
        }

        // CANDLE GRAPH
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
              time: Math.floor(
                timestamp / 1000
              ),
              open: Number(open),
              high: Number(high),
              low: Number(low),
              close: Number(close),
            })
          );

          const filteredData =
            filterDataByTimeFrame(formattedData);

          candleSeries.setData(filteredData);

          const firstPrice =
            filteredData[0]?.open;

          const lastPrice =
            filteredData[
              filteredData.length - 1
            ]?.close;

          if (firstPrice && lastPrice) {
            const diff =
              lastPrice - firstPrice;

            const percent =
              (diff / firstPrice) * 100;

            setChange(diff);
            setChangePercent(percent);
            setIsProfit(diff >= 0);
          }
        }

        chart.timeScale().fitContent();
      } catch (error) {
        console.error(
          "Chart Error:",
          error
        );
      }
    };

    loadChart();

    const handleResize = () => {
      chart.applyOptions({
        width:
          chartRef.current.clientWidth,
        height:
          chartRef.current.clientHeight,
      });
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );
      chart.remove();
    };
  }, [api, cApi, Gtype, timeFrame]);

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
                Gtype
                  ? "text-green-500"
                  : "text-gray-500"
              }`}
              onClick={() => setGtype(true)}
            >
              <VscGraphLine />
            </button>

            <button
              className={`text-2xl cursor-pointer ${
                !Gtype
                  ? "text-green-500"
                  : "text-gray-500"
              }`}
              onClick={() => setGtype(false)}
            >
              <LuChartCandlestick />
            </button>
          </div>
        </div>

        {/* Timeframe Buttons */}
        <div className="flex gap-3 mt-4">
          {["10M", "30M", "1H", "1D", "1M", "1Y"].map(
            (frame) => (
              <button
                key={frame}
                onClick={() =>
                  setTimeFrame(frame)
                }
                className={`px-4 py-1 rounded-lg font-semibold transition ${
                  timeFrame === frame
                    ? "bg-green-500 text-white"
                    : "bg-gray-700 text-gray-300"
                }`}
              >
                {frame}
              </button>
            )
          )}
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
            {Math.abs(
              changePercent
            ).toFixed(2)}
            %)
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