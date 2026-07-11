import { useEffect, useMemo, useState } from 'react';
import { Check, ChevronRight, ChevronLeft, Calendar as CalendarIcon, Clock, User, CheckCircle } from 'lucide-react';
import { Calendar as DatePickerCalendar } from './ui/calendar';
import {
  formatServiceDuration as formatDurationLabel,
  formatServicePrice as formatPrice,
  getStaffRoleLabelForService,
  getSalonService,
  publicSalonServices,
  type SalonServiceOption,
} from '../config/services';
import type { AvailabilityDay, PublicService, PublicStaffMember } from '@/types/booking';

type BookingProps = {
  requestedService?: { id: string; key: number } | null;
};

const fallbackServices: PublicService[] = publicSalonServices;

const stepLabels = ['Service', 'Date & Time', 'Details', 'Confirm'];

const defaultTimeSlots = Array.from({ length: 15 }, (_, index) => {
  const hour = index + 8;
  return `${hour.toString().padStart(2, '0')}:00`;
});

function formatTimeLabel(time: string) {
  const [hourText, minute] = time.split(':');
  const hour = Number(hourText);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${minute} ${suffix}`;
}

function minutesFromTime(time: string) {
  const [hour, minute] = time.split(':').map(Number);
  return hour * 60 + minute;
}

function timeFromMinutes(totalMinutes: number) {
  const hour = Math.floor(totalMinutes / 60) % 24;
  const minute = totalMinutes % 60;
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
}

function dateToLocalDate(date: string) {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function localDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function fallbackAvailabilityDays(days = 7): AvailabilityDay[] {
  const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();

  return Array.from({ length: days }, (_, index) => {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + index);
    const label = index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : `${labels[date.getDay()]} ${date.getDate()}`;

    return {
      label,
      date: localDateKey(date),
      allSlots: defaultTimeSlots,
      slots: defaultTimeSlots,
      bookedSlots: [],
      staffSlots: {},
      staffBookedSlots: {},
      availableStaffBySlot: {},
    };
  });
}

function optionsForService(service: PublicService | null): SalonServiceOption[] {
  if (!service) return [];

  return getSalonService(service.id)?.options ?? [
    {
      id: service.id,
      name: service.name,
      price: service.price,
      duration: service.durationMinutes,
      defaultSelected: true,
    },
  ];
}

function resolvePublicService(serviceId: string, services: PublicService[]) {
  return services.find((item) => item.id === serviceId)
    ?? publicSalonServices.find((item) => item.id === serviceId)
    ?? null;
}

function barberAvatarUrl(barber: PublicStaffMember) {
  const lowerName = barber.name.toLowerCase();

  if (barber.avatarUrl) return barber.avatarUrl;
  if (lowerName.includes('dimuthu')) return '/staff/Dimuthu.jpeg';
  if (lowerName.includes('sanju')) return '/staff/Sanju.png';
  if (lowerName.includes('salindee')) return '/staff/Salindee.png';
  if (lowerName.includes('vinu')) return '/staff/Vinu.png';

  return null;
}

const inputBase: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem 1rem',
  borderRadius: '0.75rem',
  border: '1px solid var(--border)',
  background: 'var(--input-background)',
  color: 'var(--foreground)',
  fontFamily: 'var(--font-body)',
  fontSize: '0.95rem',
  outline: 'none',
  transition: 'border-color 0.2s',
};

const cardStyle: React.CSSProperties = {
  background: 'var(--card)',
  border: '1px solid var(--border)',
  borderRadius: '1.5rem',
  boxShadow: '0 4px 48px rgba(0,0,0,0.5)',
};

const selectionBase: React.CSSProperties = {
  padding: '1rem',
  borderRadius: '0.875rem',
  border: '1px solid var(--border)',
  background: 'var(--muted)',
  cursor: 'pointer',
  textAlign: 'left' as const,
  transition: 'all 0.15s',
  width: '100%',
};

const selectionActive: React.CSSProperties = {
  ...selectionBase,
  border: '1px solid rgba(212,165,32,0.6)',
  background: 'rgba(212,165,32,0.08)',
  boxShadow: '0 0 0 2px rgba(212,165,32,0.12)',
};

export function Booking({ requestedService }: BookingProps) {
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<PublicService[]>(fallbackServices);
  const [barbers, setBarbers] = useState<PublicStaffMember[]>([]);
  const [dates, setDates] = useState<AvailabilityDay[]>([]);
  const [selectedService, setSelectedService] = useState<PublicService | null>(null);
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [customerDetails, setCustomerDetails] = useState({ name: '', phone: '', email: '', note: '' });
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [bookingCode, setBookingCode] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAvailabilityLoading, setIsAvailabilityLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadBookingData() {
      try {
        const [servicesResponse, availabilityResponse] = await Promise.all([
          fetch('/api/services'),
          fetch('/api/availability'),
        ]);

        const [servicesData, availabilityData] = await Promise.all([
          servicesResponse.json(),
          availabilityResponse.json(),
        ]);

        if (!servicesResponse.ok || !availabilityResponse.ok) {
          throw new Error(servicesData.error ?? availabilityData.error ?? 'Unable to load booking options.');
        }

        if (!cancelled) {
          setServices(publicSalonServices);
          setDates(availabilityData.days);
          setBarbers(availabilityData.staff ?? []);
          setSelectedStaffId((current) => current ?? availabilityData.staff?.find((member: PublicStaffMember) => member.isMain)?.id ?? availabilityData.staff?.[0]?.id ?? null);
          setLoadError(null);
        }
      } catch (error) {
        if (!cancelled) {
          setDates(fallbackAvailabilityDays());
          setBarbers([]);
          setLoadError(error instanceof Error ? `${error.message} Showing default times for preview.` : 'Unable to load booking options. Showing default times for preview.');
        }
      }
    }

    loadBookingData();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!requestedService) return;

    const service = resolvePublicService(requestedService.id, services);
    if (!service) return;

    selectService(service);
    setStep(1);
    setSubmitError(null);
  }, [requestedService, services]);

  const selectService = (service: PublicService) => {
    const options = optionsForService(service);
    const defaultIds = options.filter((option) => option.defaultSelected).map((option) => option.id);

    setSelectedService(service);
    setSelectedOptionIds(defaultIds.length > 0 ? defaultIds : options.slice(0, 1).map((option) => option.id));
    setSelectedStaffId(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setSubmitError(null);
  };

  const handleOptionToggle = (optionId: string) => {
    setSelectedOptionIds((current) => (
      current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId]
    ));
    setSelectedTime(null);
  };

  const availableTimeSlots = useMemo(() => {
    const day = dates.find((date) => date.date === selectedDate);
    if (!day) return [];
    return selectedStaffId ? (day.staffSlots?.[selectedStaffId] ?? []) : day.slots;
  }, [dates, selectedDate, selectedStaffId]);
  const allTimeSlots = useMemo(() => {
    return dates.find((date) => date.date === selectedDate)?.allSlots ?? (selectedDate ? defaultTimeSlots : []);
  }, [dates, selectedDate]);
  const bookedTimeSlots = useMemo(() => {
    const day = dates.find((date) => date.date === selectedDate);
    if (!day) return [];
    return selectedStaffId ? (day.staffBookedSlots?.[selectedStaffId] ?? []) : day.bookedSlots;
  }, [dates, selectedDate, selectedStaffId]);
  const selectedDateOption = useMemo(() => {
    return dates.find((date) => date.date === selectedDate) ?? null;
  }, [dates, selectedDate]);
  const selectedStaff = useMemo(() => {
    return barbers.find((barber) => barber.id === selectedStaffId) ?? null;
  }, [barbers, selectedStaffId]);
  const selectableDateKeys = useMemo(() => new Set(dates.map((date) => date.date)), [dates]);
  const availableTimeSlotSet = useMemo(() => new Set(availableTimeSlots), [availableTimeSlots]);
  const bookedTimeSlotSet = useMemo(() => new Set(bookedTimeSlots), [bookedTimeSlots]);
  const selectedCalendarDate = selectedDate ? dateToLocalDate(selectedDate) : undefined;
  const firstAvailableDate = dates[0]?.date;
  const lastAvailableDate = dates[dates.length - 1]?.date;
  const isUsingFallbackBookingOptions = loadError?.includes('Showing default times for preview.') ?? false;
  const selectedServiceOptions = useMemo(() => optionsForService(selectedService), [selectedService]);
  const selectedOptions = useMemo(
    () => selectedServiceOptions.filter((option) => selectedOptionIds.includes(option.id)),
    [selectedOptionIds, selectedServiceOptions],
  );
  const selectedTotalPrice = selectedOptions.reduce((total, option) => total + option.price, 0);
  const selectedTotalDuration = selectedOptions.reduce((total, option) => total + option.duration, 0);
  const selectedOptionLabels = selectedOptions.map((option) => option.name).join(', ');
  const selectedStaffRoleLabel = getStaffRoleLabelForService(selectedService?.id);
  const selectedTimeEnd = useMemo(() => {
    if (!selectedTime || selectedTotalDuration <= 0) return null;
    return timeFromMinutes(minutesFromTime(selectedTime) + selectedTotalDuration);
  }, [selectedTime, selectedTotalDuration]);
  const heldTimeSlotSet = useMemo(() => {
    if (!selectedTime || selectedTotalDuration <= 0) return new Set<string>();

    const startsAt = minutesFromTime(selectedTime);
    const endsAt = startsAt + selectedTotalDuration;

    return new Set(
      allTimeSlots.filter((slot) => {
        const slotStartsAt = minutesFromTime(slot);
        return slotStartsAt >= startsAt && slotStartsAt < endsAt;
      }),
    );
  }, [allTimeSlots, selectedTime, selectedTotalDuration]);
  useEffect(() => {
    if (!selectedService || selectedTotalDuration <= 0 || isUsingFallbackBookingOptions) return;

    let cancelled = false;
    const serviceId = selectedService.id;

    async function loadDurationAvailability() {
      setIsAvailabilityLoading(true);

      try {
        const params = new URLSearchParams({
          duration: String(selectedTotalDuration),
          serviceId,
        });
        const response = await fetch(`/api/availability?${params.toString()}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error ?? 'Unable to refresh availability.');
        }

        if (!cancelled) {
          const nextStaff = data.staff ?? [];
          setDates(data.days);
          setBarbers(nextStaff);
          setSelectedStaffId((current) => {
            if (current && nextStaff.some((member: PublicStaffMember) => member.id === current)) return current;
            return nextStaff.find((member: PublicStaffMember) => member.isMain)?.id ?? nextStaff[0]?.id ?? null;
          });
          setLoadError(null);
        }
      } catch (error) {
        if (!cancelled) {
          setLoadError(error instanceof Error ? error.message : 'Unable to refresh availability.');
        }
      } finally {
        if (!cancelled) {
          setIsAvailabilityLoading(false);
        }
      }
    }

    loadDurationAvailability();

    return () => {
      cancelled = true;
    };
  }, [selectedService, selectedTotalDuration, isUsingFallbackBookingOptions]);

  useEffect(() => {
    if (selectedTime && !availableTimeSlotSet.has(selectedTime)) {
      setSelectedTime(null);
    }
  }, [availableTimeSlotSet, selectedTime]);

  const handleNext = () => { if (step < stepLabels.length) setStep(step + 1); };
  const handleBack = () => { if (step > 1) setStep(step - 1); };
  const handleConfirmBooking = async () => {
    if (!selectedService || !selectedDate || !selectedTime) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: selectedService.id,
          staffId: selectedStaffId ?? undefined,
          optionIds: selectedOptionIds,
          date: selectedDate,
          time: selectedTime,
          customer: {
            name: customerDetails.name,
            phone: customerDetails.phone,
            email: customerDetails.email,
          },
          note: [
            customerDetails.note,
            selectedOptionLabels ? `Selected options: ${selectedOptionLabels}` : null,
            `Total: ${formatPrice(selectedTotalPrice)}`,
            `Estimated time: ${formatDurationLabel(selectedTotalDuration)}`,
          ].filter(Boolean).join('\n'),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? 'Unable to submit booking.');
      }

      setBookingCode(data.booking.bookingCode);
      setIsConfirmed(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to submit booking.');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleNewBooking = () => {
    setStep(1); setSelectedService(null); setSelectedDate(null);
    setSelectedOptionIds([]); setSelectedTime(null); setCustomerDetails({ name: '', phone: '', email: '', note: '' });
    setBookingCode(null); setSubmitError(null); setIsConfirmed(false);
  };

  const canProceed = [
    selectedService !== null && selectedOptions.length > 0,
    selectedDate !== null && selectedTime !== null && (barbers.length === 0 || selectedStaffId !== null),
    !!(customerDetails.name && customerDetails.phone),
    true,
  ][step - 1];

  if (isConfirmed) {
    return (
      <section id="booking" className="py-24 relative" style={{ background: 'var(--section-dark-green)' }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="text-center p-10 sm:p-14" style={cardStyle}>
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{
                background: 'linear-gradient(135deg, rgba(212,165,32,0.15), rgba(242,200,58,0.2))',
                border: '1px solid rgba(212,165,32,0.3)',
              }}
            >
              <CheckCircle className="w-10 h-10" style={{ color: 'var(--gold)' }} />
            </div>
            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--foreground)', fontSize: 'clamp(1.75rem, 4vw, 2.25rem)' }}>
              Booking Confirmed!
            </h2>
            <p className="mt-3 mb-8" style={{ fontFamily: 'var(--font-body)', color: 'var(--muted-foreground)', fontSize: '1rem' }}>
              Your appointment request has been submitted successfully.
            </p>

            <div className="text-left mb-8 rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
              {[
                { label: 'Booking ID', value: bookingCode },
                { label: 'Service', value: selectedService?.name },
                { label: 'Options', value: selectedOptionLabels },
                { label: 'Date', value: dates.find(d => d.date === selectedDate)?.label },
                { label: 'Time', value: selectedTime ? formatTimeLabel(selectedTime) : null },
                { label: selectedStaffRoleLabel, value: selectedStaff?.name },
                { label: 'Duration', value: selectedTotalDuration ? formatDurationLabel(selectedTotalDuration) : selectedService?.duration },
                { label: 'Price', value: formatPrice(selectedTotalPrice) },
              ].map(({ label, value }, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center px-5 py-3"
                  style={{
                    borderBottom: i < 7 ? '1px solid var(--border)' : 'none',
                    background: i % 2 === 0 ? 'var(--muted)' : 'var(--card)',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-body)', color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>{label}</span>
                  <span style={{ fontFamily: 'var(--font-body)', color: i === 0 ? 'var(--gold)' : 'var(--foreground)', fontSize: '0.875rem' }}>{value}</span>
                </div>
              ))}
              <div className="flex justify-between items-center px-5 py-3" style={{ background: 'var(--muted)' }}>
                <span style={{ fontFamily: 'var(--font-body)', color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>Status</span>
                <span
                  className="px-3 py-1 rounded-full"
                  style={{
                    fontFamily: 'var(--font-body)', color: 'var(--gold)', fontSize: '0.78rem',
                    background: 'rgba(212,165,32,0.1)', border: '1px solid rgba(212,165,32,0.2)',
                  }}
                >
                  Pending Confirmation
                </span>
              </div>
            </div>

            <p className="mb-8" style={{ fontFamily: 'var(--font-body)', color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>
              The salon will contact you at <strong style={{ color: 'var(--gold)' }}>{customerDetails.phone}</strong> to confirm.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleNewBooking}
                style={{
                  fontFamily: 'var(--font-body)',
                  background: 'linear-gradient(135deg, var(--gold-dark), var(--gold))',
                  color: 'var(--primary-foreground)',
                  borderRadius: '9999px', padding: '0.8rem 1.75rem',
                  border: 'none', cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(212,165,32,0.25)',
                  transition: 'box-shadow 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 6px 24px rgba(212,165,32,0.4)')}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(212,165,32,0.25)')}
              >
                Book Another
              </button>
              <a
                href="tel:+94715729660"
                style={{
                  fontFamily: 'var(--font-body)',
                  border: '1px solid rgba(212,165,32,0.35)', color: 'var(--foreground)',
                  borderRadius: '9999px', padding: '0.8rem 1.75rem', textAlign: 'center',
                  transition: 'all 0.2s', display: 'block', textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--gold)';
                  (e.currentTarget as HTMLAnchorElement).style.color = 'var(--gold-light)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(212,165,32,0.35)';
                  (e.currentTarget as HTMLAnchorElement).style.color = 'var(--foreground)';
                }}
              >
                Call Salon
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="py-24 relative overflow-hidden" style={{ background: 'var(--section-dark-green)' }}>
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(to right, transparent, rgba(212,165,32,0.3), transparent)' }}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 relative">
        {/* Header */}
        <div className="text-center mb-12 space-y-3">
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--gold)', fontSize: '0.75rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            ✦ Easy Booking ✦
          </p>
          <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--foreground)', fontSize: 'clamp(2rem, 4vw, 2.75rem)' }}>
            Book Your Appointment
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--muted-foreground)', fontSize: '1rem' }}>
            Follow these simple steps to secure your appointment
          </p>
          {loadError && (
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--gold-light)', fontSize: '0.875rem' }}>
              {loadError}
            </p>
          )}
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-10">
          {stepLabels.map((label, i) => {
            const s = i + 1;
            const isCompleted = s < step;
            const isActive = s === step;
            return (
              <div key={s} className="flex items-center">
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
                    style={{
                      background: isCompleted
                        ? 'linear-gradient(135deg, var(--gold-dark), var(--gold))'
                        : isActive
                        ? 'rgba(212,165,32,0.15)'
                        : 'var(--card)',
                      border: isActive
                        ? '2px solid var(--gold)'
                        : isCompleted
                        ? 'none'
                        : '1px solid var(--border)',
                      color: isCompleted
                        ? 'var(--primary-foreground)'
                        : isActive
                        ? 'var(--gold)'
                        : 'var(--muted-foreground)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.85rem',
                      boxShadow: isActive ? '0 0 0 4px rgba(212,165,32,0.1)' : 'none',
                    }}
                  >
                    {isCompleted ? <Check size={15} /> : s}
                  </div>
                  <span
                    className="hidden sm:block"
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.68rem',
                      color: isActive ? 'var(--gold)' : 'var(--muted-foreground)',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {label}
                  </span>
                </div>
                {s < stepLabels.length && (
                  <div
                    className="w-10 sm:w-14 h-px mx-1 mb-5 transition-all"
                    style={{
                      background: s < step
                        ? 'linear-gradient(to right, var(--gold-dark), var(--gold))'
                        : 'var(--border)',
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Card */}
        <div className="p-6 sm:p-10" style={cardStyle}>

          {/* Step 1 – Service */}
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="flex items-center gap-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--foreground)', fontSize: '1.4rem' }}>
                <CalendarIcon className="w-5 h-5" style={{ color: 'var(--gold)' }} />
                {selectedService ? selectedService.name : 'Select Service'}
              </h3>

              {!selectedService ? (
                <div className="grid sm:grid-cols-2 gap-3">
                  {services.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => selectService(service)}
                      style={selectionBase}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(212,165,32,0.3)'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; }}
                    >
                      <p style={{ fontFamily: 'var(--font-heading)', color: 'var(--foreground)', fontSize: '0.975rem', marginBottom: '0.35rem' }}>
                        {service.name}
                      </p>
                      <div className="flex items-center justify-between">
                        <span style={{ fontFamily: 'var(--font-body)', color: 'var(--gold)', fontSize: '0.8rem' }}>
                          {formatPrice(service.price)}
                        </span>
                        <span
                          className="px-2 py-0.5 rounded-full"
                          style={{ fontFamily: 'var(--font-body)', color: 'var(--muted-foreground)', fontSize: '0.72rem', background: 'var(--card)', border: '1px solid var(--border)' }}
                        >
                          {service.duration}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                    {selectedServiceOptions.map((option, index) => {
                      const isChecked = selectedOptionIds.includes(option.id);

                      return (
                        <label
                          key={option.id}
                          className="flex items-center gap-4 px-5 py-4 cursor-pointer"
                          style={{
                            borderBottom: index < selectedServiceOptions.length - 1 ? '1px solid var(--border)' : 'none',
                            background: isChecked ? 'rgba(212,165,32,0.08)' : index % 2 === 0 ? 'var(--muted)' : 'var(--card)',
                          }}
                        >
                          <span className="flex-1" style={{ fontFamily: 'var(--font-heading)', color: 'var(--foreground)', fontSize: '1rem' }}>
                            {option.name}
                          </span>
                          <span style={{ fontFamily: 'var(--font-body)', color: 'var(--muted-foreground)', fontSize: '0.78rem' }}>
                            {formatDurationLabel(option.duration)}
                          </span>
                          <span style={{ fontFamily: 'var(--font-body)', color: 'var(--gold)', fontSize: '0.82rem', minWidth: '6.5rem', textAlign: 'right' }}>
                            {formatPrice(option.price)}
                          </span>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleOptionToggle(option.id)}
                            className="h-5 w-5 accent-gold"
                          />
                        </label>
                      );
                    })}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="rounded-xl px-4 py-3" style={{ background: 'rgba(212,165,32,0.08)', border: '1px solid rgba(212,165,32,0.25)' }}>
                      <p style={{ fontFamily: 'var(--font-body)', color: 'var(--muted-foreground)', fontSize: '0.75rem' }}>Total</p>
                      <p style={{ fontFamily: 'var(--font-heading)', color: 'var(--foreground)', fontSize: '1.25rem', marginTop: '0.15rem' }}>
                        {formatPrice(selectedTotalPrice)}
                      </p>
                    </div>
                    <div className="rounded-xl px-4 py-3" style={{ background: 'var(--muted)', border: '1px solid var(--border)' }}>
                      <p style={{ fontFamily: 'var(--font-body)', color: 'var(--muted-foreground)', fontSize: '0.75rem' }}>Time</p>
                      <p style={{ fontFamily: 'var(--font-heading)', color: 'var(--foreground)', fontSize: '1.25rem', marginTop: '0.15rem' }}>
                        {selectedTotalDuration ? formatDurationLabel(selectedTotalDuration) : 'Select options'}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedService(null);
                      setSelectedOptionIds([]);
                    }}
                    style={{
                      fontFamily: 'var(--font-body)',
                      color: 'var(--gold)',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      fontSize: '0.85rem',
                    }}
                  >
                    Change service
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 2 – Date & Time */}
          {step === 2 && (
            <div className="space-y-6">
              <h3 className="flex items-center gap-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--foreground)', fontSize: '1.4rem' }}>
                <CalendarIcon className="w-5 h-5" style={{ color: 'var(--gold)' }} />
                Select Date & Time
              </h3>

              <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-6">
                <div className="space-y-4">
                  <label style={{ fontFamily: 'var(--font-body)', color: 'var(--foreground)', fontSize: '0.875rem', display: 'block' }}>
                    Pick a date
                  </label>
                  <DatePickerCalendar
                    mode="single"
                    selected={selectedCalendarDate}
                    fromDate={firstAvailableDate ? dateToLocalDate(firstAvailableDate) : undefined}
                    toDate={lastAvailableDate ? dateToLocalDate(lastAvailableDate) : undefined}
                    disabled={(date) => !selectableDateKeys.has(localDateKey(date))}
                    onSelect={(date) => {
                      setSelectedDate(date ? localDateKey(date) : null);
                      setSelectedTime(null);
                    }}
                    className="w-full rounded-xl border border-border bg-input-background text-foreground"
                    classNames={{
                      months: 'flex w-full flex-col',
                      month: 'flex w-full flex-col gap-4',
                      caption: 'relative flex w-full items-center justify-center pt-1',
                      caption_label: 'text-sm font-medium text-foreground',
                      nav: 'flex items-center gap-1',
                      nav_button: 'absolute top-0 inline-flex size-7 items-center justify-center rounded-md border border-border bg-transparent p-0 text-gold opacity-75 transition hover:bg-secondary hover:opacity-100',
                      nav_button_previous: 'left-1',
                      nav_button_next: 'right-1',
                      table: 'w-full border-collapse',
                      head_row: 'grid grid-cols-7',
                      head_cell: 'text-muted-foreground rounded-md text-center text-[0.75rem] font-normal',
                      row: 'grid grid-cols-7 mt-2',
                      cell: 'relative p-0 text-center text-sm',
                      day: 'mx-auto flex size-9 items-center justify-center rounded-md p-0 text-sm font-normal text-foreground transition hover:bg-secondary hover:text-gold-light disabled:pointer-events-none disabled:opacity-30',
                      day_selected: 'bg-gold text-primary-foreground hover:bg-gold hover:text-primary-foreground focus:bg-gold focus:text-primary-foreground',
                      day_today: 'border border-gold/50 text-gold',
                      day_outside: 'text-muted-foreground opacity-30',
                      day_disabled: 'text-muted-foreground opacity-30',
                    }}
                  />
                  {selectedDateOption && (
                    <div
                      className="rounded-xl px-4 py-3"
                      style={{
                        background: 'rgba(212,165,32,0.08)',
                        border: '1px solid rgba(212,165,32,0.25)',
                      }}
                    >
                      <p style={{ fontFamily: 'var(--font-heading)', color: 'var(--foreground)', fontSize: '1rem' }}>
                        {selectedDateOption.label}
                      </p>
                      <p style={{ fontFamily: 'var(--font-body)', color: 'var(--muted-foreground)', fontSize: '0.78rem', marginTop: '0.2rem' }}>
                        {selectedDateOption.date}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {barbers.length > 0 && (
                    <div className="space-y-3">
                      <div>
                        <h4 className="flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--foreground)', fontSize: '1.05rem' }}>
                          <User className="w-4 h-4" style={{ color: 'var(--gold)' }} />
                          {selectedStaffRoleLabel}
                          {selectedStaff && (
                            <span style={{ fontFamily: 'var(--font-body)', color: 'var(--gold)', fontSize: '0.82rem' }}>
                              ({selectedStaff.name})
                            </span>
                          )}
                        </h4>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {barbers.map((barber) => {
                          const isSelected = selectedStaffId === barber.id;
                          const barberSlots = selectedDateOption?.staffSlots?.[barber.id] ?? [];
                          const avatarUrl = barberAvatarUrl(barber);

                          return (
                            <button
                              key={barber.id}
                              type="button"
                              aria-label={`Select ${barber.name}`}
                              title={`${barber.name}${barber.isMain ? ` - Main ${selectedStaffRoleLabel.toLowerCase()}` : ` - ${barberSlots.length} slots available`}`}
                              onClick={() => {
                                setSelectedStaffId(barber.id);
                                if (selectedTime && !barberSlots.includes(selectedTime)) {
                                  setSelectedTime(null);
                                }
                              }}
                              style={{
                                width: '4.25rem',
                                height: '4.25rem',
                                borderRadius: '9999px',
                                border: isSelected ? '2px solid var(--gold)' : '1px solid var(--border)',
                                background: isSelected ? 'rgba(212,165,32,0.12)' : 'var(--muted)',
                                padding: '0.2rem',
                                cursor: 'pointer',
                                boxShadow: isSelected ? '0 0 0 4px rgba(212,165,32,0.12)' : 'none',
                                transition: 'border-color 0.15s, box-shadow 0.15s, transform 0.15s',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = 'var(--gold)';
                                e.currentTarget.style.transform = 'translateY(-1px)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = isSelected ? 'var(--gold)' : 'var(--border)';
                                e.currentTarget.style.transform = 'translateY(0)';
                              }}
                            >
                              {avatarUrl ? (
                                <img
                                  src={avatarUrl}
                                  alt={barber.name}
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: '9999px',
                                    objectFit: 'cover',
                                    display: 'block',
                                  }}
                                />
                              ) : (
                                <span
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: '9999px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--gold)',
                                    background: 'var(--card)',
                                  }}
                                >
                                  <User className="w-6 h-6" />
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                      {selectedStaff && (
                        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--muted-foreground)', fontSize: '0.75rem' }}>
                          {selectedStaff.isMain ? `Main ${selectedStaffRoleLabel.toLowerCase()} selected` : `${selectedStaff.name} selected`}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-4">
                    <h4 className="flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--foreground)', fontSize: '1.05rem' }}>
                      <Clock className="w-4 h-4" style={{ color: 'var(--gold)' }} />
                      {selectedStaff ? `${selectedStaff.name}'s Times` : 'Available Times'}
                    </h4>
                  </div>
                  {selectedTime && selectedTimeEnd && (
                    <p style={{ fontFamily: 'var(--font-body)', color: 'var(--gold)', fontSize: '0.78rem' }}>
                      Appointment holds {formatTimeLabel(selectedTime)} - {formatTimeLabel(selectedTimeEnd)}
                    </p>
                  )}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {allTimeSlots.map((time) => {
                      const isAvailable = availableTimeSlotSet.has(time);
                      const isBooked = bookedTimeSlotSet.has(time);
                      const isSelected = selectedTime === time;
                      const isHeld = !isSelected && heldTimeSlotSet.has(time);
                      return (
                        <button
                          key={time}
                          onClick={() => {
                            if (isAvailable) {
                              setSelectedTime(time);
                            }
                          }}
                          style={{
                            ...(isSelected ? selectionActive : selectionBase),
                            minHeight: '3.75rem',
                            padding: '0.65rem 0.5rem',
                            textAlign: 'center',
                            cursor: isAvailable ? 'pointer' : 'not-allowed',
                            opacity: isAvailable ? 1 : 0.48,
                            border: isHeld ? '1px solid rgba(212,165,32,0.55)' : (isSelected ? selectionActive.border : selectionBase.border),
                            background: isSelected
                              ? 'rgba(212,165,32,0.08)'
                              : isHeld
                                ? 'rgba(212,165,32,0.12)'
                              : isAvailable
                                ? 'var(--muted)'
                                : 'rgba(154,120,48,0.08)',
                          }}
                          onMouseEnter={(e) => { if (isAvailable && !isSelected) (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(212,165,32,0.3)'; }}
                          onMouseLeave={(e) => { if (isAvailable && !isSelected) (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; }}
                          disabled={!isAvailable}
                        >
                          <span style={{ fontFamily: 'var(--font-body)', color: isAvailable ? 'var(--foreground)' : 'var(--muted-foreground)', fontSize: '0.875rem' }}>
                            {formatTimeLabel(time)}
                          </span>
                          {!isAvailable && (
                            <span style={{ display: 'block', fontFamily: 'var(--font-body)', color: 'var(--muted-foreground)', fontSize: '0.68rem', marginTop: '0.15rem' }}>
                              {isBooked ? 'Booked' : 'Unavailable'}
                            </span>
                          )}
                          {isSelected && selectedTimeEnd && selectedTotalDuration > 60 && (
                            <span style={{ display: 'block', fontFamily: 'var(--font-body)', color: 'var(--gold)', fontSize: '0.68rem', marginTop: '0.15rem' }}>
                              Start
                            </span>
                          )}
                          {isHeld && (
                            <span style={{ display: 'block', fontFamily: 'var(--font-body)', color: 'var(--gold)', fontSize: '0.68rem', marginTop: '0.15rem' }}>
                              Held
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {!selectedDate && (
                    <p style={{ fontFamily: 'var(--font-body)', color: 'var(--muted-foreground)', fontSize: '0.9rem' }}>
                      Pick a date to see available time slots.
                    </p>
                  )}
                  {selectedDate && availableTimeSlots.length === 0 && (
                    <p style={{ fontFamily: 'var(--font-body)', color: 'var(--muted-foreground)', fontSize: '0.9rem' }}>
                      No available slots for {selectedStaff?.name ?? `this ${selectedStaffRoleLabel.toLowerCase()}`} on this date. Please choose another {selectedStaffRoleLabel.toLowerCase()} or date.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3 – Details */}
          {step === 3 && (
            <div className="space-y-6">
              <h3 className="flex items-center gap-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--foreground)', fontSize: '1.4rem' }}>
                <User className="w-5 h-5" style={{ color: 'var(--gold)' }} />
                Your Details
              </h3>
              <div className="space-y-4">
                {[
                  { label: 'Full Name *', type: 'text', key: 'name', placeholder: 'Enter your full name' },
                  { label: 'Mobile Number *', type: 'tel', key: 'phone', placeholder: '07X XXX XXXX' },
                  { label: 'Email Address (Optional)', type: 'email', key: 'email', placeholder: 'your@email.com' },
                ].map(({ label, type, key, placeholder }) => (
                  <div key={key}>
                    <label style={{ fontFamily: 'var(--font-body)', color: 'var(--foreground)', fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' }}>
                      {label}
                    </label>
                    <input
                      type={type}
                      value={customerDetails[key as keyof typeof customerDetails]}
                      onChange={(e) => setCustomerDetails({ ...customerDetails, [key]: e.target.value })}
                      placeholder={placeholder}
                      style={inputBase}
                      onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--gold)')}
                      onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
                    />
                  </div>
                ))}
                <div>
                  <label style={{ fontFamily: 'var(--font-body)', color: 'var(--foreground)', fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' }}>
                    Special Note (Optional)
                  </label>
                  <textarea
                    value={customerDetails.note}
                    onChange={(e) => setCustomerDetails({ ...customerDetails, note: e.target.value })}
                    rows={3}
                    placeholder="Any special requests or requirements..."
                    style={{ ...inputBase, resize: 'vertical' }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--gold)')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4 – Summary */}
          {step === 4 && (
            <div className="space-y-6">
              <h3 className="flex items-center gap-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--foreground)', fontSize: '1.4rem' }}>
                <CheckCircle className="w-5 h-5" style={{ color: 'var(--gold)' }} />
                Confirm Booking
              </h3>
              <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                {[
                  { label: 'Service', value: selectedService?.name },
                  { label: 'Options', value: selectedOptionLabels },
                  { label: 'Date', value: `${dates.find(d => d.date === selectedDate)?.label} (${selectedDate})` },
                  { label: 'Time', value: selectedTime ? formatTimeLabel(selectedTime) : null },
                  { label: selectedStaffRoleLabel, value: selectedStaff?.name },
                  { label: 'Duration', value: selectedTotalDuration ? formatDurationLabel(selectedTotalDuration) : selectedService?.duration },
                  { label: 'Price', value: formatPrice(selectedTotalPrice) },
                  { label: 'Customer', value: customerDetails.name },
                  { label: 'Contact', value: customerDetails.phone },
                ].map(({ label, value }, i, arr) => (
                  <div
                    key={i}
                    className="flex justify-between items-center px-5 py-3.5"
                    style={{
                      borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
                      background: i % 2 === 0 ? 'var(--muted)' : 'var(--card)',
                    }}
                  >
                    <span style={{ fontFamily: 'var(--font-body)', color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>{label}</span>
                    <span style={{ fontFamily: 'var(--font-body)', color: 'var(--foreground)', fontSize: '0.875rem' }}>{value}</span>
                  </div>
                ))}
              </div>
              {submitError && (
                <p style={{ fontFamily: 'var(--font-body)', color: 'var(--gold-light)', fontSize: '0.9rem' }}>
                  {submitError}
                </p>
              )}
              {isUsingFallbackBookingOptions && (
                <p style={{ fontFamily: 'var(--font-body)', color: 'var(--gold-light)', fontSize: '0.9rem' }}>
                  Online booking is not connected yet. These slots are shown for preview only.
                </p>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
            {step > 1 ? (
              <button
                onClick={handleBack}
                className="flex items-center gap-2"
                style={{
                  fontFamily: 'var(--font-body)',
                  padding: '0.7rem 1.5rem',
                  borderRadius: '9999px',
                  border: '1px solid var(--border)',
                  background: 'transparent',
                  color: 'var(--foreground)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(212,165,32,0.4)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
              >
                <ChevronLeft size={18} />
                Back
              </button>
            ) : <div />}

            {step < stepLabels.length ? (
              <button
                onClick={handleNext}
                disabled={!canProceed}
                className="flex items-center gap-2 ml-auto"
                style={{
                  fontFamily: 'var(--font-body)',
                  padding: '0.7rem 1.75rem',
                  borderRadius: '9999px',
                  background: canProceed
                    ? 'linear-gradient(135deg, var(--gold-dark), var(--gold))'
                    : 'var(--card)',
                  color: canProceed ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
                  border: canProceed ? 'none' : '1px solid var(--border)',
                  cursor: canProceed ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s',
                  boxShadow: canProceed ? '0 4px 16px rgba(212,165,32,0.25)' : 'none',
                }}
                onMouseEnter={(e) => { if (canProceed) (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 24px rgba(212,165,32,0.4)'; }}
                onMouseLeave={(e) => { if (canProceed) (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 16px rgba(212,165,32,0.25)'; }}
              >
                Next
                <ChevronRight size={18} />
              </button>
            ) : (
              <button
                onClick={handleConfirmBooking}
                disabled={isSubmitting || isUsingFallbackBookingOptions}
                className="ml-auto"
                style={{
                  fontFamily: 'var(--font-body)',
                  padding: '0.7rem 2rem',
                  borderRadius: '9999px',
                  background: isUsingFallbackBookingOptions ? 'var(--card)' : 'linear-gradient(135deg, var(--gold-dark), var(--gold))',
                  color: isUsingFallbackBookingOptions ? 'var(--muted-foreground)' : 'var(--primary-foreground)',
                  border: isUsingFallbackBookingOptions ? '1px solid var(--border)' : 'none',
                  cursor: isSubmitting || isUsingFallbackBookingOptions ? 'not-allowed' : 'pointer',
                  boxShadow: isUsingFallbackBookingOptions ? 'none' : '0 4px 16px rgba(212,165,32,0.25)',
                  transition: 'box-shadow 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (!isUsingFallbackBookingOptions) e.currentTarget.style.boxShadow = '0 6px 24px rgba(212,165,32,0.4)';
                }}
                onMouseLeave={(e) => {
                  if (!isUsingFallbackBookingOptions) e.currentTarget.style.boxShadow = '0 4px 16px rgba(212,165,32,0.25)';
                }}
              >
                {isSubmitting ? 'Submitting...' : isUsingFallbackBookingOptions ? 'Booking Offline' : 'Confirm Booking'}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
