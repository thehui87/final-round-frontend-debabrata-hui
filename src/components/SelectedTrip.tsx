import React, { useEffect, useState, useRef } from "react";
import type { Row } from "../helper/type";
import { X, EllipsisVertical, ChevronDown, FilePenLine, CirclePlus, FileText } from "lucide-react";
import { Modal } from "../components/Modal";

interface FilterDropdownProps {
  selectedTrip: Row | null;
  setSelectedTrip: React.Dispatch<React.SetStateAction<Row | null>>;
}
export default function SelectedTrip({ selectedTrip, setSelectedTrip }: FilterDropdownProps) {
  const [openDot, setOpenDot] = useState(false);
  const [openButton, setOpenButton] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenDot(false);
        setOpenButton(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);
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
        fixed top-0 right-0 h-full w-[720px] bg-white shadow-xl z-50 
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

        <div
          className="absolute bottom-0 border-t border-gray-200 w-full py-6 flex justify-end items-center gap-4 px-4"
          ref={containerRef}
        >
          {/* 3 dots button */}
          <button
            className="p-3 flex hover:bg-[#f4f4f4] rounded-full cursor-pointer"
            onClick={() => {
              setOpenDot(prev => !prev);
              setOpenButton(false);
            }}
          >
            <EllipsisVertical size={16} />
          </button>

          {/* Add or submit button */}
          <div className="relative">
            <button
              onClick={() => {
                setOpenButton(prev => !prev);
                setOpenDot(false);
              }}
              className="flex border px-4 py-2 items-center gap-2 hover:underline hover:bg-[#f4f4f4] cursor-pointer"
            >
              Add or submit
              <ChevronDown size={16} />
            </button>

            {/* Floating Menu */}
            {openDot && (
              <div
                className="
          absolute right-0 -translate-x-1/2 bottom-full mb-2 w-48 bg-white shadow-lg border border-gray-200 z-50
          animate-fadeIn
        "
              >
                <button
                  className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-100 text-left"
                  onClick={() => setOpen(true)}
                >
                  Edit Trip
                  <FilePenLine size={16} />
                </button>
              </div>
            )}

            {openButton && (
              <div
                className="
          absolute right-0 bottom-full mb-2 w-60 bg-white shadow-lg border border-gray-200 z-50
          animate-fadeIn
        "
              >
                <button
                  className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-100 text-left"
                  onClick={() => setOpen(true)}
                >
                  Add expenses
                  <CirclePlus size={16} />
                </button>
                <button
                  className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-100 text-left"
                  onClick={() => setOpen(true)}
                >
                  Submit reimbursements
                  <FileText size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        onGetStarted={() => alert("Redirecting...")}
      />
    </div>
  );
}
