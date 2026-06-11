"use client";

import { useState } from "react";

export default function Admin() {
  const [Company_name, setName] = useState("");
  const [Graph, setEmail] = useState("");
  const [Candle, setCandle] = useState("");

  const saveUser = async () => {
    const response = await fetch("/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Company_name,
        Graph,
        Candle
      }),
    });


    const data = await response.json();
    if(data.success){
      alert("data save successfuly ✅✅")
    }
    else{
      alert("data is not send ❌❌")
    }
    console.log(data);
  };
    const Delete =async ()=>{
      const res = await fetch('/api/delete',{
        method:"DELETE",
      });
      const data = await res.json();
      alert(data.message);
    }
  return (
    <div className="bg-black min-h-screen  w-full ">
    <div className=" max-w-6xl bg-white/10 mx-auto h-150 flex flex-col gap-y-5 p-5">
      <div className="text-center">ADMIN Page</div>
        <input
        className="bg-white text-black w-1/2 "
        type="text"
        placeholder="Company_name"
        onChange={(e) => setName(e.target.value)}
        required
      />
      

      <input
      className="bg-white text-black w-1/2 "
        type="text"
        placeholder="Graph API"
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
      className="bg-white text-black w-1/2 "
        type="text"
        placeholder="Candle Graph API"
        onChange={(e) => setCandle(e.target.value)}
        required
      />
      
      <div className="flex justify-between">
              <button 
      className="bg-blue-600 text-white w-20 text-[14px] rounded-xs p-1 hover:scale-95 active:scale-105 duration-300 cursor-pointer" 
       onClick={saveUser}>
        Save User
      </button>
              <button 
      className="bg-blue-600 text-white w-20 text-[14px] rounded-xs p-1 hover:scale-95 active:scale-105 duration-300 cursor-pointer" 
       onClick={Delete}>
        Delete
      </button>

      </div>

    </div>
    </div>
  );
}