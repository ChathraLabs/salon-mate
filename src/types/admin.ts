export type AdminBookingRow = {
  id: string;
  bookingCode: string;
  status: "PENDING" | "CONFIRMED" | "REJECTED" | "CANCELLED" | "COMPLETED";
  startsAt: string;
  endsAt: string;
  customerNote: string | null;
  adminNote: string | null;
  service: {
    id: string;
    name: string;
    priceCents: number;
    durationMinutes: number;
  };
  customer: {
    name: string;
    phone: string;
    email: string | null;
  };
  assignedStaff: {
    id: string;
    name: string;
    email: string;
  } | null;
};

export type AdminStaffRow = {
  id: string;
  name: string;
  email: string;
  role: "OWNER" | "STAFF";
  active: boolean;
};
