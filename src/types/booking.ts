export type PublicService = {
  id: string;
  name: string;
  description: string | null;
  priceCents: number;
  price: number;
  durationMinutes: number;
  duration: string;
};

export type PublicStaffMember = {
  id: string;
  name: string;
  role: "OWNER" | "STAFF";
  isMain: boolean;
  avatarUrl: string | null;
};

export type AvailabilityDay = {
  label: string;
  date: string;
  allSlots: string[];
  slots: string[];
  bookedSlots: string[];
  staffSlots: Record<string, string[]>;
  staffBookedSlots: Record<string, string[]>;
  availableStaffBySlot: Record<string, string[]>;
};

export type PublicBookingResponse = {
  id: string;
  bookingCode: string;
  status: string;
};
