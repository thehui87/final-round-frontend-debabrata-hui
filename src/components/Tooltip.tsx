// Tooltip.tsx
import React from "react";

export default function Tooltip({
  category,
  amount,
  color,
}: {
  category: string;
  amount: string | number;
  color: string;
}) {
  return (
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 bg-white border border-gray-300 shadow-lg px-4 py-2 rounded flex items-center gap-3">
      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
      <div>
        <p className="font-medium">{category}</p>
        <p className="text-gray-600 text-sm">${amount}</p>
      </div>
    </div>
  );
}
