export type Row = {
  name: string;
  email: string;
  location: string;
  destination: string;
  start: string;
  end: string;
  travelCost: string;
  hotelCost: string;
  title: string;
  details: string;
  department: string;
  status: string;
  airline: string;
  hotel: string;
  role: string;
};

export interface Column {
  key: keyof Row;
  label: string;
  visible: boolean;
  locked?: boolean;
}

export interface ActiveFilters {
  department: string[];
  amount?: { min: number | null; max: number | null };
  location: string[];
  cardholder: string[];
}

export interface BiggestSpenderDataProps {
  name: string;
  email: string;
  role: string;
  department: string;
  location: string;
  totalSpent: number;
  trips: Row[];
}

export interface BiggestTripDataProps {
  totalCost: number;
  trips: Row | null;
}
