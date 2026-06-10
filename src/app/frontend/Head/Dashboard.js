"use client";

import React, { useEffect, useState } from "react";
import Graph from "./Graph";


const Dashboard =  () => {

  
  const [company,setCompany] = useState([]);


  useEffect(()=>{
    fetch("/api/company")
    .then((res)=>res.json())
    .then((data)=>setCompany(data.data));
  },[]);

  return (
    <div className="w-full mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
      {company.map((company) => (
        <Graph
          key={company.Company_name}
          companyName={company.Company_name}
          api={company.Graph}
          Capi= {company.Candle}
      
          
        />
      ))}
    </div>
  );
};

export default Dashboard;