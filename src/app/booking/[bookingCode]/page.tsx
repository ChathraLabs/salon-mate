import { notFound } from "next/navigation";
import { CalendarDays, CalendarPlus, Clock, Phone, RotateCcw, Scissors, ShieldCheck, Ticket, User } from "lucide-react";
import { getStaffRoleLabelForService } from "@/app/config/services";
import { getPublicBookingByCode } from "@/server/services/bookings";

type BookingStatusPageProps = {
  params: Promise<{
    bookingCode: string;
  }>;
};

function formatBookingDate(value: Date) {
  return new Intl.DateTimeFormat("en-LK", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(value);
}

function formatBookingTime(value: Date) {
  return new Intl.DateTimeFormat("en-LK", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(value);
}

function formatDuration(start: Date, end: Date) {
  const minutes = Math.max(0, Math.round((end.getTime() - start.getTime()) / 60000));
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;

  if (hours && rest) return `${hours} hr ${rest} min`;
  if (hours) return `${hours} hour${hours === 1 ? "" : "s"}`;
  return `${rest} min`;
}

function formatStatus(status: string) {
  if (status === "PENDING") return "Pending Confirmation";
  if (status === "CONFIRMED") return "Confirmed";
  if (status === "CANCELLED") return "Cancelled";
  if (status === "REJECTED") return "Rejected";
  if (status === "COMPLETED") return "Completed";
  return status;
}

export default async function BookingStatusPage({ params }: BookingStatusPageProps) {
  const { bookingCode } = await params;
  const booking = await getPublicBookingByCode(decodeURIComponent(bookingCode));

  if (!booking) notFound();

  const staffRoleLabel = getStaffRoleLabelForService(booking.serviceId);
  const rows = [
    { Icon: Ticket, label: "Booking ID", value: booking.bookingCode },
    { Icon: Scissors, label: "Service", value: booking.service.name },
    { Icon: CalendarDays, label: "Date", value: formatBookingDate(booking.startsAt) },
    { Icon: Clock, label: "Time", value: formatBookingTime(booking.startsAt) },
    { Icon: User, label: staffRoleLabel, value: booking.assignedStaff?.name ?? "Any available" },
    { Icon: RotateCcw, label: "Duration", value: formatDuration(booking.startsAt, booking.endsAt) },
    { Icon: User, label: "Customer", value: booking.customer.name },
    { Icon: ShieldCheck, label: "Status", value: formatStatus(booking.status), isStatus: true },
  ];

  return (
    <main className="salon-app booking-status-page">
      <section className="booking-status-page__inner">
        <div className="booking-confirmation-icon booking-status-page__icon">
          <ShieldCheck aria-hidden="true" />
        </div>
        <p className="booking-app-eyebrow">Booking Status</p>
        <h1>{formatStatus(booking.status)}</h1>
        <p className="booking-status-page__copy">
          Review your appointment details below. Contact the salon if you need to change this booking.
        </p>

        <div className="booking-summary-card booking-status-page__card">
          {rows.map(({ Icon, label, value, isStatus }) => (
            <div key={label} className="booking-summary-row">
              <span className="booking-summary-row__icon"><Icon aria-hidden="true" /></span>
              <span className="booking-summary-row__label">
                {label}
              </span>
              <strong className={isStatus ? `booking-status-pill booking-status-pill--${booking.status.toLowerCase()}` : undefined}>
                {value}
              </strong>
            </div>
          ))}
        </div>

        <div className="booking-status-page__footer">
          <p className="booking-status-page__contact">
            The salon will contact you at <strong>{booking.customer.phone}</strong> to confirm.
          </p>

          <div className="booking-confirmation-actions">
            <a href="/?section=booking" className="booking-primary-action">
              <CalendarPlus aria-hidden="true" />
              Book Another
            </a>
            <a href="tel:+94715729660" className="booking-secondary-action">
              <Phone aria-hidden="true" />
              Call Salon
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
