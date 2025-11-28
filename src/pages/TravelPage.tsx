import { useState, useEffect, useRef } from "react";
import TripTable from "../components/TripTable";
import { ArrowRight } from "lucide-react";
import SlidingTabs from "../components/SlidingTabs";
import type { Column } from "../helper/type";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";
import { setData } from "../redux/slices/tripSlice";
import {
  getMostFrequentValues,
  getBiggestSpender,
  getTripStats,
  getBiggestTrip,
} from "../helper/functions";
import SpendBar from "../components/SpendBar";
import { Modal } from "../components/Modal";
import BiggestSpender from "../components/BiggestSpender";
import type { Row, BiggestSpenderDataProps, BiggestTripDataProps } from "../helper/type";
import { ExtractCosts, getFormattedTotalSpend } from "../helper/functions";
import BiggestTrip from "../components/BiggestTrip";
import CustomSelectTag from "../components/CustomSelectTag";

export default function TravelPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { tripData, filteredTrips, globalFilterOn } = useSelector((state: RootState) => state.trip);
  const [activeData, setActiveData] = useState<Row[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [columns, setColumns] = useState<Column[]>([
    { key: "name", label: "Name", visible: true, locked: true },
    { key: "destination", label: "Destination", visible: true },
    { key: "start", label: "Start date", visible: true },
    { key: "end", label: "End Date", visible: true },
    { key: "travelCost", label: "Spend", visible: true },
  ]);
  // const [dateOpen, setDateOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [biggestTripData, setBiggestTripData] = useState<BiggestTripDataProps | null>(null);

  const [topAirlines, setTopAirlines] = useState<string[]>([]);
  const [topHotels, setTopHotels] = useState<string[]>([]);
  const [topDestinations, setTopDestinations] = useState<string[]>([]);
  const [biggestSpender, setBiggestSpender] = useState<BiggestSpenderDataProps | null>(null);
  const [biggestTrip, setBiggestTrip] = useState<string>("");
  const [averageTripCost, setAverageTripCost] = useState<string>("");
  const [integerPart, setIntegerPart] = useState<string>("");
  const [decimalPart, setDecimalPart] = useState<string>("");

  const [biggestSpenderData, setBiggestSpenderData] = useState<BiggestSpenderDataProps | null>(
    null
  );

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
        // setDateOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dispatch]);

  useEffect(() => {
    if (globalFilterOn) {
      setActiveData(filteredTrips);
    } else {
      setActiveData(tripData);
    }
  }, [tripData, filteredTrips, globalFilterOn]);

  useEffect(() => {
    setTopAirlines(getMostFrequentValues(activeData, "airline"));
    setTopHotels(getMostFrequentValues(activeData, "hotel"));
    setTopDestinations(getMostFrequentValues(activeData, "destination"));
    setBiggestSpender(getBiggestSpender(activeData));
    setBiggestTrip("$" + getBiggestTrip(activeData).totalCost);
    setAverageTripCost("$" + getTripStats(activeData).averageTripCost.toFixed(2));

    const [a, b] = getFormattedTotalSpend(activeData).toString().split(".");
    setIntegerPart(a);
    setDecimalPart(b);
  }, [activeData]);

  if (loading) return <div>Loading...</div>;

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setQuery(e.target.value);
  // };

  return (
    <div className="w-full bg-white py-10">
      <div className="">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 px-4 sm:px-14">
          <div>
            <p className="text-sm text-gray-500 text-left">Expenses</p>
            <h1 className="text-4xl font-semibold mt-1">Travel</h1>
          </div>
        </div>

        {/* Buttons */}
        <div
          className="flex flex-row gap-6 items-center justify-end px-4 sm:px-14"
          ref={containerRef}
        >
          {/* <div className="p-4">
            <div className="relative max-w-md mx-auto">
              <div className="absolute top-0 left-0 p-3 text-gray-400">
                <Search size={16} />
              </div>
              <input
                type="text"
                value={query}
                onChange={handleChange}
                className="w-full px-8 py-2 text-sm text-gray-700 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search for Trip stat"
              />
              <div className="absolute top-0 right-0 p-3 text-gray-400">
                <ArrowRight size={16} />
              </div>
            </div>
          </div> */}
          {/* Date range dropdown */}

          <CustomSelectTag />
        </div>

        {/* Spend Section */}
        <div className="my-10 px-4 sm:px-14 text-left">
          <p className="text-sm text-gray-500">Spend</p>
          {/* <h2 className="text-4xl font-semibold mt-1">${`${total.toFixed(2)}`}</h2> */}
          <h2 className="text-4xl font-normal mt-1 flex items-baseline">
            <span className="text-[40px]">{integerPart}</span>
            <span className="text-[24px]">.{decimalPart} USD</span>
          </h2>

          <SpendBar
            data={[
              { category: "Airlines", amount: ExtractCosts(activeData).totalTravelCost },
              { category: "Hotels", amount: ExtractCosts(activeData).totalHotelCost },
              { category: "GroundTransportation", amount: 870.3 },
            ]}
          />
          {/* Stat Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mt-10">
            <StatItem title="Cashback" value="$967.97" />
            <StatItem
              title="Number of trips"
              value={String(getTripStats(activeData).numberOfTrips)}
            />
            <StatItem title="Average trip cost" value={averageTripCost} />
            <StatItemTrip
              title="Biggest trip"
              value={biggestTrip ? biggestTrip : "N/A"}
              onClick={() => {
                setBiggestTripData(getBiggestTrip(activeData));
              }}
            />
            <StatItemLink
              name="Biggest spender"
              value={biggestSpender?.name ?? "N/A"}
              onClick={() => setBiggestSpenderData(biggestSpender)}
            />
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

      {biggestSpenderData && (
        <BiggestSpender selectedData={biggestSpenderData} setSelectedData={setBiggestSpenderData} />
      )}
      {biggestTripData && (
        <BiggestTrip
          selectedTrip={biggestTripData?.trips ? biggestTripData.trips : null}
          setSelectedTrip={setBiggestTripData}
        />
      )}
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

function StatItemTrip({
  title,
  value,
  onClick,
}: {
  title: string;
  value: string;
  onClick: () => void;
}) {
  return (
    <div
      className="flex justify-start flex-col text-left"
      onClick={() => {
        onClick();
      }}
    >
      <p className="text-sm text-gray-500">{title}</p>
      <p className="flex items-center gap-2 text-lg mt-1 text-[20px] underline underline-offset-1 cursor-pointer">
        {value} <ArrowRight size={16} />
      </p>
    </div>
  );
}

function StatItemLink({
  name,
  value,
  onClick,
}: {
  name: string;
  value: string;
  onClick: () => void;
}) {
  return (
    <div
      onClick={() => {
        onClick();
      }}
      className="flex justify-start flex-col text-left"
    >
      <p className="text-sm text-gray-500 ">{name}</p>
      <p className="flex items-center gap-2 text-lg mt-1 text-[20px] underline underline-offset-1 cursor-pointer">
        {value} <ArrowRight size={16} />
      </p>
    </div>
  );
}
