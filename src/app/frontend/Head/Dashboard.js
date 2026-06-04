"use client";

import React from "react";
import Graph from "./Graph";


const Dashboard = () => {

const companies = [
  {
    name: "Bitcoin",
    api: "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1",
  },
  {
    name: "Ethereum",
    api: "https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=1",
  },
  {
    name: "Solana",
    api: "https://api.coingecko.com/api/v3/coins/solana/market_chart?vs_currency=usd&days=1",
  },
];
    // Add more APIs here
    // {
    //   name: "Dogecoin",
    //   api: "YOUR_API_URL",
    // },
  

  return (
    <div className="w-full mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
      {companies.map((company) => (
        <Graph
          key={company.name}
          companyName={company.name}
          api={company.api}
          
        />
      ))}
    </div>
  );
};

export default Dashboard;