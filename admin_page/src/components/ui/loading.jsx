import React from "react";
import { LoaderCircle } from "lucide-react";

export function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/40 z-[2000] pointer-events-auto">
      <LoaderCircle className="size-15 animate-spin text-gray-800" />
    </div>
  );
}
