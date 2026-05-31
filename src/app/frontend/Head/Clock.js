"use client";

import React, { useEffect, useState } from "react";

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!time) return null;

  return (
    <>
      <h1>{time.toLocaleDateString("en-GB")}</h1>
      <h2>{time.toLocaleTimeString()}</h2>
    </>
  );
};

export default Clock;