import React, { useEffect, useState, useRef, useMemo } from "react";
import type { BiggestSpenderDataProps } from "../helper/type";
import {
  X,
  // EllipsisVertical,
  // ChevronDown,
  FilePenLine,
  // CirclePlus,
  // FileText,
  ArrowRight,
  Plus,
} from "lucide-react";
import { Modal } from "../components/Modal";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { parseSpend } from "../helper/functions";

interface BiggestSpenderProps {
  selectedData: BiggestSpenderDataProps;
  setSelectedData: React.Dispatch<React.SetStateAction<BiggestSpenderDataProps | null>>;
}

export default function BiggestSpender({ selectedData, setSelectedData }: BiggestSpenderProps) {
  // const [openDot, setOpenDot] = useState(false);
  // const [openButton, setOpenButton] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<"overview" | "activity">("overview");
  const { tripData, filteredTrips, globalFilterOn } = useSelector((state: RootState) => state.trip);

  // const [funds, setFunds] = useState<Row[]>([]);

  const activeData = useMemo(() => {
    return globalFilterOn ? filteredTrips : tripData;
  }, [filteredTrips, tripData, globalFilterOn]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        // setOpenDot(false);
        // setOpenButton(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const funds = useMemo(() => {
    return activeData.filter(item => item.name === selectedData.name);
  }, [activeData, selectedData, filteredTrips]);

  return (
    <div>
      {/* Dim overlay */}
      <div
        className="fixed inset-0 bg-black/10 backdrop-blur-[1px] z-40"
        onClick={() => setSelectedData(null)}
      />

      {/* Slide-in panel */}
      <div className="fixed top-0 right-0 h-full w-[720px] bg-white shadow-xl z-50 border-l border-gray-200 animate-slideLeft overflow-auto">
        {/* Close Button */}
        <div className="w-full flex justify-end p-3">
          <button
            onClick={() => setSelectedData(null)}
            className="text-gray-500 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center"
          >
            <X size={16} />
          </button>
        </div>

        {/* Header Section */}
        <div className="px-8 pb-8 flex justify-between">
          <h2 className="text-4xl font-semibold">{selectedData?.name}</h2>

          <button
            onClick={() => {
              // setOpenButton(prev => !prev);
              setOpen(true);
            }}
            className="flex border px-4 py-2 items-center gap-2 rounded-md text-sm hover:bg-gray-100"
          >
            <FilePenLine size={16} />
            Add or submit
          </button>
        </div>
        {/* Tabs */}
        <div className="border-b border-gray-200 px-8">
          <div className="flex gap-8">
            {/* Overview */}
            <button
              className={`
            py-3 text-sm font-medium cursor-pointer
            ${active === "overview" ? "text-black border-b-2 border-black" : "text-gray-500"}
          `}
              onClick={() => setActive("overview")}
            >
              Overview
            </button>

            {/* Activity */}
            <button
              className={`
            py-3 text-sm font-medium cursor-pointer
            ${active === "activity" ? "text-black border-b-2 border-black" : "text-gray-500"}
          `}
              onClick={() => setActive("activity")}
            >
              Activity
            </button>
          </div>
        </div>

        {/* Details Section */}
        {active === "overview" && (
          <div className="w-full mt-6">
            {/* --- Top Info Grid --- */}
            <div className="grid grid-cols-2 gap-y-6 gap-x-8 pb-10 border-b border-gray-200 pl-8">
              {/* Location */}
              <div className="flex flex-col justify-start items-start">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Location</p>
                <p className="text-sm mt-1 flex items-center gap-1">
                  {selectedData?.location} <span>→</span>
                </p>
              </div>

              {/* Department */}
              <div className="flex flex-col justify-start items-start">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Department</p>
                <p className="text-sm mt-1 flex items-center gap-1">
                  {selectedData?.department} <span>→</span>
                </p>
              </div>

              {/* Role */}
              <div className="flex flex-col justify-start items-start">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Role</p>
                <p className="text-sm mt-1">{selectedData?.role}</p>
              </div>

              {/* Email */}
              <div className="flex flex-col justify-start items-start">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                <p className="text-sm mt-1 flex items-center gap-2">
                  {selectedData?.email}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-gray-500 cursor-pointer"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16l4-4-4-4m5 8l4-4-4-4"
                    />
                  </svg>
                </p>
              </div>
            </div>

            {/* --- Card Section --- */}
            <div className="flex flex-col items-center justify-center py-14 text-center border-t">
              {/* Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-16 h-16 text-gray-800 mb-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <rect x="3" y="5" width="18" height="14" rx="2" strokeWidth="1.5"></rect>
                <rect x="15" y="10" width="4" height="3" rx="0.5" strokeWidth="1.5"></rect>
              </svg>

              {/* Message */}
              <p className="text-lg text-gray-700 mb-5">
                {selectedData?.name} doesn't have a physical card (yet)
              </p>

              {/* Button */}
              <button
                className="
          w-64 py-2 
          border border-gray-300 
          text-sm 
          rounded 
          hover:bg-gray-100 
          transition
          flex items-center justify-center gap-2
        "
                onClick={() => setOpen(true)}
              >
                Issue a Ramp Card
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-12 px-8 w-full border-t border-gray-300 py-4">
              {/* Header */}
              <div className="flex justify-between items-center mb-4 w-full">
                <h2 className="text-2xl font-semibold w-full">
                  Funds that {selectedData?.name} has spend{" "}
                  <span className="text-gray-500 text-base">{funds.length}</span>
                </h2>

                <button
                  className="
          w-8 h-8 flex items-center justify-center 
          border border-gray-300 rounded hover:bg-gray-100 transition
        "
                  onClick={() => setOpen(true)}
                >
                  <Plus size={18} />
                </button>
              </div>

              {/* Fund Cards */}
              <div className="space-y-4">
                {funds.map((fund, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-300 rounded-lg px-4 py-4 hover:bg-gray-100 cursor-pointer"
                    onClick={() => setOpen(true)}
                  >
                    <p className="font-medium text-gray-900">{fund.title}</p>

                    <p className="text-sm text-gray-600 mt-1">
                      {fund.destination} remaining ·{" "}
                      {parseSpend(fund.travelCost) + parseSpend(fund.hotelCost)}
                    </p>

                    {/* Divider Line */}
                    <div className="border-b border-gray-200 mt-3"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {active === "activity" && (
          <div>
            <div className="border-t border-gray-200">
              <div className="py-20 text-center text-gray-500">
                There aren’t any activity listed under this user
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        onGetStarted={() => alert("Redirecting...")}
      />
    </div>
  );
}
