import { useMemo, useState } from "react";
import { type Column, type Row } from "../helper/type";
import FilterDropdown from "../components/FilterDropdown";
import DateRangeDropdown from "../components/DateRangeDropdown";
import ColumnSelector from "../components/ColumnSelector";
import SelectedTrip from "./SelectedTrip";
import { Download, ArrowUp, ArrowDown } from "lucide-react";
import type { ActiveFilters } from "../helper/type";
import type { DateRange } from "react-day-picker";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { parseSpend } from "../helper/functions";

const ROWS_PER_PAGE = 5;

export default function TripTable({
  activeTab,
  columns,
  setColumns,
}: {
  activeTab: number;
  columns: Column[];
  setColumns: React.Dispatch<React.SetStateAction<Column[]>>;
}) {
  const { tripData, filteredTrips, globalFilterOn } = useSelector((state: RootState) => state.trip);
  // const [activeData, setActiveData] = useState<Row[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Row | null>(null);
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    department: [],
    location: [],
    cardholder: [],
  });
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Row | null;
    direction: "asc" | "desc";
  }>({
    key: null,
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);

  const handleSort = (key: keyof Row) => {
    setSortConfig(prev => {
      if (prev.key === key) {
        // Toggle direction
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }

      // First time sorting this column
      return { key, direction: "asc" };
    });
  };

  const isFilterActive = useMemo(() => {
    const isAmountFiltered =
      activeFilters.amount &&
      (activeFilters.amount.min !== null || activeFilters.amount.max !== null);

    return (
      activeFilters.department.length > 0 ||
      activeFilters.location.length > 0 ||
      activeFilters.cardholder.length > 0 ||
      isAmountFiltered
    );
  }, [activeFilters]);

  const activeData = useMemo(() => {
    return globalFilterOn ? filteredTrips : tripData;
  }, [filteredTrips, tripData, globalFilterOn]);

  const filteredRows = useMemo(() => {
    let currentRows = activeData;

    // Active Tab logic...
    if (activeTab !== 0) {
      const today = new Date();
      currentRows = currentRows.filter(row => {
        const start = new Date(row.start);
        const end = new Date(row.end);

        if (activeTab === 1) return start <= today && end >= today;
        if (activeTab === 2) return start > today;
        if (activeTab === 3) return end < today;
        return row;
      });
    }
    if (activeFilters.department.length > 0) {
      currentRows = currentRows.filter(row => activeFilters.department.includes(row.department));
    }

    // Filter by Location (destination)
    if (activeFilters.location.length > 0) {
      currentRows = currentRows.filter(row => activeFilters.location.includes(row.destination));
    }

    // Filter by Cardholder (name)
    if (activeFilters.cardholder.length > 0) {
      currentRows = currentRows.filter(row => activeFilters.cardholder.includes(row.name));
    }

    // Filter by Amount (spend)
    if (activeFilters.amount) {
      const { min, max } = activeFilters.amount;

      if (min !== null || max !== null) {
        currentRows = currentRows.filter(row => {
          const travel = parseFloat(row.travelCost.replace(/[$,]/g, "")) || 0;
          const hotel = parseFloat(row.hotelCost.replace(/[$,]/g, "")) || 0;
          const totalSpend = travel + hotel;

          const isAboveMin = min === null || totalSpend >= min;
          const isBelowMax = max === null || totalSpend <= max;

          return isAboveMin && isBelowMax;
        });
      }
    }

    // ⭐ DATE RANGE FILTER ⭐
    if (dateRange?.from && dateRange?.to) {
      const from = dateRange.from.getTime();
      const to = dateRange.to.getTime();

      currentRows = currentRows.filter(row => {
        const start = new Date(row.start).getTime();
        const end = new Date(row.end).getTime();
        return start <= to && end >= from; // date overlap
      });
    }

    return currentRows;
  }, [activeTab, activeFilters, activeData, dateRange]);

  const sortedRows = useMemo(() => {
    if (!sortConfig.key) return filteredRows;
    const key = sortConfig.key as keyof Row;

    return [...filteredRows].sort((a, b) => {
      const valueA = a[key] ?? "";
      const valueB = b[key] ?? "";

      // numeric compare for spend
      if (key === "travelCost") {
        const numA = parseFloat(String(valueA).replace(/[$,]/g, "")) || 0;
        const numB = parseFloat(String(valueB).replace(/[$,]/g, "")) || 0;
        return sortConfig.direction === "asc" ? numA - numB : numB - numA;
      }

      // date compare
      if (key === "start" || key === "end") {
        const dateA = new Date(String(valueA)).getTime();
        const dateB = new Date(String(valueB)).getTime();
        return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
      }

      // string compare
      return sortConfig.direction === "asc"
        ? String(valueA).localeCompare(String(valueB))
        : String(valueB).localeCompare(String(valueA));
    });
  }, [filteredRows, sortConfig]);

  const downloadCSV = () => {
    if (filteredRows.length === 0) return;

    const headers = visibleColumns.map(col => col.label); // CSV header row
    const rowsData = sortedRows.map(row =>
      visibleColumns
        .map(col => {
          const value = row[col.key as keyof Row];
          // Escape quotes and commas
          return `"${value?.toString().replace(/"/g, '""')}"`;
        })
        .join(",")
    );

    const csvContent = [headers.join(","), ...rowsData].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "trips.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalRows = sortedRows.length;
  const totalPages = Math.ceil(sortedRows.length / ROWS_PER_PAGE);
  const safePage = Math.min(Math.max(currentPage, 1), totalPages);

  const startIndex = (safePage - 1) * ROWS_PER_PAGE;
  const endIndex = Math.min(startIndex + ROWS_PER_PAGE, totalRows);

  const paginatedRows = sortedRows.slice(startIndex, endIndex);

  const visibleColumns = columns.filter(c => c.visible);

  return (
    <div className="bg-[#fcfbfa]">
      {/* Search under tabs */}
      {(isFilterActive || dateRange || filteredRows.length) && (
        <div className="py-4 px-14 flex justify-start items-center gap-6">
          <FilterDropdown activeFilters={activeFilters} setActiveFilters={setActiveFilters} />
          <div className="flex items-center gap-4 text-xl text-gray-600 ">
            <DateRangeDropdown range={dateRange} setRange={setDateRange} />
            <ColumnSelector columns={columns} setColumns={setColumns} />
            <button
              onClick={downloadCSV}
              className={`relative group flex items-center justify-center w-10 h-10 rounded-full transition-colors text-black hover:bg-[#f4f4f4]`}
            >
              <Download size={16} />
              {/* Tooltip */}
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none bg-white text-black text-xs px-2 py-1 border border-[#ebe8e5] shadow transition-opacity duration-200">
                Export (CSV)
              </span>
            </button>
          </div>
        </div>
      )}
      {/* Table */}
      {/* <TripTable activeTab={activeTab} /> */}

      {sortedRows.length > 0 ? (
        <table className="w-full text-sm bg-white">
          {/* HEADER */}
          <thead>
            <tr className="border-b border-[#f4f3ef]">
              <th className="w-14 border-r border-[#f4f3ef]"></th>

              {visibleColumns.map(col => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key as keyof Row)}
                  className={`px-4 border-r border-[#f4f3ef] py-2 ${
                    col.key === "travelCost" ? "text-right" : "text-left"
                  }`}
                >
                  <div className={`flex gap-1 ${col.key === "travelCost" ? "justify-end" : ""}`}>
                    {col.label}
                    {sortConfig.key === col.key && (
                      <span>
                        {sortConfig.direction === "asc" ? (
                          <ArrowUp size={14} />
                        ) : (
                          <ArrowDown size={14} />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}

              <th className="w-14"></th>
            </tr>
          </thead>

          {/* ROWS */}
          <tbody>
            {paginatedRows.map((row, idx) => (
              <tr
                key={idx}
                className="border-b border-[#f4f3ef] cursor-pointer hover:bg-[#faf9f6]"
                onClick={() => setSelectedTrip(row)}
              >
                <td className="w-14 border-r border-[#f4f3ef]"></td>

                {visibleColumns.map(col => (
                  <td
                    key={col.key}
                    className={`px-4 border-r border-[#f4f3ef] py-3 ${
                      col.key === "travelCost" ? "text-right" : "text-left"
                    }`}
                  >
                    {col.key === "name" ? (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#a6a385] flex items-center justify-center text-sm">
                          {row.name
                            .split(" ")
                            .map(n => n[0])
                            .join("")}
                        </div>
                        <div className="text-left">
                          <p className="font-medium">{row.name}</p>
                          <p className="text-xs text-[#707062]">{row.email}</p>
                        </div>
                      </div>
                    ) : col.key === "travelCost" ? (
                      <div>${parseSpend(row["travelCost"]) + parseSpend(row["hotelCost"])}</div>
                    ) : (
                      row[col.key]
                    )}
                  </td>
                ))}

                <td className="w-14"></td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className={"text-2xl flex justify-center items-center text-gray-500 py-10"}>
          There are no trips
        </div>
      )}

      {/* {sortedRows.length > 0 && (
        <div className="text-sm text-right px-14 py-4 text-gray-500">{`1– ${sortedRows.length} of ${sortedRows.length} trips`}</div>
      )} */}

      {sortedRows.length > 0 && (
        <div className="flex justify-between items-center px-14 py-4 text-gray-600 text-sm">
          {/* Pagination controls */}
          <div className="flex items-center gap-2">
            {/* Previous */}
            <button
              disabled={safePage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className={`px-3 py-1 border rounded cursor-pointer ${
                safePage === 1 ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100"
              }`}
            >
              Prev
            </button>

            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 border rounded cursor-pointer ${
                  safePage === page ? "bg-[#575b46] text-white" : "hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}

            {/* Next */}
            <button
              disabled={safePage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className={`px-3 py-1 border rounded cursor-pointer ${
                safePage === totalPages ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100"
              }`}
            >
              Next
            </button>
          </div>

          {/* Showing X–Y of Z */}
          <div>
            {startIndex + 1}–{endIndex} of {totalRows} trips
          </div>
        </div>
      )}

      {selectedTrip && (
        <SelectedTrip selectedTrip={selectedTrip} setSelectedTrip={setSelectedTrip} />
      )}
    </div>
  );
}
