"use client";

import React, { useEffect, useRef, useState } from "react";
import { createChart, LineSeries } from "lightweight-charts";
import { useRouter } from "next/navigation";
import { VscGraphLine } from "react-icons/vsc";
import { LuChartCandlestick } from "react-icons/lu";
import {

CandlestickSeries,
} from "lightweight-charts";

const Graph = ({ companyName, api,Capi}) => {
  const chartRef = useRef(null);
    const router = useRouter();


    


const [Gtype, setGtype]= useState(true);
  const [change, setChange] = useState(0);
  const [changePercent, setChangePercent] = useState(0);
  const [isProfit, setIsProfit] = useState(true);
const senddata = (api,companyName) => {
  router.push(
  `./frontend/Head/SubGraph?company=${encodeURIComponent(companyName)}`
);
};


useEffect(() => {
  if (!chartRef.current) return;

  chartRef.current.innerHTML = "";

  const chart = createChart(chartRef.current, {
    width: 400,
    height: 300,

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
      rightOffset: 0,
      fixRightEdge: true,
    },
  });

  const fetchData = async () => {
  try {
    if (Gtype) {
      // LINE CHART
      const lineSeries = chart.addSeries(LineSeries, {
        color: "#22c55e",
        lineWidth: 2,
      });

      const response = await fetch(api);
      const data = await response.json();

      console.log("Line Data:", data);

      const formattedData = data.prices.map((item) => ({
        time: Math.floor(item[0] / 1000),
        value: Number(item[1]),
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
    } else {
      // CANDLESTICK CHART
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

      const response = await fetch(Capi);
      const data = await response.json();

      console.log("Candle Data:", data);

      if (!Array.isArray(data)) {
        console.error("Invalid candle data:", data);
        return;
      }

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

      if (
        firstPrice !== undefined &&
        lastPrice !== undefined
      ) {
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

  fetchData();

  return () => {
    chart.remove();
  };
}, [api, Capi, Gtype]);


  




  return (
    <div className="bg-gray-900 p-2 rounded-lg shadow-lg flex flex-col" >
     <div className="flex justify-between p-2"> <h2 className="text-white text-xl font-bold mb-2">
        {companyName}
      </h2>
      <h2 className="flex px-2">
       <button              className={`text-2xl cursor-pointer mx-2 ${
                Gtype ? "text-green-500" : "text-gray-500"
              }`} onClick={()=>{setGtype(true)}}><VscGraphLine /></button> 
       <button              className={`text-2xl cursor-pointer ${
                Gtype ?  "text-gray-500" :"text-green-500" 
              }`} onClick={()=>{setGtype(false)}}><LuChartCandlestick />
</button> 

        </h2></div>
       <div className="cursor-pointer" onClick={()=>senddata(api,companyName)}>

      <div className="flex items-center gap-3 mb-4"  >
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
    </div></div>
  );
};

export default Graph;