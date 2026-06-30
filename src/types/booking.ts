export type PublicService = {
  id: string;
  name: string;
  description: string | null;
  priceCents: number;
  price: number;
  durationMinutes: number;
  duration: string;
};

export type AvailabilityDay = {
  label: string;
  date: string;
  allSlots: string[];
  slots: string[];
  bookedSlots: string[];
};

export type PublicBookingResponse = {
  id: string;
  bookingCode: string;
  status: string;
};
