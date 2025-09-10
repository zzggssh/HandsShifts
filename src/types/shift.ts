export type WorkType = {
  id: number;
  name: string;
  nameGt5: string;
  nameLt5: string;
  nameOne: string;
};

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type Shift = {
  id: string;
  logo: string | null;
  coordinates: Coordinates;
  address: string;
  companyName: string;
  dateStartByCity: string;
  timeStartByCity: string;
  timeEndByCity: string;
  currentWorkers: number;
  planWorkers: number;
  workTypes: WorkType[];
  priceWorker: number;
  bonusPriceWorker: number;
  customerFeedbacksCount: string;
  customerRating: number | null;
  isPromotionEnabled: boolean;
};

export type ShiftsResponse = {
  data: Shift[];
  status: number;
};

