import type { Row } from "./type";

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
function parseSpend(spend: string): number {
  return parseFloat(spend.replace(/[$,]/g, "")) || 0;
}

/**
 * Get the row with the biggest spender
 * @param rows - Array of Row objects
 * @returns Row | null - the row with the highest spend
 */
export function getBiggestSpender(rows: Row[]): Row | null {
  if (!rows || rows.length === 0) return null;

  return rows.reduce<Row | null>((max, row) => {
    if (!max) return row;
    return parseSpend(row.spend) > parseSpend(max.spend) ? row : max;
  }, null);
}

export function getTripStats(rows: Row[]) {
  const numberOfTrips = rows.length;

  const totalSpend = rows.reduce((sum, row) => sum + parseSpend(row.spend), 0);

  const averageTripCost = numberOfTrips > 0 ? totalSpend / numberOfTrips : 0;

  return { numberOfTrips, averageTripCost };
}
