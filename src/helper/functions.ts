import type { Row } from "./type";
import type { DateRange } from "react-day-picker";

export function getMostFrequentValues<T extends keyof Row>(rows: Row[], key: T): Array<Row[T]> {
  const countMap = rows.reduce<Record<string, number>>((acc, row) => {
    const value = row[key];
    if (value !== null && value !== undefined) {
      const mapKey = String(value); // Convert to string for counting
      acc[mapKey] = (acc[mapKey] || 0) + 1;
    }
    return acc;
  }, {});

  const maxCount = Math.max(...Object.values(countMap), 0);

  // Map back to original type
  return Object.entries(countMap)
    .filter(([, count]) => count === maxCount)
    .map(([mapKey]) => {
      // Try to convert back to the original type
      const sampleValue = rows.find(row => String(row[key]) === mapKey)?.[key];
      return sampleValue as Row[T];
    });
}

// Helper to parse spend string like "$4.00" to number
export function parseSpend(spend: string): number {
  return parseFloat(spend.replace(/[$,]/g, "")) || 0;
}

/**
 * Get the row with the biggest spender
 * @param rows - Array of Row objects
 * @returns Row | null - the row with the highest spend
 */
// export function getBiggestSpender(rows: Row[]): Row | null {
//   if (!rows || rows.length === 0) return null;

//   return rows.reduce<Row | null>((max, row) => {
//     if (!max) return row;
//     return parseSpend(row.travelCost + row.hotelCost) > parseSpend(max.travelCost + max.hotelCost)
//       ? row
//       : max;
//   }, null);
// }

export function getTripStats(rows: Row[]) {
  const numberOfTrips = rows.length;

  const totalSpend = rows.reduce((sum, row) => sum + parseSpend(row.travelCost + row.hotelCost), 0);

  const averageTripCost = numberOfTrips > 0 ? totalSpend / numberOfTrips : 0;

  return { numberOfTrips, averageTripCost };
}

export function getKeyCost(rows: Row[]): Row | null {
  if (!rows || rows.length === 0) return null;

  return rows.reduce<Row | null>((max, row) => {
    if (!max) return row;
    return parseSpend(row.travelCost + row.hotelCost) > parseSpend(max.travelCost + max.hotelCost)
      ? row
      : max;
  }, null);
}

export function ExtractCosts(rows: Row[]) {
  let totalTravelCost = 0;
  let totalHotelCost = 0;

  const extracted = rows.map(row => {
    const travelCost = parseFloat(String(row.travelCost).replace(/[^0-9.]/g, ""));
    const hotelCost = parseFloat(String(row.hotelCost).replace(/[^0-9.]/g, ""));

    totalTravelCost += travelCost;
    totalHotelCost += hotelCost;

    return {
      name: row.name,
      travelCost,
      hotelCost,
    };
  });

  return {
    extracted,
    totalTravelCost,
    totalHotelCost,
  };
}

export function getBiggestSpender(rows: Row[]) {
  const totals: Record<string, number> = {};

  rows.forEach(row => {
    // Normalize the cost values
    const travel = parseFloat(String(row.travelCost).replace(/[^0-9.]/g, ""));
    const hotel = parseFloat(String(row.hotelCost).replace(/[^0-9.]/g, ""));
    const totalCost = travel + hotel;

    if (!totals[row.name]) {
      totals[row.name] = 0;
    }

    totals[row.name] += totalCost;
  });

  // Find the highest spender
  let biggestName = "";
  let maxSpent = 0;

  Object.entries(totals).forEach(([name, total]) => {
    if (total > maxSpent) {
      maxSpent = total;
      biggestName = name;
    }
  });

  // 👉 Collect ALL row data for that person
  const biggestSpenderRows = rows.filter(r => r.name === biggestName);

  return {
    name: biggestName,
    location: biggestSpenderRows.length > 0 ? biggestSpenderRows[0].location : "",
    department: biggestSpenderRows.length > 0 ? biggestSpenderRows[0].department : "",
    email: biggestSpenderRows.length > 0 ? biggestSpenderRows[0].email : "",
    role: biggestSpenderRows.length > 0 ? biggestSpenderRows[0].role : "",
    totalSpent: maxSpent,
    trips: biggestSpenderRows,
    // totalSpent: maxSpent,
    // breakdown: totals,
  };
}

export function getBiggestTrip(rows: Row[]) {
  let biggestTrip: Row | null = null;
  let maxCost = 0;

  rows.forEach(row => {
    const travel = parseFloat(String(row.travelCost).replace(/[^0-9.]/g, ""));
    const hotel = parseFloat(String(row.hotelCost).replace(/[^0-9.]/g, ""));
    const total = travel + hotel;

    if (total > maxCost) {
      maxCost = total;
      biggestTrip = row;
    }
  });

  return {
    totalCost: maxCost,
    trips: biggestTrip,
  };
}

export function getTotalSpend(trips: Row[]): number {
  return trips.reduce((total, trip) => {
    const travel = parseFloat(trip.travelCost.replace(/[^0-9.-]/g, "")) || 0;
    const hotel = parseFloat(trip.hotelCost.replace(/[^0-9.-]/g, "")) || 0;

    return total + travel + hotel;
  }, 0);
}

export function getFormattedTotalSpend(trips: Row[]): string {
  const total = getTotalSpend(trips);
  return `$${total.toFixed(2)}`;
}

function formatMonthDay(date: Date) {
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function formatDate(date: Date) {
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export function getLastNMonthsRange(months: number) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - months, 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return `${formatMonthDay(start)} – ${formatMonthDay(end)}`;
}

export function formatDateRange(range: DateRange | undefined) {
  if (!range || !range.from || !range.to) return "";
  return `${formatDate(range.from)} – ${formatDate(range.to)}`;
}
