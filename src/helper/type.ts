export type Row = {
  name: string;
  email: string;
  destination: string;
  start: string;
  end: string;
  spend: string;
  title: string;
  details: string;
  department: string;
  status: string;
  airline: string;
  hotel: string;
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
