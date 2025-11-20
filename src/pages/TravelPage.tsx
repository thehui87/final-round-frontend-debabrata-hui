import { useState, useEffect, useRef } from "react";
import TripTable from "../components/TripTable";
import { CalendarRange, ChevronDown } from "lucide-react";
import SlidingTabs from "../components/SlidingTabs";
import type { Column } from "../helper/type";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";
import { setData } from "../redux/slices/tripSlice";
import { getMostFrequentValues, getBiggestSpender, getTripStats } from "../helper/funtions";
import SpendBar from "../components/Spendbar";
import { Modal } from "../components/Modal";

export default function TravelPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { tripData } = useSelector((state: RootState) => state.trip);
  const [activeTab, setActiveTab] = useState(0);
  const [columns, setColumns] = useState<Column[]>([
    { key: "name", label: "Name", visible: true, locked: true },
    { key: "destination", label: "Destination", visible: true },
    { key: "start", label: "Start date", visible: true },
    { key: "end", label: "End Date", visible: true },
    { key: "spend", label: "Spend", visible: true },
  ]);
  const [dateOpen, setDateOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const cleanedRows = tripData.map(row => {
    const num = parseFloat(row.spend.replace("$", "")) || 0;
    return {
      ...row,
      spend: Number(num.toFixed(2)), // number with two decimals
    };
  });

  const topAirlines = getMostFrequentValues(tripData, "airline");
  const topHotels = getMostFrequentValues(tripData, "hotel");
  const topDestinations = getMostFrequentValues(tripData, "destination");
  const biggestSpender = getBiggestSpender(tripData);
  const biggestTrip = biggestSpender?.spend;
  const averageTripCost = "$" + getTripStats(tripData).averageTripCost.toFixed(2);

  const total = cleanedRows.reduce((sum, row) => sum + row.spend, 0);
  const totalString = total.toFixed(2); // e.g., "1234.56"
  const [integerPart, decimalPart] = totalString.split(".");

  useEffect(() => {
    fetch("/data.json")
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.rows)) {
          dispatch(setData(data.rows));
        } else {
          console.error("Fetched data does not contain a 'rows' array.");
        }
      })
      .catch(error => console.error("Error fetching data:", error))
      .finally(() => setLoading(false));

    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setDateOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="w-full bg-white py-10">
      <div className="">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 px-14">
          <div>
            <p className="text-sm text-gray-500 text-left">Expenses</p>
            <h1 className="text-4xl font-semibold mt-1">Travel</h1>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-6 items-end px-14" ref={containerRef}>
          {/* Date range dropdown */}
          <div className="relative w-fit">
            <button
              onClick={() => setDateOpen(!dateOpen)}
              className="flex items-center gap-2 border border-gray-300 px-4 py-2 bg-white hover:bg-gray-50"
            >
              <CalendarRange size={16} />
              <span className="text-sm">Last 3 months to next 3 months</span>
              <ChevronDown size={16} className={`${dateOpen ? "rotate-180" : ""}`} />
            </button>

            {dateOpen && (
              <div className="absolute mt-1 w-64 bg-white border border-gray-300 shadow-md text-left">
                <div
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => setOpen(true)}
                >
                  Last 6 months
                </div>
                <div
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => setOpen(true)}
                >
                  This year
                </div>
                <div
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => setOpen(true)}
                >
                  Custom range
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Spend Section */}
        <div className="my-10 px-14 text-left">
          <p className="text-sm text-gray-500">Spend</p>
          {/* <h2 className="text-4xl font-semibold mt-1">${`${total.toFixed(2)}`}</h2> */}
          <h2 className="text-4xl font-normal mt-1 flex items-baseline">
            <span className="text-[40px]">${integerPart}</span>
            <span className="text-[24px]">.{decimalPart} USD</span>
          </h2>

          <SpendBar
            data={[
              { category: "Airlines", amount: 6965.63 },
              { category: "Hotels", amount: 4120.1 },
              { category: "GroundTransportation", amount: 870.3 },
            ]}
          />
          {/* Stat Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mt-10">
            <StatItem title="Cashback" value="$967.97" />
            <StatItem
              title="Number of trips"
              value={String(getTripStats(tripData).numberOfTrips)}
            />
            <StatItem title="Average trip cost" value={averageTripCost} />
            <StatItem title="Biggest trip" value={biggestTrip ?? "N/A"} />
            <StatItem title="Biggest spender" value={biggestSpender?.name ?? "N/A"} />
            <StatItem title="Top destination" value={topDestinations[0] ?? "N/A"} />
            <StatItem title="Top hotel chain" value={topHotels[0] ?? "N/A"} />
            <StatItem title="Top airline" value={topAirlines[0] ?? "N/A"} />
          </div>
        </div>
      </div>

      <SlidingTabs onChange={i => setActiveTab(i)} />
      <TripTable activeTab={activeTab} columns={columns} setColumns={setColumns} />

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        onGetStarted={() => alert("Redirecting...")}
      ></Modal>
    </div>
  );
}

function StatItem({ title, value }: { title: string; value: string }) {
  return (
    <div className="flex justify-start flex-col text-left">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-lg mt-1 text-[20px]">{value}</p>
    </div>
  );
}
