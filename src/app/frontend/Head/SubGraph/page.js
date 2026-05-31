import { Suspense } from "react";
import SubGraphClient from "./SubGraphClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-white">Loading...</div>}>
      <SubGraphClient />
    </Suspense>
  );
}