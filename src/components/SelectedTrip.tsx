import React from "react";
import type { Row } from "../helper/type";
import { X } from "lucide-react";

interface FilterDropdownProps {
  selectedTrip: Row | null;
  setSelectedTrip: React.Dispatch<React.SetStateAction<Row | null>>;
}
export default function SelectedTrip({ selectedTrip, setSelectedTrip }: FilterDropdownProps) {
  return (
    <div>
      {/* Dimmed overlay */}
      <div
        className="fixed inset-0 bg-black/10 backdrop-blur-[1px] z-40"
        onClick={() => setSelectedTrip(null)}
      />

      {/* Slide-in panel */}
      <div
        className="
        fixed top-0 right-0 h-full w-[480px] bg-white shadow-xl z-50 
        animate-slideLeft border-l border-gray-200
      "
      >
        <div className="w-full text-right">
          <button
            onClick={() => setSelectedTrip(null)}
            className="text-gray-500 hover:bg-gray-300 rounded-full w-8 h-8 mr-2 mt-2"
          >
            <X size={14} className="mx-auto" /> {/* Use mx-auto to center the icon if necessary */}
          </button>
        </div>
        <div className="flex flex-col justify-start items-start p-6 border-b">
          <h2 className="text-4xl font-semibold">{selectedTrip?.title}</h2>
          <div className="flex items-center text-left mt-4">
            <p className="text-sm text-gray-500">Trip to {selectedTrip?.destination} </p>
            <p className="text-sm text-gray-500 capitalize">
              &nbsp; – &nbsp;{selectedTrip?.status}
            </p>
          </div>
        </div>

        <div className="p-6 text-gray-800 space-y-6">
          <div className="flex gap-10">
            <div className="text-left">
              <p className="text-sm text-gray-500">When</p>
              <p>
                {selectedTrip?.start} – {selectedTrip?.end}
              </p>
            </div>

            <div className="text-left">
              <p className="text-sm text-gray-500">Where</p>
              <p>{selectedTrip?.destination}</p>
            </div>
          </div>
          <div className="flex gap-10">
            <div className="text-left">
              <div>
                <p className="text-sm text-gray-500">Details</p>
                <p>{selectedTrip?.details || "No details available"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200">
          <div className="pt-20 text-center text-gray-500">
            There aren’t any expenses listed under this trip
          </div>
        </div>
      </div>
    </div>
  );
}
