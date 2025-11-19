import React, { useState, useRef, useEffect } from "react";
import { Search, ArrowRight, Funnel, X } from "lucide-react";
import AmountFilterPanel from "./AmountFilterPanel";
import DepartmentFilterPanel from "./DepartmentFilterPanel";
import LocationFilterPanel from "./LocationFilterPanel";
import CardHolderFilterPanel from "./CardHolderFilterPanel";
import { filterOptions, departments, cardholders, locations } from "../helper/data";
import type { ActiveFilters } from "../helper/type";

interface FilterDropdownProps {
  activeFilters: ActiveFilters;
  setActiveFilters: React.Dispatch<React.SetStateAction<ActiveFilters>>;
}
export default function FilterDropdown({ activeFilters, setActiveFilters }: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const [panel, setPanel] = useState<"main" | "amount" | "cardholder" | "department" | "location">(
    "main"
  );
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState("");

  const searchableItems = [
    ...departments.map(name => ({ name, type: "Department" })),
    ...locations.map(name => ({ name, type: "Location" })),
    ...cardholders.map(name => ({ name, type: "Cardholder" })),
  ];
  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setPanel("main");
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const getFilterSummary = (item: string) => {
    if (item === "Amount" && activeFilters.amount) {
      const { min, max } = activeFilters.amount;
      if (min === null && max === null) return null; // nothing selected
      if (min !== null && max !== null) return `$${min} — $${max}`;
      if (min !== null && max === null) return `$${min}+`;
      if (min === null && max !== null) return `Up to $${max}`;
    }

    if (item === "Department") {
      if (activeFilters.department.length === 0) return null;
      return `${activeFilters.department.length} applied`;
    }

    if (item === "Location") {
      if (activeFilters.location.length === 0) return null;
      return `${activeFilters.location.length} applied`;
    }

    if (item === "Cardholder") {
      if (activeFilters.cardholder.length === 0) return null;
      return `${activeFilters.cardholder.length} applied`;
    }

    return null;
  };

  const results = search.trim()
    ? searchableItems.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
    : [];

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Trigger */}
      <div
        onClick={e => {
          const triggerRect = e.currentTarget.getBoundingClientRect();
          const wrapperRect = containerRef.current!.getBoundingClientRect();

          setPosition({
            top: triggerRect.bottom - wrapperRect.top,
            left: triggerRect.left - wrapperRect.left,
          });

          setPanel("main");
          setOpen(prev => !prev);
        }}
        className={`
          flex items-center gap-3 cursor-pointer bg-[#fcfbfa] px-4 py-2 text-sm text-gray-600
          border ${open ? "border-[#e5e3d7]" : "border-transparent"} hover:border-[#e5e3d7]
        `}
      >
        <Search size={16} className="text-gray-400" />
        <span className="select-none">Filter by...</span>
      </div>

      <div className="flex gap-4">
        <div className="flex gap-2 flex-wrap mt-3">
          {/* Department chip group */}
          {activeFilters.department.length > 0 && (
            <div
              onClick={e => {
                const pillRect = e.currentTarget.getBoundingClientRect();
                const wrapperRect = containerRef.current!.getBoundingClientRect();

                setPosition({
                  top: pillRect.bottom - wrapperRect.top,
                  left: pillRect.left - wrapperRect.left,
                });
                setPanel("department");
                setOpen(true);
              }}
              className="group flex items-center bg-[#e0decd] rounded-full px-3 py-1 gap-2 cursor-pointer"
            >
              {/* <div className="flex items-center"> */}
              <Funnel className="text-gray-700 group-hover:hidden" size={16} />
              {/* </div> */}

              <button
                onClick={e => {
                  e.stopPropagation();
                  setActiveFilters(prev => ({
                    ...prev,
                    department: [],
                  }));
                }}
                className="hidden group-hover:flex hover:bg-white text-gray-700 rounded-full cursor-pointer"
              >
                <X size={16} />
              </button>

              <span className="font-medium">Department</span>

              {activeFilters.department.slice(0, 3).map(dep => (
                <span key={dep} className="bg-white rounded-full px-2 py-0.5 text-sm border">
                  {dep}
                </span>
              ))}

              {activeFilters.department.length > 3 && (
                <span className="bg-white rounded-full px-2 py-0.5 text-sm border">
                  +{activeFilters.department.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-2 flex-wrap mt-3">
          {/* Location chip group */}
          {activeFilters.location.length > 0 && (
            <div
              onClick={e => {
                const pillRect = e.currentTarget.getBoundingClientRect();
                const wrapperRect = containerRef.current!.getBoundingClientRect();

                setPosition({
                  top: pillRect.bottom - wrapperRect.top,
                  left: pillRect.left - wrapperRect.left,
                });
                setPanel("location");
                setOpen(true);
              }}
              className="group flex items-center bg-[#e0decd] rounded-full px-3 py-1 gap-2 cursor-pointer"
            >
              {/* <div className="flex items-center"> */}
              <Funnel className="text-gray-700 group-hover:hidden" size={16} />
              {/* </div> */}

              <button
                onClick={e => {
                  e.stopPropagation();
                  setActiveFilters(prev => ({
                    ...prev,
                    location: [],
                  }));
                }}
                className="hidden group-hover:flex text-gray-700 rounded-full cursor-pointer hover:bg-white"
              >
                <X size={16} />
              </button>

              <span className="font-medium">Location</span>

              {activeFilters.location.slice(0, 3).map(dep => (
                <span key={dep} className="bg-white rounded-full px-2 py-0.5 text-sm border">
                  {dep}
                </span>
              ))}

              {activeFilters.location.length > 3 && (
                <span className="bg-white rounded-full px-2 py-0.5 text-sm border">
                  +{activeFilters.location.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-2 flex-wrap mt-3">
          {activeFilters.amount &&
            (activeFilters.amount.min !== null || activeFilters.amount.max !== null) && (
              <div
                onClick={e => {
                  const pillRect = e.currentTarget.getBoundingClientRect();
                  const wrapperRect = containerRef.current!.getBoundingClientRect();

                  setPosition({
                    top: pillRect.bottom - wrapperRect.top,
                    left: pillRect.left - wrapperRect.left,
                  });
                  setPanel("amount");
                  setOpen(true);
                }}
                className="group flex items-center bg-[#e0decd] rounded-full px-3 py-1 gap-2 cursor-pointer"
              >
                <Funnel className="text-gray-700 group-hover:hidden" size={16} />

                <button
                  onClick={e => {
                    e.stopPropagation();
                    setActiveFilters(prev => ({
                      ...prev,
                      amount: undefined,
                    }));
                  }}
                  className="hidden group-hover:flex hover:bg-white text-gray-700 rounded-full cursor-pointer"
                >
                  <X size={16} />
                </button>

                <span className="font-medium">Amount</span>

                <div className="bg-white rounded-full">
                  {activeFilters.amount.min !== null && (
                    <span className=" px-2 py-0.5 text-sm">${activeFilters.amount.min}</span>
                  )}
                  {activeFilters.amount.min !== null && activeFilters.amount.max !== null
                    ? " - "
                    : ""}
                  {activeFilters.amount.min !== null && activeFilters.amount.max === null
                    ? " > "
                    : ""}
                  {activeFilters.amount.min === null && activeFilters.amount.max !== null
                    ? " < "
                    : ""}
                  {activeFilters.amount.max !== null && (
                    <span className="px-2 py-0.5 text-sm">${activeFilters.amount.max}</span>
                  )}
                </div>
              </div>
            )}
        </div>
      </div>
      {open && (
        <div
          className="absolute z-50"
          style={{
            top: position.top,
            left: position.left,
          }}
        >
          {/* Main Panel */}
          {panel === "main" && (
            <div className="w-[380px] bg-white shadow-xl border border-[#e5e3d7] overflow-hidden">
              {/* Search */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-[#e8e7dd]">
                <Search size={16} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full text-sm text-black focus:outline-none"
                />
              </div>

              {search !== "" ? (
                <div className="max-h-[250px] overflow-y-auto border-b border-[#e8e7dd]">
                  {results.length === 0 && (
                    <div className="px-6 py-4 text-gray-500 text-sm">
                      No items match your search.
                    </div>
                  )}

                  {results.map(item => (
                    <button
                      key={item.name + item.type}
                      className="w-full flex flex-col justify-start px-6 py-3 
                   text-left hover:bg-[#f7f6f2] text-gray-800"
                      onClick={() => {
                        if (item.type === "Department") {
                          setActiveFilters(prev => ({
                            ...prev,
                            department: [item.name],
                          }));
                          setPanel("department");
                        }

                        if (item.type === "Location") {
                          setActiveFilters(prev => ({
                            ...prev,
                            location: [item.name],
                          }));
                          setPanel("location");
                        }

                        if (item.type === "Cardholder") {
                          setActiveFilters(prev => ({
                            ...prev,
                            cardholder: [item.name],
                          }));
                          setPanel("cardholder");
                        }

                        setSearch("");
                        setOpen(false);
                      }}
                    >
                      <span>{item.name}</span>
                      <span className="text-xs text-gray-500">{item.type}</span>
                    </button>
                  ))}
                </div>
              ) : (
                /* When NOT searching → show the normal filter menu */
                <div className="max-h-[250px] overflow-y-auto">
                  {filterOptions.map(item => (
                    <button
                      key={item}
                      className="w-full flex items-center justify-between px-6 py-3
                   text-left hover:bg-[#f7f6f2] text-gray-800"
                      onClick={() => {
                        if (item === "Amount") setPanel("amount");
                        if (item === "Cardholder") setPanel("cardholder");
                        if (item === "Department") setPanel("department");
                        if (item === "Location") setPanel("location");
                      }}
                    >
                      <span>{item}</span>

                      <div className="flex items-center gap-2">
                        {getFilterSummary(item) && (
                          <span className="text-xs text-gray-500">{getFilterSummary(item)}</span>
                        )}
                        <ArrowRight size={18} className="text-gray-500" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Amount Panel */}
          <>
            {panel === "amount" && (
              <AmountFilterPanel
                onBack={() => setPanel("main")}
                defaultMin={activeFilters.amount?.min ?? null}
                defaultMax={activeFilters.amount?.max ?? null}
                onApply={(min, max) => {
                  setActiveFilters(prev => ({
                    ...prev,
                    amount: { min, max },
                  }));
                  setOpen(false);
                  setPanel("main");
                }}
              />
            )}
          </>
          <>
            {panel === "department" && (
              <DepartmentFilterPanel
                onBack={() => setPanel("main")}
                options={departments}
                defaultSelected={activeFilters.department}
                onApply={selected => {
                  setActiveFilters(prev => ({
                    ...prev,
                    department: selected,
                  }));
                  setOpen(false);
                  setPanel("main");
                }}
              />
            )}
          </>
          <>
            {panel === "cardholder" && (
              <CardHolderFilterPanel
                onBack={() => setPanel("main")}
                options={cardholders}
                defaultSelected={activeFilters.cardholder}
                onApply={selected => {
                  setActiveFilters(prev => ({
                    ...prev,
                    cardholder: selected,
                  }));
                  setOpen(false);
                  setPanel("main");
                }}
              />
            )}
          </>
          <>
            {panel === "location" && (
              <LocationFilterPanel
                onBack={() => setPanel("main")}
                options={locations}
                defaultSelected={activeFilters.location}
                onApply={selected => {
                  setActiveFilters(prev => ({
                    ...prev,
                    location: selected,
                  }));
                  setOpen(false);
                  setPanel("main");
                }}
              />
            )}
          </>
        </div>
      )}
    </div>
  );
}
